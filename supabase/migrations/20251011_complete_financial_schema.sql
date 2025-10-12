-- Migration: Complete Financial Database Schema
-- Date: 2025-10-11
-- Description: Implementa tabelas adicionais para sistema financeiro completo

-- 1. Tabela de Budgets (Orçamentos)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_amount NUMERIC(12, 2) NOT NULL,
  spent_amount NUMERIC(12, 2) DEFAULT 0,
  period_type VARCHAR(20) CHECK (period_type IN ('monthly', 'quarterly', 'yearly', 'custom')) DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Budget Categories (Categorias do Orçamento)
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  allocated_amount NUMERIC(12, 2) NOT NULL,
  spent_amount NUMERIC(12, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(budget_id, category_id)
);

-- 3. Tabela de Financial Accounts (Contas Financeiras)
CREATE TABLE IF NOT EXISTS financial_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) CHECK (account_type IN ('checking', 'savings', 'credit_card', 'investment', 'crypto', 'cash')) NOT NULL,
  institution VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'BRL',
  current_balance NUMERIC(15, 2) DEFAULT 0,
  credit_limit NUMERIC(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  account_number VARCHAR(100),
  routing_number VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Financial Reports (Relatórios Financeiros)
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  report_type VARCHAR(50) CHECK (report_type IN ('monthly', 'quarterly', 'yearly', 'custom')) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_income NUMERIC(15, 2) DEFAULT 0,
  total_expenses NUMERIC(15, 2) DEFAULT 0,
  net_worth NUMERIC(15, 2) DEFAULT 0,
  savings_rate NUMERIC(5, 2) DEFAULT 0, -- Percentage
  report_data JSONB, -- Detailed breakdown data
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Debt Management (Gestão de Dívidas)
CREATE TABLE IF NOT EXISTS debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  creditor VARCHAR(255),
  debt_type VARCHAR(50) CHECK (debt_type IN ('credit_card', 'loan', 'mortgage', 'student_loan', 'personal', 'other')) NOT NULL,
  original_amount NUMERIC(15, 2) NOT NULL,
  current_balance NUMERIC(15, 2) NOT NULL,
  minimum_payment NUMERIC(12, 2) NOT NULL,
  interest_rate NUMERIC(5, 4), -- APR as decimal (e.g., 0.1599 for 15.99%)
  due_date DATE,
  payment_frequency VARCHAR(20) CHECK (payment_frequency IN ('weekly', 'biweekly', 'monthly', 'quarterly')) DEFAULT 'monthly',
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabela de Debt Payments (Pagamentos de Dívidas)
CREATE TABLE IF NOT EXISTS debt_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id UUID REFERENCES debts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_amount NUMERIC(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  principal_amount NUMERIC(12, 2) DEFAULT 0,
  interest_amount NUMERIC(12, 2) DEFAULT 0,
  remaining_balance NUMERIC(15, 2) NOT NULL,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabela de Subscription Management (Gestão de Assinaturas)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  billing_frequency VARCHAR(20) CHECK (billing_frequency IN ('weekly', 'monthly', 'quarterly', 'semi_annually', 'annually')) NOT NULL,
  next_billing_date DATE NOT NULL,
  last_billing_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  cancellation_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabela de Tax Information (Informações Fiscais)
CREATE TABLE IF NOT EXISTS tax_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) CHECK (document_type IN ('w2', '1099', 'receipt', 'invoice', 'tax_return', 'other')) NOT NULL,
  tax_year INTEGER NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_url TEXT,
  amount NUMERIC(15, 2),
  category VARCHAR(100),
  is_deductible BOOLEAN DEFAULT FALSE,
  notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabela de Financial Alerts (Alertas Financeiros)
CREATE TABLE IF NOT EXISTS financial_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) CHECK (alert_type IN ('budget_exceeded', 'bill_due', 'low_balance', 'investment_change', 'subscription_renewal', 'goal_milestone', 'unusual_spending')) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('info', 'warning', 'critical')) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  related_entity_type VARCHAR(50), -- 'budget', 'account', 'goal', etc.
  related_entity_id UUID,
  action_url TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabela de Currency Exchange Rates (Taxas de Câmbio)
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency VARCHAR(3) NOT NULL,
  to_currency VARCHAR(3) NOT NULL,
  rate NUMERIC(15, 8) NOT NULL,
  date DATE NOT NULL,
  source VARCHAR(50) DEFAULT 'api',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(from_currency, to_currency, date)
);

-- 11. Melhorar tabela de usuários com campos adicionais
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(2) DEFAULT 'BR';
ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo';
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'BRL';
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY';
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- 12. Melhorar tabela de configurações do usuário
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS budget_alerts BOOLEAN DEFAULT TRUE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS bill_reminders BOOLEAN DEFAULT TRUE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS investment_alerts BOOLEAN DEFAULT TRUE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS weekly_summary BOOLEAN DEFAULT TRUE;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS data_export_format VARCHAR(20) DEFAULT 'csv';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;

-- Enable RLS for new tables
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables
CREATE POLICY "Users can manage their own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own budget categories" ON budget_categories FOR ALL USING (auth.uid() IN (SELECT user_id FROM budgets WHERE id = budget_id));
CREATE POLICY "Users can manage their own financial accounts" ON financial_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own financial reports" ON financial_reports FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own debts" ON debts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own debt payments" ON debt_payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own subscriptions" ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own tax documents" ON tax_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own financial alerts" ON financial_alerts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view exchange rates" ON exchange_rates FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id_date ON transactions (user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions (category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id_active ON budgets (user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_user_id_active ON financial_accounts (user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_debts_user_id_active ON debts (user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id_active ON subscriptions (user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_financial_alerts_user_id_read ON financial_alerts (user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_goals_user_id_completed ON goals (user_id, is_completed);

-- Create functions for automatic calculations

-- Function to update budget spent amounts
CREATE OR REPLACE FUNCTION update_budget_spent_amounts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update budget category spent amount
  UPDATE budget_categories 
  SET spent_amount = (
    SELECT COALESCE(SUM(amount), 0)
    FROM transactions t
    JOIN budgets b ON b.id = budget_categories.budget_id
    WHERE t.user_id = b.user_id
      AND t.category_id = budget_categories.category_id
      AND t.date BETWEEN b.start_date AND b.end_date
      AND t.type = 'expense'
  )
  WHERE category_id = COALESCE(NEW.category_id, OLD.category_id);

  -- Update total budget spent amount
  UPDATE budgets
  SET spent_amount = (
    SELECT COALESCE(SUM(bc.spent_amount), 0)
    FROM budget_categories bc
    WHERE bc.budget_id = budgets.id
  )
  WHERE id IN (
    SELECT budget_id FROM budget_categories 
    WHERE category_id = COALESCE(NEW.category_id, OLD.category_id)
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update budget amounts when transactions change
DROP TRIGGER IF EXISTS update_budget_on_transaction_change ON transactions;
CREATE TRIGGER update_budget_on_transaction_change
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_budget_spent_amounts();

-- Function to update account balances
CREATE OR REPLACE FUNCTION update_account_balance()
RETURNS TRIGGER AS $$
BEGIN
  -- This is a placeholder - in a real app, account balances would be updated
  -- based on transaction imports or manual updates, not calculated from transactions
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to create default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO categories (user_id, name, type, color) VALUES
    (user_uuid, 'Alimentação', 'expense', '#FF6B6B'),
    (user_uuid, 'Transporte', 'expense', '#4ECDC4'),
    (user_uuid, 'Moradia', 'expense', '#45B7D1'),
    (user_uuid, 'Saúde', 'expense', '#96CEB4'),
    (user_uuid, 'Educação', 'expense', '#FECA57'),
    (user_uuid, 'Entretenimento', 'expense', '#FF9FF3'),
    (user_uuid, 'Compras', 'expense', '#54A0FF'),
    (user_uuid, 'Serviços', 'expense', '#5F27CD'),
    (user_uuid, 'Salário', 'income', '#00D2D3'),
    (user_uuid, 'Freelance', 'income', '#FF9F43'),
    (user_uuid, 'Investimentos', 'income', '#54A0FF'),
    (user_uuid, 'Outros', 'expense', '#DDD');
END;
$$ LANGUAGE plpgsql;

-- Update the handle_new_user function to create default categories
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

  -- Create default categories
  PERFORM create_default_categories(NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for financial summary
CREATE OR REPLACE VIEW user_financial_summary AS
SELECT 
  u.id as user_id,
  u.name,
  u.email,
  u.plan,
  COALESCE(income.total, 0) as total_income,
  COALESCE(expenses.total, 0) as total_expenses,
  COALESCE(income.total, 0) - COALESCE(expenses.total, 0) as net_income,
  COALESCE(accounts.total_balance, 0) as total_balance,
  COALESCE(debts.total_debt, 0) as total_debt,
  COALESCE(investments.total_value, 0) as total_investments,
  COALESCE(goals.completed_goals, 0) as completed_goals,
  COALESCE(goals.total_goals, 0) as total_goals
FROM users u
LEFT JOIN (
  SELECT user_id, SUM(amount) as total
  FROM transactions 
  WHERE type = 'income' AND date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
) income ON income.user_id = u.id
LEFT JOIN (
  SELECT user_id, SUM(amount) as total
  FROM transactions 
  WHERE type = 'expense' AND date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY user_id
) expenses ON expenses.user_id = u.id
LEFT JOIN (
  SELECT user_id, SUM(current_balance) as total_balance
  FROM financial_accounts 
  WHERE is_active = true
  GROUP BY user_id
) accounts ON accounts.user_id = u.id
LEFT JOIN (
  SELECT user_id, SUM(current_balance) as total_debt
  FROM debts 
  WHERE is_active = true
  GROUP BY user_id
) debts ON debts.user_id = u.id
LEFT JOIN (
  SELECT user_id, SUM(quantity * current_price) as total_value
  FROM investments
  GROUP BY user_id
) investments ON investments.user_id = u.id
LEFT JOIN (
  SELECT 
    user_id, 
    COUNT(*) as total_goals,
    COUNT(*) FILTER (WHERE is_completed = true) as completed_goals
  FROM goals
  GROUP BY user_id
) goals ON goals.user_id = u.id;

-- Insert default exchange rates (BRL base)
INSERT INTO exchange_rates (from_currency, to_currency, rate, date) VALUES
  ('BRL', 'USD', 0.20, CURRENT_DATE),
  ('USD', 'BRL', 5.00, CURRENT_DATE),
  ('BRL', 'EUR', 0.18, CURRENT_DATE),
  ('EUR', 'BRL', 5.50, CURRENT_DATE)
ON CONFLICT (from_currency, to_currency, date) DO NOTHING;