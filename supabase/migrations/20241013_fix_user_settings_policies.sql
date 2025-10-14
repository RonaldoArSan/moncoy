-- Fix user_settings policies to ensure proper access

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow users to access their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users manage own settings" ON user_settings;

-- Create comprehensive policies for user_settings
CREATE POLICY "Users can read own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON user_settings
  FOR DELETE USING (auth.uid() = user_id);

-- Ensure the trigger function exists and is updated
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();