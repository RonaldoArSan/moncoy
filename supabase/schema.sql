-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  plan VARCHAR(50) DEFAULT 'basic',
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  stripe_customer_id TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  ai_frequency VARCHAR(50) DEFAULT 'weekly',
  ai_detail_level VARCHAR(50) DEFAULT 'medium',
  openai_api_key VARCHAR(255),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  theme VARCHAR(50) DEFAULT 'system',
  currency VARCHAR(10) DEFAULT 'BRL',
  language VARCHAR(10) DEFAULT 'pt-BR',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
  email_notifications BOOLEAN DEFAULT TRUE,
  budget_alerts BOOLEAN DEFAULT TRUE,
  goal_reminders BOOLEAN DEFAULT TRUE,
  monthly_reports BOOLEAN DEFAULT TRUE,
  ai_insights_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255),
  type VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  amount NUMERIC(10, 2) CHECK (amount > 0),
  type VARCHAR(50),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  date DATE,
  status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'cancelled', 'overdue', 'due_soon')),
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  receipt_url TEXT,
  merchant VARCHAR(255),
  payment_method VARCHAR(50),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_frequency VARCHAR(50) CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  recurring_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  target_amount NUMERIC(10, 2) CHECK (target_amount > 0),
  current_amount NUMERIC(10, 2) CHECK (current_amount >= 0),
  deadline DATE,
  target_date DATE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  priority VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT goals_current_not_exceed_target CHECK (current_amount <= target_amount)
);

-- Create investments table
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  asset_name VARCHAR(255),
  asset_type VARCHAR(50),
  quantity NUMERIC(10, 4) CHECK (quantity > 0),
  avg_price NUMERIC(10, 2) CHECK (avg_price >= 0),
  current_price NUMERIC(10, 2),
  broker VARCHAR(255),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create investment_transactions table
CREATE TABLE investment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
  operation_type VARCHAR(50),
  quantity NUMERIC(10, 4),
  price NUMERIC(10, 2),
  total_value NUMERIC(10, 2),
  date DATE,
  broker VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bank_accounts table
CREATE TABLE bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bank_name VARCHAR(255),
  account_type VARCHAR(255),
  account_number VARCHAR(255),
  balance NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_insights table
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(255),
  title TEXT,
  content TEXT,
  priority VARCHAR(50),
  potential_savings NUMERIC(10, 2),
  is_dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create recurring_transactions table
CREATE TABLE recurring_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  amount NUMERIC(10, 2),
  type VARCHAR(50),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  frequency VARCHAR(50), -- 'monthly', 'weekly', 'yearly'
  start_date DATE,
  end_date DATE,
  day_of_month INTEGER, -- for monthly: 1-31
  day_of_week INTEGER, -- for weekly: 0-6 (Sunday-Saturday)
  is_active BOOLEAN DEFAULT TRUE,
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create commitments table
CREATE TABLE commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'cancelado')),
  type VARCHAR(50) DEFAULT 'other' CHECK (type IN ('income', 'expense', 'investment', 'meeting', 'other')),
  amount NUMERIC(15, 2),
  category VARCHAR(255),
  recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern VARCHAR(50) CHECK (recurring_pattern IN ('daily', 'weekly', 'monthly', 'yearly')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_usage table
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('basic', 'professional', 'premium')),
  question_count INTEGER DEFAULT 0 CHECK (question_count >= 0),
  last_reset_date TIMESTAMPTZ DEFAULT NOW(),
  last_question_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(50) DEFAULT 'Média' CHECK (priority IN ('Baixa', 'Média', 'Alta', 'Crítica')),
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create support_settings table
CREATE TABLE support_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  allow_notifications BOOLEAN DEFAULT TRUE,
  preferred_contact VARCHAR(20) DEFAULT 'email' CHECK (preferred_contact IN ('email', 'phone', 'both')),
  business_hours_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow users to access their own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow users to insert their own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to access their own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to access their own categories" ON categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to access their own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to access their own goals" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to access their own investments" ON investments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to access their own investment transactions" ON investment_transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to access their own bank accounts" ON bank_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to access their own AI insights" ON ai_insights FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow users to access their own recurring transactions" ON recurring_transactions FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for notifications
CREATE POLICY "Allow users to access their own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for commitments
CREATE POLICY "Allow users to access their own commitments" ON commitments FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for ai_usage
CREATE POLICY "Allow users to access their own AI usage" ON ai_usage FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for support_tickets
CREATE POLICY "Allow users to access their own support tickets" ON support_tickets FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for support_settings
CREATE POLICY "Allow users to access their own support settings" ON support_settings FOR ALL USING (auth.uid() = user_id);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status) WHERE status IN ('pending', 'overdue', 'due_soon');

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON goals(deadline) WHERE is_completed = false;

CREATE INDEX IF NOT EXISTS idx_investments_user_id ON investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_user_id ON investment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_date ON investment_transactions(date DESC);

CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_id ON recurring_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_active ON recurring_transactions(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;

CREATE INDEX IF NOT EXISTS idx_commitments_user_id ON commitments(user_id);
CREATE INDEX IF NOT EXISTS idx_commitments_date ON commitments(date DESC);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status) WHERE status != 'closed';

CREATE INDEX IF NOT EXISTS idx_categories_user_id_type ON categories(user_id, type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);

-- Function to create a user profile and settings when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a profile in public.users
  INSERT INTO public.users (id, name, email, plan)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.email,
    'basic'
  );
  
  -- Create default settings in public.user_settings
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_investments_updated_at BEFORE UPDATE ON investments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_recurring_transactions_updated_at BEFORE UPDATE ON recurring_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_commitments_updated_at BEFORE UPDATE ON commitments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_ai_usage_updated_at BEFORE UPDATE ON ai_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_support_settings_updated_at BEFORE UPDATE ON support_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-complete goals when they reach target amount
CREATE OR REPLACE FUNCTION public.auto_complete_goal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_amount >= NEW.target_amount THEN
    NEW.status = 'completed';
    NEW.is_completed = true;
  ELSIF NEW.is_completed = false AND NEW.status = 'completed' THEN
    NEW.is_completed = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_goal_completion 
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION auto_complete_goal();
