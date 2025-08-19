-- Limpar usuários existentes
DELETE FROM public.users WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440003'
);

DELETE FROM auth.users WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003'
);

-- Recriar com senha hash correta
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, 
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'basico@teste.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(), '{"provider": "email", "providers": ["email"]}',
  '{"name": "Usuário Básico"}', NOW() - INTERVAL '5 days', NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  '00000000-0000-0000-0000-000000000000', 
  'authenticated', 'authenticated', 'pro.novo@teste.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(), '{"provider": "email", "providers": ["email"]}',
  '{"name": "Pro Novo"}', NOW() - INTERVAL '10 days', NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'pro.veterano@teste.com', 
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(), '{"provider": "email", "providers": ["email"]}',
  '{"name": "Pro Veterano"}', NOW() - INTERVAL '30 days', NOW()
);

-- Criar perfis
INSERT INTO public.users (id, name, email, plan, registration_date, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Usuário Básico', 'basico@teste.com', 'basic', NOW() - INTERVAL '5 days', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'Pro Novo', 'pro.novo@teste.com', 'professional', NOW() - INTERVAL '10 days', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'Pro Veterano', 'pro.veterano@teste.com', 'professional', NOW() - INTERVAL '30 days', NOW(), NOW());

-- Verificar
SELECT au.email, u.name, u.plan FROM auth.users au 
JOIN public.users u ON au.id = u.id 
WHERE au.email LIKE '%teste.com';