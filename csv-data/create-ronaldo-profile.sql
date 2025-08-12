-- Script para criar perfil do usuário Ronaldo manualmente

-- 1. Verificar se o usuário existe no auth.users
SELECT id, email, created_at, raw_user_meta_data 
FROM auth.users 
WHERE email = 'ronaldoarsan@gmail.com';

-- 2. Criar perfil na tabela public.users (substitua o UUID pelo ID real do auth.users)
-- IMPORTANTE: Execute a query acima primeiro e copie o ID real do usuário

-- Exemplo (substitua pelo ID real):
-- INSERT INTO public.users (id, name, email, plan, registration_date, created_at)
-- VALUES (
--     'SEU_UUID_AQUI', -- ID do auth.users
--     'Ronaldo Santana',
--     'ronaldoarsan@gmail.com',
--     'professional',
--     NOW(),
--     NOW()
-- );

-- 3. Criar categorias padrão (substitua o UUID pelo ID real)
-- INSERT INTO public.categories (user_id, name, type, color) VALUES
-- ('SEU_UUID_AQUI', 'Salário', 'income', 'green'),
-- ('SEU_UUID_AQUI', 'Freelance', 'income', 'blue'),
-- ('SEU_UUID_AQUI', 'Alimentação', 'expense', 'orange'),
-- ('SEU_UUID_AQUI', 'Transporte', 'expense', 'blue'),
-- ('SEU_UUID_AQUI', 'Emergência', 'goal', 'red'),
-- ('SEU_UUID_AQUI', 'Ações', 'investment', 'green');

-- 4. Criar configurações padrão (substitua o UUID pelo ID real)
-- INSERT INTO public.user_settings (user_id) VALUES ('SEU_UUID_AQUI');

-- 5. Verificar criação
SELECT 
    u.name,
    u.email,
    u.plan,
    u.registration_date,
    EXTRACT(DAY FROM (NOW() - u.registration_date)) as days_since_registration,
    CASE 
        WHEN u.plan = 'basic' THEN 'IA Bloqueada'
        WHEN u.plan = 'professional' AND EXTRACT(DAY FROM (NOW() - u.registration_date)) <= 22 THEN 'IA em Carência'
        ELSE 'IA Liberada'
    END as ai_status
FROM public.users u
WHERE u.email = 'ronaldoarsan@gmail.com';