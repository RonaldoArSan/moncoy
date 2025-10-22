# 🔍 Diagnóstico Completo - Aplicação Não Carregando em Produção

## ⚠️ Problema Relatado
- Aplicação não carrega em produção
- Usuários cadastrados no Supabase não conseguem fazer login
- Configurações do Google OAuth e Supabase estão corretas
- Erro CORS: `x-supabase-api-version` header bloqueado
- Erro: `OAuth state parameter missing`

---

## ✅ Checklist de Verificação (Execute na Ordem)

### 1. Verificar Variáveis de Ambiente no Vercel

Acesse: `https://vercel.com/[seu-time]/moncoy/settings/environment-variables`

**Variáveis Necessárias:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://dxdbpppymxfiojszrmir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-key-anon]
NEXT_PUBLIC_SITE_URL=https://moncoyfinance.com
NEXT_PUBLIC_APP_URL=https://moncoyfinance.com
NEXT_PUBLIC_APP_NAME=MoncoyFinance
NEXT_PUBLIC_APP_DOMAIN=moncoyfinance.com
```

**⚠️ IMPORTANTE**: Após adicionar/modificar variáveis, você DEVE fazer redeploy!

```bash
# Na Vercel Dashboard
Deployments → Latest → ... → Redeploy
```

---

### 2. Verificar Configuração no Supabase Dashboard

#### 2.1 URL Configuration
`https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/auth/url-configuration`

**Site URL:**
```
https://moncoyfinance.com
```

**Redirect URLs** (todas devem estar presentes):
```
http://localhost:3000/auth/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
```

#### 2.2 Google Provider
`https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/auth/providers`

- ✅ Google Provider: **Enabled**
- ✅ Client ID: Preenchido
- ✅ Client Secret: Preenchido
- ❌ Skip nonce check: **DESATIVADO** (deixe desmarcado)

---

### 3. Verificar Google Cloud Console

`https://console.cloud.google.com/apis/credentials`

**Authorized redirect URIs** devem incluir:
```
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
https://moncoyfinance.com/auth/callback
http://localhost:3000/auth/callback
```

**⚠️ CRÍTICO**: O URI do Supabase (`/auth/v1/callback`) DEVE estar presente!

---

### 4. Verificar DNS e Domínio

#### 4.1 Verificar DNS propagou
```bash
nslookup moncoyfinance.com
# Deve apontar para Vercel (76.76.21.XXX)
```

#### 4.2 Verificar certificado SSL
```
https://moncoyfinance.com
# Deve mostrar cadeado verde, sem warnings
```

---

### 5. Testar Fluxo de Login

#### 5.1 Login com Email/Senha (Server Action)
1. Acesse: `https://moncoyfinance.com/login`
2. Preencha email e senha de usuário cadastrado
3. Clique "Entrar"
4. **Esperado**: Redirect para `/` (dashboard)
5. **Se falhar**: Verificar logs do Vercel

#### 5.2 Login com Google OAuth
1. Acesse: `https://moncoyfinance.com/login`
2. Clique "Continuar com Google"
3. Selecione conta Google
4. **Esperado**: 
   - Redirect para `https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback`
   - Depois para `https://moncoyfinance.com/auth/callback?code=...`
   - Finalmente para `https://moncoyfinance.com/` (dashboard)
5. **Se falhar**: Verificar erro específico abaixo

---

## 🐛 Diagnóstico de Erros Específicos

### Erro: "OAuth state parameter missing"

**Causa Provável:**
1. Cookies bloqueados no navegador
2. Redirect URL não configurada no Supabase
3. PKCE flow interrompido

**Solução:**
1. Verificar se Redirect URLs estão corretas (Seção 2.1)
2. Limpar cookies do navegador: `Ctrl+Shift+Delete`
3. Testar em modo anônimo/incógnito
4. Verificar logs detalhados (Seção 6)

---

### Erro: CORS "x-supabase-api-version"

**Causa Provável:**
- Login com email/senha sendo feito no client-side

**Solução:**
- ✅ JÁ IMPLEMENTADO: Server Actions em `app/login/actions.ts`
- Verificar se build mais recente está deployado
- Forçar redeploy no Vercel

---

### Erro: "Failed to fetch"

**Causa Provável:**
1. Variáveis de ambiente incorretas no Vercel
2. CORS policy bloqueando requests
3. Supabase URL incorreta

**Solução:**
1. Verificar variáveis de ambiente (Seção 1)
2. Fazer redeploy no Vercel
3. Testar em localhost primeiro: `pnpm dev`

---

## 📊 Verificar Logs de Produção

### Logs do Vercel
```bash
# Via CLI (se instalado)
vercel logs https://moncoyfinance.com --follow

# Ou via Dashboard
https://vercel.com/[seu-time]/moncoy/logs
```

**Procure por:**
- `🔐 Auth callback received` - Log de entrada no callback
- `❌ OAuth error detected` - Erros OAuth
- `⚠️ OAuth STATE PARAMETER MISSING` - State missing específico
- `✅ Session created successfully` - Login bem-sucedido

### Logs do Supabase
```
https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/logs/auth-logs
```

**Procure por:**
- `auth.signin.oauth` - Tentativas de OAuth
- `auth.signin.success` - Logins bem-sucedidos
- `auth.signin.error` - Erros de autenticação

---

## 🧪 Teste Local Primeiro

Antes de debugar produção, confirme que funciona localmente:

```bash
# 1. Instalar dependências
pnpm install

# 2. Build production local
pnpm build

# 3. Rodar em modo dev
pnpm dev

# 4. Testar login em http://localhost:3000/login
# - Email/senha deve funcionar
# - Google OAuth deve funcionar
```

Se funciona local mas não em produção = problema de deploy/variáveis

---

## 🔄 Forçar Redeploy Limpo

Se nada funcionar, force um redeploy limpo:

### Opção 1: Via Dashboard
1. Acesse: `https://vercel.com/[seu-time]/moncoy/deployments`
2. Clique no último deployment
3. `...` → `Redeploy`
4. Marque: `Use existing build cache` = **DESMARCADO**
5. Clique "Redeploy"

### Opção 2: Via Git (Recomendado)
```bash
# 1. Fazer commit vazio para trigger deploy
git commit --allow-empty -m "chore: force redeploy"
git push origin main

# 2. Aguardar deploy automático (2-3 minutos)
# 3. Verificar em https://moncoyfinance.com
```

---

## 🚨 Último Recurso: Rollback

Se a produção quebrou após deploy recente:

1. Acesse: `https://vercel.com/[seu-time]/moncoy/deployments`
2. Encontre último deployment **funcionando**
3. Clique `...` → `Promote to Production`
4. Deployment anterior será restaurado

---

## 📞 Próximos Passos

Execute os testes na ordem:

1. ✅ **Verificar variáveis de ambiente no Vercel** (Seção 1)
2. ✅ **Verificar Supabase Redirect URLs** (Seção 2.1)
3. ✅ **Verificar Google Cloud redirect URIs** (Seção 3)
4. ✅ **Forçar redeploy limpo** (Seção "Forçar Redeploy")
5. ✅ **Testar login email/senha** (Seção 5.1)
6. ✅ **Testar login Google** (Seção 5.2)
7. ✅ **Verificar logs** (Seção 6)

---

## 🆘 Se Ainda Não Funcionar

Compartilhe:
1. URL do erro específico
2. Screenshot do console (F12 → Console)
3. Screenshot do Network tab (F12 → Network)
4. Logs do Vercel (últimas 50 linhas)
5. Logs do Supabase Auth

---

**Última atualização**: 22 de outubro de 2025  
**Branch**: `copilot/vscode1761053701359`  
**Status**: Aguardando verificação de produção
