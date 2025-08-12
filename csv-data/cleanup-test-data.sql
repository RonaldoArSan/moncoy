-- Script para limpar dados de teste e preparar para usuários reais

-- Remover dados de teste
DELETE FROM public.investments WHERE user_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@teste.com'
);

DELETE FROM public.goals WHERE user_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@teste.com'
);

DELETE FROM public.transactions WHERE user_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@teste.com'
);

DELETE FROM public.categories WHERE user_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@teste.com'
);

DELETE FROM public.user_settings WHERE user_id IN (
    SELECT id FROM public.users WHERE email LIKE '%@teste.com'
);

DELETE FROM public.users WHERE email LIKE '%@teste.com';

DELETE FROM auth.users WHERE email LIKE '%@teste.com';

-- Verificar limpeza
SELECT 'Cleanup completed' as status;
SELECT COUNT(*) as remaining_users FROM public.users;
SELECT COUNT(*) as remaining_auth_users FROM auth.users;