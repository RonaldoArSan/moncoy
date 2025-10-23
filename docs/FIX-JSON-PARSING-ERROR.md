# Fix: Erro de JSON Inesperado na Autenticação Google

## Problema

Ao tentar fazer login com Google, o usuário recebia o erro:
```
Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

Este erro ocorria na página de login durante o fluxo OAuth.

## Causa Raiz

O erro acontecia quando o cliente Supabase tentava fazer chamadas API mas recebia páginas HTML de erro ao invés de respostas JSON. Isso geralmente ocorre quando:

1. **Variáveis de ambiente ausentes ou incorretas** - Se `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` não estiverem configuradas, as chamadas API do Supabase falham
2. **Erros de configuração retornam HTML** - Quando há erro de configuração, Next.js/Supabase retornam páginas de erro HTML ao invés de JSON
3. **Falta de tratamento de erro** - O código não capturava e tratava esses erros adequadamente

## Solução Implementada

### 1. Validação de Variáveis de Ambiente

**Arquivo**: `lib/env-check.ts`

Nova função para validar configuração antes de usar o Supabase:

```typescript
export function checkSupabaseEnv(): EnvCheckResult {
  // Verifica se variáveis existem
  // Valida formato da URL
  // Retorna erros e avisos
}
```

**Benefícios**:
- ✅ Detecta problemas de configuração antes de fazer chamadas
- ✅ Mensagens de erro claras e acionáveis
- ✅ Avisos para configurações subótimas

### 2. Cliente Supabase Resiliente

**Arquivo**: `lib/supabase/client.ts`

Melhorias na inicialização do cliente:

```typescript
export const createClient = () => {
  // Validação de env vars
  // Fallback para build (SSR/SSG)
  // Cliente dummy quando config inválida
  // Evita crashes completos
}
```

**Benefícios**:
- ✅ Build não quebra mesmo sem env vars (usa placeholders)
- ✅ Runtime detecta e reporta erros de configuração
- ✅ Fallback gracioso mantém app funcional
- ✅ Função `getInitError()` para verificar status

### 3. Tratamento de Erros Melhorado

**Arquivo**: `components/auth-provider.tsx`

Novo tratamento de erros em `signInWithGoogle()`:

```typescript
const signInWithGoogle = async () => {
  try {
    // Valida config antes de OAuth
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || ...) {
      throw new Error('Configuração não encontrada')
    }
    
    // Tenta OAuth
    const { data, error } = await supabase.auth.signInWithOAuth(...)
    
    if (error) {
      // Trata erros específicos
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Erro de conexão...')
      }
      if (error.message.includes('Unexpected token')) {
        throw new Error('Erro de configuração...')
      }
    }
  } catch (error) {
    // Mensagens amigáveis ao usuário
    return { success: false, error: userMessage }
  }
}
```

**Benefícios**:
- ✅ Detecta erros de JSON parsing
- ✅ Converte erros técnicos em mensagens amigáveis
- ✅ Logs detalhados para debugging
- ✅ Não quebra a UI

### 4. Interface de Usuário

**Arquivo**: `app/login/page.tsx`

Exibição de erros melhorada:

```typescript
// Mostra erro de inicialização
if (initError) {
  setError(initError)
}

// Try-catch em handleGoogleLogin
try {
  const result = await signInWithGoogle()
  if (!result.success) {
    setError(result.error || "Erro ao fazer login")
  }
} catch (err) {
  setError(err.message || "Erro inesperado")
}
```

**Benefícios**:
- ✅ Usuário vê mensagens claras
- ✅ Erros de configuração são visíveis
- ✅ Não fica com loading infinito

## Como Testar

### Teste 1: Com Variáveis Corretas
```bash
# Configure as variáveis
export NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key-aqui

# Execute
npm run dev

# Acesse http://localhost:3000/login
# Clique em "Continuar com Google"
# Deve redirecionar para Google OAuth
```

### Teste 2: Sem Variáveis (Simulando Erro)
```bash
# Remova as variáveis
unset NEXT_PUBLIC_SUPABASE_URL
unset NEXT_PUBLIC_SUPABASE_ANON_KEY

# Execute
npm run dev

# Acesse http://localhost:3000/login
# Clique em "Continuar com Google"
# Deve mostrar: "Erro de configuração. Entre em contato com o suporte."
```

### Teste 3: Build em Produção
```bash
# Configure as variáveis
export NEXT_PUBLIC_SUPABASE_URL=...
export NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Build
npm run build

# Deve buildar sem erros
# Start
npm start

# Teste login com Google
```

## Configuração Necessária em Produção

### Vercel

1. Acesse: Settings → Environment Variables
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://seu-projeto.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sua-key-aqui`
   - `NEXT_PUBLIC_SITE_URL` = `https://moncoyfinance.com` (recomendado)
3. Redeploy após adicionar variáveis

### Supabase Dashboard

1. Auth → URL Configuration
2. Site URL: `https://moncoyfinance.com`
3. Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://moncoyfinance.com/auth/callback`
   - `https://www.moncoyfinance.com/auth/callback`

### Google Cloud Console

1. OAuth 2.0 Client IDs
2. Authorized redirect URIs:
   - `https://seu-projeto.supabase.co/auth/v1/callback`
   - `https://moncoyfinance.com/auth/callback`
   - `http://localhost:3000/auth/callback`

## Logs de Debug

Com as mudanças, você verá logs mais detalhados:

### Console do Browser (Development)
```
✅ Environment configuration is valid
🔐 Initiating Google OAuth with redirect: https://...
```

### Erros Capturados
```
❌ Google sign in error: {
  message: "Failed to fetch",
  name: "TypeError"
}
```

### Servidor (Vercel Logs)
```
[ERROR] Google sign in error: Erro de configuração...
```

## Mensagens de Erro para Usuário

| Erro Técnico | Mensagem ao Usuário |
|--------------|---------------------|
| `Variáveis de ambiente não configuradas` | "Erro de configuração. Entre em contato com o suporte." |
| `Failed to fetch` | "Erro de conexão. Verifique sua internet e tente novamente." |
| `Unexpected token '<'` | "Erro ao processar resposta do servidor. Tente novamente." |
| `NetworkError` | "Erro de conexão. Verifique sua internet e tente novamente." |

## Impacto

### Antes
- ❌ Erro confuso: "Unexpected token '<', "<!DOCTYPE "..."
- ❌ Não ficava claro se era problema de configuração
- ❌ Build quebrava sem env vars
- ❌ Usuário ficava perdido

### Depois
- ✅ Mensagens claras: "Erro de configuração. Entre em contato com o suporte."
- ✅ Build funciona mesmo sem env vars (para CI/CD)
- ✅ Logs detalhados para debugging
- ✅ Usuário entende o que fazer

## Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Redirect URLs configuradas no Supabase
- [ ] Redirect URIs configuradas no Google Cloud
- [ ] Build local bem-sucedido
- [ ] Teste de login com Google em localhost
- [ ] Redeploy no Vercel após configurar variáveis
- [ ] Teste de login com Google em produção

## Referências

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [OAuth 2.0 Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
