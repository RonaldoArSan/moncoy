-- Criar tabela para controle de uso da IA
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  last_reset_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  plan TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS para ai_usage
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI usage" ON public.ai_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own AI usage" ON public.ai_usage
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI usage" ON public.ai_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Função para verificar e atualizar limites de IA
CREATE OR REPLACE FUNCTION check_ai_limit(p_user_id UUID, p_plan TEXT)
RETURNS JSON AS $$
DECLARE
  v_usage RECORD;
  v_limit INTEGER;
  v_reset_period INTERVAL;
  v_should_reset BOOLEAN;
  v_remaining INTEGER;
BEGIN
  -- Definir limites por plano
  CASE p_plan
    WHEN 'basic' THEN
      v_limit := 5;
      v_reset_period := INTERVAL '7 days';
    WHEN 'professional' THEN
      v_limit := 7;
      v_reset_period := INTERVAL '7 days';
    WHEN 'premium' THEN
      v_limit := 50;
      v_reset_period := INTERVAL '30 days';
    ELSE
      v_limit := 0;
      v_reset_period := INTERVAL '7 days';
  END CASE;

  -- Buscar ou criar registro de uso
  SELECT * INTO v_usage FROM public.ai_usage WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    INSERT INTO public.ai_usage (user_id, usage_count, plan)
    VALUES (p_user_id, 0, p_plan);
    v_usage.usage_count := 0;
    v_usage.last_reset_date := NOW();
  END IF;

  -- Verificar se precisa resetar
  v_should_reset := (NOW() - v_usage.last_reset_date) >= v_reset_period;
  
  IF v_should_reset THEN
    UPDATE public.ai_usage 
    SET usage_count = 0, last_reset_date = NOW(), plan = p_plan
    WHERE user_id = p_user_id;
    v_usage.usage_count := 0;
  END IF;

  v_remaining := GREATEST(0, v_limit - v_usage.usage_count);

  RETURN json_build_object(
    'allowed', v_usage.usage_count < v_limit,
    'remaining', v_remaining,
    'resetDate', v_usage.last_reset_date + v_reset_period,
    'currentCount', v_usage.usage_count,
    'limit', v_limit
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para incrementar uso da IA
CREATE OR REPLACE FUNCTION increment_ai_usage(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.ai_usage 
  SET usage_count = usage_count + 1, updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;