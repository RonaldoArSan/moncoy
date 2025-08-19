-- Script Simples para Criar Usuários de Teste
-- Execute este SQL no SQL Editor do Supabase

-- IMPORTANTE: Execute este comando primeiro para habilitar a extensão pgcrypto se não estiver habilitada
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Limpar usuários de teste existentes (se houver)
DELETE FROM auth.users WHERE email IN ('basico@teste.com', 'pro.novo@teste.com', 'pro.veterano@teste.com');
DELETE FROM public.users WHERE email IN ('basico@teste.com', 'pro.novo@teste.com', 'pro.veterano@teste.com');

-- Criar usuários de teste na tabela auth.users
-- Usando uma senha hash válida para '123456'
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES 
-- Usuário Básico
(
  '550e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'basico@teste.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Hash para '123456'
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Usuário Básico"}',
  NOW() - INTERVAL '5 days',
  NOW()
),
-- Usuário Pro Novo
(
  '550e8400-e29b-41d4-a716-446655440002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pro.novo@teste.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Hash para '123456'
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Pro Novo"}',
  NOW() - INTERVAL '10 days',
  NOW()
),
-- Usuário Pro Veterano
(
  '550e8400-e29b-41d4-a716-446655440003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'pro.veterano@teste.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Hash para '123456'
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Pro Veterano"}',
  NOW() - INTERVAL '30 days',
  NOW()
);

-- Criar perfis na tabela public.users
INSERT INTO public.users (id, name, email, plan, registration_date, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Usuário Básico', 'basico@teste.com', 'basic', NOW() - INTERVAL '5 days', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Pro Novo', 'pro.novo@teste.com', 'professional', NOW() - INTERVAL '10 days', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Pro Veterano', 'pro.veterano@teste.com', 'professional', NOW() - INTERVAL '30 days', NOW(), NOW());

-- Verificar se os usuários foram criados
SELECT 
  au.id,
  au.email,
  au.email_confirmed_at,
  u.name,
  u.plan,
  u.registration_date,
  EXTRACT(DAY FROM (NOW() - u.registration_date)) as days_since_registration
FROM auth.users au
LEFT JOIN public.users u ON au.id = u.id
WHERE au.email LIKE '%teste.com'
ORDER BY u.registration_date DESC;