-- Verificar usuários na tabela auth.users
-- Execute este SQL no Supabase Dashboard → SQL Editor

SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ NÃO CONFIRMADO'
    ELSE '✅ CONFIRMADO'
  END as status
FROM auth.users
WHERE email IN (
  'developarsan@gmail.com',
  'ronaldoarsan@gmail.com',
  'veezytecnologia@gmail.com',
  'admin@moncoyfinance.com',
  'clinicflow2025@gmail.com'
)
ORDER BY created_at DESC;

-- Se precisar confirmar manualmente um usuário:
-- UPDATE auth.users 
-- SET email_confirmed_at = NOW() 
-- WHERE email = 'developarsan@gmail.com';
