-- ⚡ QUICK MIGRATION - AI Usage Table
-- Execute este SQL no Supabase SQL Editor para resolver o problema de performance
-- URL: https://app.supabase.com/project/[seu-project-id]/sql/new
-- Tempo estimado: 30 segundos

-- ========================================
-- PASSO 1: Criar tabela ai_usage
-- ========================================

CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('basic', 'professional', 'premium')),
  question_count INTEGER NOT NULL DEFAULT 0,
  last_reset_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_question_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ========================================
-- PASSO 2: Criar índices
-- ========================================

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON public.ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_last_reset ON public.ai_usage(last_reset_date);

-- ========================================
-- PASSO 3: Habilitar RLS
-- ========================================

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PASSO 4: Políticas RLS
-- ========================================

-- Usuários veem só seus dados
DROP POLICY IF EXISTS "Users can view their own AI usage" ON public.ai_usage;
CREATE POLICY "Users can view their own AI usage"
  ON public.ai_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários criam seu próprio registro
DROP POLICY IF EXISTS "Users can create their own AI usage record" ON public.ai_usage;
CREATE POLICY "Users can create their own AI usage record"
  ON public.ai_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários atualizam seus dados
DROP POLICY IF EXISTS "Users can update their own AI usage" ON public.ai_usage;
CREATE POLICY "Users can update their own AI usage"
  ON public.ai_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- ========================================
-- PASSO 5: Trigger para updated_at
-- ========================================

CREATE OR REPLACE FUNCTION public.update_ai_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_ai_usage_updated_at ON public.ai_usage;
CREATE TRIGGER set_ai_usage_updated_at
  BEFORE UPDATE ON public.ai_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_usage_updated_at();

-- ========================================
-- PASSO 6: Permissões
-- ========================================

GRANT SELECT, INSERT, UPDATE ON public.ai_usage TO authenticated;

-- ========================================
-- VERIFICAÇÃO
-- ========================================

-- Execute isso para confirmar que funcionou:
SELECT 
  'ai_usage' as table_name,
  COUNT(*) as total_records,
  'Migração aplicada com sucesso! ✅' as status
FROM public.ai_usage;

-- ========================================
-- PRÓXIMOS PASSOS
-- ========================================

-- 1. Se a query acima retornou sem erros = ✅ Sucesso!
-- 2. Reinicie sua aplicação: Ctrl+C e depois `pnpm dev`
-- 3. Teste o login novamente
-- 4. A aplicação deve carregar rápido agora

-- ========================================
-- ROLLBACK (se necessário)
-- ========================================

-- Só execute isso se quiser REMOVER a tabela
-- DROP TABLE IF EXISTS public.ai_usage CASCADE;
