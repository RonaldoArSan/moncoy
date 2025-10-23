# Análise: Fluxo de Autenticação Supabase - MoncoyFinance

## 📋 Visão Geral

A aplicação usa **Supabase Auth** com cookies SSR (Server-Side Rendering) para autenticação segura.

## 🏗️ Arquitetura do Supabase

### 1. Duas Tabelas de Usuários

#### `auth.users` (Gerenciada pelo Supabase)
- Tabela interna do Supabase Auth
- Armazena credenciais, tokens, metadata
- **Colunas principais:**
  - `id` (UUID)
  - `email`
  - `email_confirmed_at` ← **CRÍTICO para login**
  - `encrypted_password`
  - `last_sign_in_at`
  - `raw_user_meta_data` (JSON)
  - `created_at`

#### `public.users` (Sua tabela custom)
- Perfil público do usuário
- **Colunas:**
  - `id` → FK para `auth.users(id)` ON DELETE CASCADE
  - `name`
  - `email`
  - `plan` (basic/professional/premium)
  - `registration_date`
  - `photo_url`
  - `stripe_customer_id`

### 2. Sincronização Automática

**Trigger no banco:**
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

**Função:**
- Quando usuário é criado em `auth.users`
- Automaticamente cria registro em `public.users`
- Cria configurações em `user_settings`

## 🔐 Fluxo de Autenticação Atual

### A. Registro (Sign Up)

```
1. User → /register → Preenche formulário
2. Frontend → supabase.auth.signUp({ email, password })
3. Supabase cria em auth.users (email_confirmed_at = NULL)
4. Trigger cria em public.users
5. Supabase envia email de confirmação
6. User clica no link → email_confirmed_at = NOW()
7. Agora pode fazer login
```

### B. Login (Sign In)

```
1. User → /login → Digita email + senha
2. Frontend → Server Action (signInAction)
3. Server → supabase.auth.signInWithPassword({ email, password })
4. Supabase valida:
   ✅ Email existe em auth.users?
   ✅ Senha correta?
   ✅ email_confirmed_at IS NOT NULL?
5. Se tudo OK:
   - Cria session (access_token + refresh_token)
   - Armazena em cookies HTTP-only
   - Retorna { user, session }
6. Frontend → Redireciona para dashboard
7. AuthProvider → Carrega perfil de public.users
```

### C. Google OAuth

```
1. User → /login → Clica "Entrar com Google"
2. Frontend → supabase.auth.signInWithOAuth({ provider: 'google' })
3. Supabase redireciona para Google
4. User autoriza no Google
5. Google redireciona para: /auth/callback?code=ABC123
6. Route handler → exchangeCodeForSession(code)
7. Supabase cria/atualiza auth.users
8. Trigger cria/atualiza public.users
9. Redireciona para dashboard
```

### D. Password Reset (Problema Atual)

**Fluxo Esperado:**
```
1. User → /forgot-password → Digita email
2. Frontend → supabase.auth.resetPasswordForEmail(email, {
     redirectTo: 'https://moncoyfinance.com/auth/callback'
   })
3. Supabase envia email com link:
   https://moncoyfinance.com/auth/callback?token_hash=HASH&type=recovery
4. User clica no link
5. Route handler (/auth/callback/route.ts):
   - Detecta type=recovery
   - Troca token_hash por sessão
   - Redireciona para /reset-password
6. User altera senha em /reset-password
7. Frontend → supabase.auth.updateUser({ password: newPassword })
8. Supabase atualiza encrypted_password
9. Redireciona para /login
10. User faz login com nova senha
```

**Problema Identificado:**
- ❌ Route handler NÃO estava detectando `type=recovery`
- ❌ Após criar sessão, redirecionava para `/` (não /reset-password)
- ❌ AuthProvider via user sem permissão → redirecionava para /login
- ✅ **CORRIGIDO** no commit 1c2a78c

## 🔒 Row Level Security (RLS)

### Políticas Atuais:

**Tabela `users`:**
```sql
-- SELECT: Usuário pode ver apenas seu próprio perfil
CREATE POLICY "Allow users to access their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- UPDATE: Usuário pode atualizar apenas seu próprio perfil
CREATE POLICY "Allow users to update their own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- INSERT: Usuário pode inserir apenas seu próprio perfil
CREATE POLICY "Allow users to insert their own data" 
  ON users FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

**Outras tabelas:**
```sql
-- Todas usam: auth.uid() = user_id
CREATE POLICY "Allow users to access their own X" 
  ON [table] FOR ALL 
  USING (auth.uid() = user_id);
```

### ⚠️ Potencial Problema com RLS

**Cenário:**
1. User faz login → sessão criada
2. Frontend chama `userApi.getCurrentUser()`
3. Query: `SELECT * FROM users WHERE id = auth.uid()`
4. RLS valida: `auth.uid() = id` → TRUE
5. ✅ Retorna dados

**MAS:**
Se a sessão não foi propagada corretamente para o cookies, `auth.uid()` pode retornar `NULL`:
- Query: `SELECT * FROM users WHERE id = NULL`
- RLS: `NULL = id` → FALSE
- ❌ Retorna vazio (não é erro, só não retorna dados)

## 🔍 Cliente Supabase na Aplicação

### Server-Side (`lib/supabase/server.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'

export async function createClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Não pode setar cookies em Server Components
      }
    }
  )
}
```

**Usado em:**
- Server Actions (`app/login/actions.ts`)
- API Routes (`app/api/**/route.ts`)

### Client-Side (`lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export const createClient = () => {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return supabaseClient
}

export const supabase = createClient() // Singleton
```

**Usado em:**
- Client Components (`app/forgot-password/page.tsx`)
- Hooks (`hooks/use-user.ts`)
- Auth Provider (`components/auth-provider.tsx`)

## 🐛 Problemas Comuns e Soluções

### 1. "Invalid login credentials"

**Causas:**
- ❌ Senha incorreta
- ❌ Email não confirmado (`email_confirmed_at IS NULL`)
- ❌ Usuário não existe em `auth.users`

**Solução:**
```sql
-- Verificar status:
SELECT email, email_confirmed_at, last_sign_in_at 
FROM auth.users 
WHERE email = 'user@example.com';

-- Confirmar manualmente:
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'user@example.com';
```

### 2. "No auth user found" após login

**Causas:**
- ❌ Sessão não foi salva nos cookies
- ❌ Cookies bloqueados pelo navegador
- ❌ `sameSite` ou `secure` mal configurado

**Debug:**
```typescript
// No client:
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

// No server:
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

### 3. RLS bloqueia query mesmo com sessão

**Causas:**
- ❌ `auth.uid()` retorna NULL (sessão não chegou ao Postgrest)
- ❌ Política RLS muito restritiva

**Debug:**
```sql
-- Testar auth.uid() direto:
SELECT auth.uid();

-- Se retornar NULL, sessão não está no request
```

**Solução:**
- Middleware refresh session: `await supabase.auth.getSession()`
- Verificar headers: `Authorization: Bearer <token>`

## 📊 Tabelas de Suporte

### `user_settings`
- Configurações do usuário (tema, notificações, AI)
- RLS: `auth.uid() = user_id`

### `categories`
- Categorias personalizadas (receitas/despesas)
- RLS: `auth.uid() = user_id`

### `transactions`
- Transações financeiras
- RLS: `auth.uid() = user_id`

### `goals`
- Metas financeiras
- RLS: `auth.uid() = user_id`

### `ai_usage` (se existir)
- Rastreamento de uso de IA
- RLS: `auth.uid() = user_id`

## ✅ Checklist de Configuração Supabase

- [x] Tabelas criadas com schema correto
- [x] RLS habilitado em todas as tabelas
- [x] Políticas RLS configuradas
- [x] Trigger `on_auth_user_created` funcionando
- [x] Environment variables configuradas
- [ ] **Redirect URLs** no Dashboard:
  - `https://moncoyfinance.com/auth/callback`
  - `http://localhost:3000/auth/callback` (dev)
- [ ] **Site URL**: `https://moncoyfinance.com`
- [ ] **Email templates** verificados
- [ ] **Confirm email** habilitado ou desabilitado conforme necessário

## 🚀 Próximos Passos

1. **Testar password reset** com o fix do commit 1c2a78c
2. **Verificar Redirect URLs** no Supabase Dashboard
3. **Confirmar Site URL** está correto
4. **Testar OAuth** (Google) após reset funcionar
5. **Adicionar logs** em produção para monitorar auth flow

## 📚 Documentação Relevante

- Supabase SSR: https://supabase.com/docs/guides/auth/server-side-rendering
- Next.js App Router: https://supabase.com/docs/guides/auth/server-side/nextjs
- RLS: https://supabase.com/docs/guides/auth/row-level-security
- Email Templates: https://supabase.com/docs/guides/auth/auth-email-templates
