# Guia de Troubleshooting - Login "Invalid Credentials"

## Problema
Erro "invalid login credentials" ao tentar fazer login com emails que existem no Supabase.

## Possíveis Causas e Soluções

### 1. **Usuários de Teste Não Criados Corretamente**

**Verificar se os usuários existem:**
```sql
-- Execute no SQL Editor do Supabase
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email IN ('basico@teste.com', 'pro.novo@teste.com', 'pro.veterano@teste.com');
```

**Solução:**
- Execute o arquivo `create-test-users-simple.sql` no SQL Editor do Supabase
- Isso criará os usuários com senhas hash corretas

### 2. **Autenticação por Email/Senha Desabilitada**

**Verificar configurações no Supabase Dashboard:**
1. Vá para Authentication → Settings
2. Verifique se "Enable email confirmations" está habilitado
3. Verifique se "Enable email/password signup" está habilitado

### 3. **Email Não Confirmado**

**Verificar status de confirmação:**
```sql
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email = 'seu@email.com';
```

**Solução:**
```sql
-- Confirmar email manualmente
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'seu@email.com';
```

### 4. **Senha Hash Incorreta**

**Problema:** Os arquivos CSV originais usam hash fictício.

**Solução:** Use o script `create-test-users-simple.sql` que tem hash válido para a senha '123456'.

### 5. **Políticas RLS Muito Restritivas**

**Verificar políticas:**
```sql
-- Ver políticas da tabela users
SELECT * FROM pg_policies WHERE tablename = 'users';
```

**Solução temporária (apenas para teste):**
```sql
-- CUIDADO: Isso desabilita RLS temporariamente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

### 6. **Configuração do Supabase Client**

**Verificar arquivo `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

**Verificar se as URLs estão corretas:**
- URL deve terminar com `.supabase.co`
- Chave anônima deve começar com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

## Passos para Resolver

### Passo 1: Limpar e Recriar Usuários
```sql
-- Execute no SQL Editor do Supabase
DELETE FROM auth.users WHERE email LIKE '%teste.com';
DELETE FROM public.users WHERE email LIKE '%teste.com';
```

### Passo 2: Executar Script de Criação
Execute o arquivo `create-test-users-simple.sql` completo no SQL Editor.

### Passo 3: Verificar Configurações de Auth
1. Authentication → Settings
2. Habilitar "Enable email/password signup"
3. Desabilitar "Enable email confirmations" (para teste)

### Passo 4: Testar Login
Use as credenciais:
- **Email:** `basico@teste.com`
- **Senha:** `123456`

## Comandos Úteis para Debug

### Verificar se usuário existe
```sql
SELECT * FROM auth.users WHERE email = 'basico@teste.com';
```

### Verificar perfil do usuário
```sql
SELECT * FROM public.users WHERE email = 'basico@teste.com';
```

### Verificar logs de autenticação
```sql
-- No Supabase Dashboard: Authentication → Logs
```

### Testar hash de senha
```sql
-- Verificar se a senha está correta
SELECT crypt('123456', encrypted_password) = encrypted_password as senha_correta
FROM auth.users 
WHERE email = 'basico@teste.com';
```

## Criando Usuário Manualmente (Alternativa)

Se os scripts não funcionarem, crie um usuário pelo Dashboard:

1. Vá para Authentication → Users
2. Clique em "Add user"
3. Preencha:
   - Email: `teste@exemplo.com`
   - Password: `123456`
   - Confirm password: `123456`
4. Clique em "Create user"

## Testando com Usuário Real

Para testar com seu próprio email:

1. Vá para `/register`
2. Crie uma conta nova
3. Confirme o email (se necessário)
4. Tente fazer login

## Contato para Suporte

Se o problema persistir:
1. Verifique os logs do navegador (F12 → Console)
2. Verifique os logs do Supabase (Dashboard → Logs)
3. Documente o erro exato e os passos realizados