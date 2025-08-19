-- Script para criar usuários de teste no Supabase
-- Execute este SQL no SQL Editor do Supabase

-- 1. Primeiro, vamos criar os usuários usando a função de signup do Supabase
-- Isso garante que as senhas sejam hash corretamente

-- Usuário Básico
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440001',
  'authenticated',
  'authenticated',
  'basico@teste.com',
  crypt('123456', gen_salt('bf')), -- Hash correto da senha 123456
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Usuário Básico"}',
  NULL,
  NOW() - INTERVAL '5 days',
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL
);

-- Usuário Pro Novo (10 dias)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440002',
  'authenticated',
  'authenticated',
  'pro.novo@teste.com',
  crypt('123456', gen_salt('bf')), -- Hash correto da senha 123456
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Pro Novo"}',
  NULL,
  NOW() - INTERVAL '10 days',
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL
);

-- Usuário Pro Veterano (30 dias)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '550e8400-e29b-41d4-a716-446655440003',
  'authenticated',
  'authenticated',
  'pro.veterano@teste.com',
  crypt('123456', gen_salt('bf')), -- Hash correto da senha 123456
  NOW(),
  NULL,
  '',
  NULL,
  '',
  NULL,
  '',
  '',
  NULL,
  NULL,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Pro Veterano"}',
  NULL,
  NOW() - INTERVAL '30 days',
  NOW(),
  NULL,
  NULL,
  '',
  '',
  NULL,
  '',
  0,
  NULL,
  '',
  NULL
);

-- 2. Agora criar os perfis na tabela users
INSERT INTO public.users (id, name, email, plan, registration_date, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Usuário Básico', 'basico@teste.com', 'basic', NOW() - INTERVAL '5 days', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Pro Novo', 'pro.novo@teste.com', 'professional', NOW() - INTERVAL '10 days', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Pro Veterano', 'pro.veterano@teste.com', 'professional', NOW() - INTERVAL '30 days', NOW(), NOW());

-- 3. Verificar se os usuários foram criados
SELECT 
  au.id,
  au.email,
  au.created_at as auth_created,
  u.name,
  u.plan,
  u.registration_date
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE au.email LIKE '%teste.com'
ORDER BY au.created_at;

-- 4. Testar login (opcional - apenas para verificação)
-- SELECT auth.email() as current_user;