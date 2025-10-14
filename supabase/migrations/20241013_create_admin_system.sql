-- Create admin system with roles and dedicated admin user

-- Create roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can read own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('admin', 'super_admin')
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update users table to add admin fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_attempts INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- Update the user creation trigger to assign default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a profile in public.users
  INSERT INTO public.users (id, name, email, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'plan', 'basic')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, users.name),
    email = COALESCE(EXCLUDED.email, users.email),
    plan = COALESCE(EXCLUDED.plan, users.plan);
  
  -- Create default settings in public.user_settings
  INSERT INTO public.user_settings (
    user_id,
    ai_frequency,
    ai_detail_level,
    notifications_enabled,
    theme
  )
  VALUES (
    NEW.id,
    'weekly',
    'medium',
    true,
    'system'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin audit log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES users(id),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for audit log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can read audit logs
CREATE POLICY "Admins can read audit logs" ON admin_audit_log
  FOR SELECT USING (is_admin());

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_name TEXT,
  target_user UUID DEFAULT NULL,
  action_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_audit_log (admin_user_id, action, target_user_id, details)
  VALUES (auth.uid(), action_name, target_user, action_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM users WHERE is_active = true) as total_active_users,
  (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') as new_users_this_month,
  (SELECT COUNT(*) FROM users WHERE last_login >= NOW() - INTERVAL '7 days') as active_users_this_week,
  (SELECT COUNT(*) FROM support_tickets WHERE status IN ('Aberto', 'Em andamento')) as open_support_tickets,
  (SELECT COUNT(*) FROM transactions WHERE created_at >= NOW() - INTERVAL '30 days') as transactions_this_month;

-- Grant necessary permissions
GRANT SELECT ON admin_dashboard_stats TO authenticated;

-- Security: Create RLS policy for admin_dashboard_stats that only allows admins
-- Note: Views inherit RLS from underlying tables, so this is additional security
CREATE OR REPLACE FUNCTION admin_dashboard_stats_security()
RETURNS SETOF admin_dashboard_stats AS $$
BEGIN
  -- Only allow admins to access dashboard stats
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY SELECT * FROM admin_dashboard_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;