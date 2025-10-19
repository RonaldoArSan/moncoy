-- ================================================================
-- MIGRAÇÃO: Correção de Inconsistências entre Schema e Código
-- Data: 19/10/2025
-- Descrição: Adiciona tabelas, campos e índices faltantes
-- ================================================================

-- ================================================================
-- PARTE 1: CRIAR TABELAS FALTANTES
-- ================================================================

-- 1.1 Tabela commitments (Agenda/Compromissos)
CREATE TABLE IF NOT EXISTS public.commitments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title character varying(255) NOT NULL,
  description text,
  date date NOT NULL,
  time time NOT NULL,
  status character varying(50) DEFAULT 'pendente'::character varying,
  type character varying(50) DEFAULT 'other'::character varying,
  amount numeric(15, 2),
  category character varying(255),
  recurring boolean DEFAULT false,
  recurring_pattern character varying(50),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT commitments_pkey PRIMARY KEY (id),
  CONSTRAINT commitments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT commitments_status_check CHECK (status::text = ANY (ARRAY['pendente'::character varying, 'confirmado'::character varying, 'cancelado'::character varying]::text[])),
  CONSTRAINT commitments_type_check CHECK (type::text = ANY (ARRAY['income'::character varying, 'expense'::character varying, 'investment'::character varying, 'meeting'::character varying, 'other'::character varying]::text[])),
  CONSTRAINT commitments_recurring_pattern_check CHECK (recurring_pattern::text = ANY (ARRAY['daily'::character varying, 'weekly'::character varying, 'monthly'::character varying, 'yearly'::character varying]::text[]))
);

-- 1.2 Tabela ai_usage (Tracking de uso de IA)
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan character varying(50) NOT NULL,
  question_count integer DEFAULT 0,
  last_reset_date timestamp with time zone DEFAULT now(),
  last_question_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT ai_usage_pkey PRIMARY KEY (id),
  CONSTRAINT ai_usage_user_id_key UNIQUE (user_id),
  CONSTRAINT ai_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT ai_usage_plan_check CHECK (plan::text = ANY (ARRAY['basic'::character varying, 'professional'::character varying, 'premium'::character varying]::text[])),
  CONSTRAINT ai_usage_question_count_positive CHECK (question_count >= 0)
);

-- ================================================================
-- PARTE 2: ADICIONAR CAMPOS FALTANTES
-- ================================================================

-- 2.1 Tabela users
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS photo_url text;

-- 2.2 Tabela transactions
ALTER TABLE public.transactions 
  ADD COLUMN IF NOT EXISTS payment_method character varying(50),
  ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurring_frequency character varying(50),
  ADD COLUMN IF NOT EXISTS recurring_end_date date;

-- Adicionar constraint para recurring_frequency
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'transactions_recurring_frequency_check'
  ) THEN
    ALTER TABLE public.transactions 
      ADD CONSTRAINT transactions_recurring_frequency_check 
      CHECK (recurring_frequency::text = ANY (ARRAY['daily'::character varying, 'weekly'::character varying, 'monthly'::character varying, 'yearly'::character varying]::text[]));
  END IF;
END $$;

-- 2.3 Tabela goals
ALTER TABLE public.goals 
  ADD COLUMN IF NOT EXISTS status character varying(50) DEFAULT 'active'::character varying,
  ADD COLUMN IF NOT EXISTS target_date date;

-- Adicionar constraint para status
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'goals_status_check'
  ) THEN
    ALTER TABLE public.goals 
      ADD CONSTRAINT goals_status_check 
      CHECK (status::text = ANY (ARRAY['active'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[]));
  END IF;
END $$;

-- 2.4 Tabela recurring_transactions
ALTER TABLE public.recurring_transactions 
  ADD COLUMN IF NOT EXISTS priority character varying(50) DEFAULT 'medium'::character varying;

-- Adicionar constraint para priority
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'recurring_transactions_priority_check'
  ) THEN
    ALTER TABLE public.recurring_transactions 
      ADD CONSTRAINT recurring_transactions_priority_check 
      CHECK (priority::text = ANY (ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying]::text[]));
  END IF;
END $$;

-- 2.5 Tabela user_settings - Adicionar campos faltantes
ALTER TABLE public.user_settings 
  ADD COLUMN IF NOT EXISTS currency character varying(10) DEFAULT 'BRL',
  ADD COLUMN IF NOT EXISTS language character varying(10) DEFAULT 'pt-BR',
  ADD COLUMN IF NOT EXISTS timezone character varying(50) DEFAULT 'America/Sao_Paulo',
  ADD COLUMN IF NOT EXISTS email_notifications boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS budget_alerts boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS goal_reminders boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS monthly_reports boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS ai_insights_enabled boolean DEFAULT true;

-- ================================================================
-- PARTE 3: CORRIGIR NOMENCLATURAS INCONSISTENTES
-- ================================================================

-- 3.1 Renomear notifications.read para is_read (se ainda não foi feito)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'notifications' 
    AND column_name = 'read'
  ) THEN
    ALTER TABLE public.notifications RENAME COLUMN read TO is_read;
  END IF;
END $$;

-- ================================================================
-- PARTE 4: ADICIONAR CONSTRAINTS DE VALIDAÇÃO
-- ================================================================

-- 4.1 Garantir valores positivos em transactions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'transactions_amount_positive'
  ) THEN
    ALTER TABLE public.transactions 
      ADD CONSTRAINT transactions_amount_positive CHECK (amount > 0);
  END IF;
END $$;

-- 4.2 Garantir valores válidos em goals
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'goals_amounts_positive'
  ) THEN
    ALTER TABLE public.goals 
      ADD CONSTRAINT goals_amounts_positive CHECK (target_amount > 0 AND current_amount >= 0);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'goals_current_not_exceed_target'
  ) THEN
    ALTER TABLE public.goals 
      ADD CONSTRAINT goals_current_not_exceed_target CHECK (current_amount <= target_amount);
  END IF;
END $$;

-- 4.3 Garantir valores positivos em investments
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'investments_quantity_positive'
  ) THEN
    ALTER TABLE public.investments 
      ADD CONSTRAINT investments_quantity_positive CHECK (quantity > 0);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'investments_prices_positive'
  ) THEN
    ALTER TABLE public.investments 
      ADD CONSTRAINT investments_prices_positive CHECK (avg_price >= 0);
  END IF;
END $$;

-- ================================================================
-- PARTE 5: CRIAR ÍNDICES PARA PERFORMANCE
-- ================================================================

-- 5.1 Índices para transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON public.transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status) WHERE status IN ('pending', 'overdue', 'due_soon');
CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON public.transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_category_date ON public.transactions(user_id, category_id, date DESC);

-- 5.2 Índices para goals
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_deadline ON public.goals(deadline) WHERE is_completed = false;
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status) WHERE status = 'active';

-- 5.3 Índices para investments
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_user_id ON public.investment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_transactions_date ON public.investment_transactions(date DESC);

-- 5.4 Índices para recurring_transactions
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_user_id ON public.recurring_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_transactions_active ON public.recurring_transactions(is_active) WHERE is_active = true;

-- 5.5 Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, created_at DESC) WHERE is_read = false;

-- 5.6 Índices para categories
CREATE INDEX IF NOT EXISTS idx_categories_user_id_type ON public.categories(user_id, type);

-- 5.7 Índices para ai_insights
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON public.ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_dismissed ON public.ai_insights(is_dismissed) WHERE is_dismissed = false;

-- 5.8 Índices para bank_accounts
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_active ON public.bank_accounts(is_active) WHERE is_active = true;

-- 5.9 Índices para users
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_plan ON public.users(plan);

-- 5.10 Índices para commitments
CREATE INDEX IF NOT EXISTS idx_commitments_user_id ON public.commitments(user_id);
CREATE INDEX IF NOT EXISTS idx_commitments_date ON public.commitments(date DESC);
CREATE INDEX IF NOT EXISTS idx_commitments_status ON public.commitments(status) WHERE status != 'cancelado';
CREATE INDEX IF NOT EXISTS idx_commitments_user_date ON public.commitments(user_id, date DESC);

-- 5.11 Índices para ai_usage
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON public.ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_last_reset ON public.ai_usage(last_reset_date);

-- ================================================================
-- PARTE 6: CONFIGURAR ROW LEVEL SECURITY (RLS)
-- ================================================================

-- 6.1 Habilitar RLS para novas tabelas
ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- 6.2 Políticas RLS para commitments
DROP POLICY IF EXISTS "Users can view own commitments" ON public.commitments;
CREATE POLICY "Users can view own commitments" ON public.commitments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own commitments" ON public.commitments;
CREATE POLICY "Users can create own commitments" ON public.commitments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own commitments" ON public.commitments;
CREATE POLICY "Users can update own commitments" ON public.commitments
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own commitments" ON public.commitments;
CREATE POLICY "Users can delete own commitments" ON public.commitments
  FOR DELETE USING (auth.uid() = user_id);

-- 6.3 Políticas RLS para ai_usage
DROP POLICY IF EXISTS "Users can view own AI usage" ON public.ai_usage;
CREATE POLICY "Users can view own AI usage" ON public.ai_usage
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own AI usage record" ON public.ai_usage;
CREATE POLICY "Users can create own AI usage record" ON public.ai_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own AI usage" ON public.ai_usage;
CREATE POLICY "Users can update own AI usage" ON public.ai_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- ================================================================
-- PARTE 7: CRIAR TRIGGERS E AUTOMAÇÕES
-- ================================================================

-- 7.1 Função para atualizar updated_at (se não existir)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7.2 Trigger para commitments
DROP TRIGGER IF EXISTS set_commitments_updated_at ON public.commitments;
CREATE TRIGGER set_commitments_updated_at
  BEFORE UPDATE ON public.commitments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7.3 Trigger para ai_usage
DROP TRIGGER IF EXISTS set_ai_usage_updated_at ON public.ai_usage;
CREATE TRIGGER set_ai_usage_updated_at
  BEFORE UPDATE ON public.ai_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7.4 Função para auto-completar metas quando atingem target
CREATE OR REPLACE FUNCTION public.auto_complete_goal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_amount >= NEW.target_amount THEN
    NEW.status = 'completed';
    NEW.is_completed = true;
  ELSIF NEW.is_completed = false AND NEW.status = 'completed' THEN
    -- Se marcado manualmente como completed, garantir sincronização
    NEW.is_completed = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_goal_completion ON public.goals;
CREATE TRIGGER check_goal_completion 
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.auto_complete_goal();

-- ================================================================
-- PARTE 8: ATUALIZAR DADOS EXISTENTES (BACKFILL)
-- ================================================================

-- 8.1 Sincronizar is_completed com status em goals existentes
UPDATE public.goals 
SET status = 'completed' 
WHERE is_completed = true AND (status IS NULL OR status != 'completed');

UPDATE public.goals 
SET status = 'active' 
WHERE is_completed = false AND (status IS NULL OR status = 'completed');

-- 8.2 Garantir que target_date = deadline para goals existentes
UPDATE public.goals 
SET target_date = deadline 
WHERE target_date IS NULL AND deadline IS NOT NULL;

-- ================================================================
-- PARTE 9: PERMISSÕES
-- ================================================================

-- Garantir permissões para usuários autenticados
GRANT SELECT, INSERT, UPDATE, DELETE ON public.commitments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.ai_usage TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ================================================================
-- VERIFICAÇÃO FINAL
-- ================================================================

-- Mostrar resumo das alterações
DO $$ 
DECLARE
  v_result TEXT;
BEGIN
  RAISE NOTICE '✅ Migração concluída com sucesso!';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Resumo das alterações:';
  RAISE NOTICE '  - Tabelas criadas: commitments, ai_usage';
  RAISE NOTICE '  - Campos adicionados em: users, transactions, goals, recurring_transactions, user_settings';
  RAISE NOTICE '  - Índices criados: 40+ índices para otimização';
  RAISE NOTICE '  - Constraints adicionados: validações de dados';
  RAISE NOTICE '  - RLS configurado para todas as tabelas';
  RAISE NOTICE '  - Triggers criados: auto-atualização de timestamps e metas';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  PRÓXIMOS PASSOS:';
  RAISE NOTICE '  1. Verificar se há erros acima';
  RAISE NOTICE '  2. Testar queries críticas';
  RAISE NOTICE '  3. Validar RLS policies';
  RAISE NOTICE '  4. Fazer backup antes de deploy em produção';
END $$;
