-- Script para criar o primeiro usuário super admin
-- Execute este script manualmente no Supabase SQL Editor

-- ATENÇÃO: Substitua os valores abaixo pelos dados reais do admin

-- 1. Primeiro crie o usuário no Supabase Auth (faça isso via Dashboard do Supabase)
-- 2. Depois execute este script substituindo o UUID pelo ID real do usuário criado

-- Substitua pelo UUID real do usuário admin criado no Supabase Auth
-- Exemplo: INSERT INTO user_roles (user_id, role, granted_by) 
-- VALUES ('00000000-0000-0000-0000-000000000000', 'super_admin', '00000000-0000-0000-0000-000000000000');

-- Para encontrar o UUID do usuário, use:
-- SELECT id, email FROM auth.users WHERE email = 'admin@moncoy.com';

-- Depois execute:
-- INSERT INTO user_roles (user_id, role, granted_by) 
-- VALUES ('UUID_DO_ADMIN_AQUI', 'super_admin', 'UUID_DO_ADMIN_AQUI');

-- Verificar se o admin foi criado corretamente:
-- SELECT u.email, ur.role FROM users u 
-- JOIN user_roles ur ON u.id = ur.user_id 
-- WHERE ur.role IN ('admin', 'super_admin');

-- Log da criação do primeiro admin
-- SELECT log_admin_action('create_super_admin', 'UUID_DO_ADMIN_AQUI', '{"note": "First super admin created"}');

/*
INSTRUÇÕES:

1. Vá para o Supabase Dashboard > Authentication > Users
2. Clique em "Add user" 
3. Crie um usuário com:
   - Email: admin@moncoy.com (ou outro email seguro)
   - Password: [senha muito forte]
   - Confirm email: true
   - Auto confirm user: true

4. Copie o UUID do usuário criado

5. Execute no SQL Editor:
   INSERT INTO user_roles (user_id, role, granted_by) 
   VALUES ('SEU_UUID_AQUI', 'super_admin', 'SEU_UUID_AQUI');

6. Verificar:
   SELECT u.email, ur.role FROM users u 
   JOIN user_roles ur ON u.id = ur.user_id 
   WHERE ur.role IN ('admin', 'super_admin');
*/