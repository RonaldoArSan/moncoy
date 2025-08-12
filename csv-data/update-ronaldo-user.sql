-- Script para atualizar usuário Ronaldo e limpar dados mockados

-- 1. Atualizar plano do usuário para profissional
UPDATE public.users 
SET plan = 'professional'
WHERE email = 'ronaldoarsan@gmail.com';

-- 2. Remover dados mockados (transações, metas, investimentos)
DELETE FROM public.investments 
WHERE user_id = (SELECT id FROM public.users WHERE email = 'ronaldoarsan@gmail.com');

DELETE FROM public.goals 
WHERE user_id = (SELECT id FROM public.users WHERE email = 'ronaldoarsan@gmail.com');

DELETE FROM public.transactions 
WHERE user_id = (SELECT id FROM public.users WHERE email = 'ronaldoarsan@gmail.com');

-- 3. Verificar resultado
SELECT 
    name,
    email,
    plan,
    registration_date,
    EXTRACT(DAY FROM (NOW() - registration_date)) as days_since_registration,
    CASE 
        WHEN plan = 'basic' THEN 'IA Bloqueada'
        WHEN plan = 'professional' AND EXTRACT(DAY FROM (NOW() - registration_date)) <= 22 THEN 'IA em Carência'
        ELSE 'IA Liberada'
    END as ai_status
FROM public.users 
WHERE email = 'ronaldoarsan@gmail.com';