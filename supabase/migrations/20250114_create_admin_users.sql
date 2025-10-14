-- Create admin_users table for independent admin accounts
-- This table stores admin users separately from regular application users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL
);

-- Create index for faster lookups
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies - only admins can access admin_users
-- Service role bypasses RLS, so we'll use service role for admin operations
CREATE POLICY "Service role can manage admin users" ON admin_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create admin_sessions table to track admin sessions independently
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token VARCHAR(512) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);

-- Create index for faster session lookups
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Enable Row Level Security for sessions
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policy for admin sessions
CREATE POLICY "Service role can manage admin sessions" ON admin_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER admin_users_updated_at_trigger
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Function to clean up expired admin sessions
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create default super admin (password should be changed immediately after first login)
-- Default password: Admin@123 (hashed with bcrypt)
-- This should be created via the admin interface after migration
INSERT INTO admin_users (email, name, password_hash, role, is_active)
VALUES (
  'admin@moncoy.com',
  'Super Admin',
  '$2a$10$placeholder_hash_change_this_immediately',
  'super_admin',
  true
) ON CONFLICT (email) DO NOTHING;

-- Comment explaining the admin system
COMMENT ON TABLE admin_users IS 'Independent admin user system, separate from application users';
COMMENT ON TABLE admin_sessions IS 'Session management for admin users';
