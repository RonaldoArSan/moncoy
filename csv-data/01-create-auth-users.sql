-- Execute este SQL ANTES de importar os arquivos CSV
-- Cria os usuários de teste na tabela auth.users

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'basico@teste.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', '2024-12-20 10:00:00+00', '2024-12-20 10:00:00+00', '2024-12-20 10:00:00+00', '{"name": "Usuário Básico"}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'pro.novo@teste.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', '2024-12-15 10:00:00+00', '2024-12-15 10:00:00+00', '2024-12-15 10:00:00+00', '{"name": "Pro Novo"}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'pro.veterano@teste.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', '2024-11-25 10:00:00+00', '2024-11-25 10:00:00+00', '2024-11-25 10:00:00+00', '{"name": "Pro Veterano"}');

-- Verificar se os usuários foram criados
SELECT id, email, created_at FROM auth.users WHERE email LIKE '%teste.com';