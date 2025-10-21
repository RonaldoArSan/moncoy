# 🔧 Configuração OAuth do Supabase - Correção CORS e State Parameter

## 🚨 Problemas Identificados

1. **CORS Policy Error**: Headers `x-supabase-api-version` bloqueados
2. **OAuth State Missing**: Parâmetro `state` ausente no callback
3. **URL Duplicada**: `/auth/v1/callback/auth/v1/token` (path duplicado)

---

## ✅ Correções Implementadas

### 1. **Auth Provider** (`components/auth-provider.tsx`)
- ✅ Uso de `NEXT_PUBLIC_SITE_URL` para redirectTo consistente
- ✅ Adição de `skipBrowserRedirect: false` explícito
- ✅ Better error handling com logger
- ✅ Suporte a query param `next` para redirect após login

### 2. **Auth Callback Route Handler** (`app/auth/callback/route.ts`)
- ✅ **ÚNICO handler** - Removido `page.tsx` para evitar conflito Next.js
- ✅ Route Handler API para processar callback OAuth no servidor
- ✅ Tratamento de erros do OAuth antes de processar
- ✅ Exchange code por session no servidor (mais seguro)
- ✅ Suporte a parâmetro `next` para redirect customizado
- ✅ Logging detalhado com `@/lib/logger`

### 3. **Middleware** (`middleware.ts`)
- ✅ Integração do Supabase SSR no middleware
- ✅ Refresh automático de sessão em cada request
- ✅ Cookies com `sameSite: 'lax'` e `secure` em produção
- ✅ Exclusão de assets estáticos do matcher

### 4. **Variáveis de Ambiente** (`.env.local`)
- ✅ Adicionado `NEXT_PUBLIC_SITE_URL=https://moncoyfinance.com`

---

## 🔧 Configuração Necessária no Supabase Dashboard

### **Passo 1: Site URL**
1. Acesse: https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir
2. Vá em **Settings** → **API** → **Configuration**
3. Configure:
   - **Site URL**: `https://moncoyfinance.com`

### **Passo 2: Redirect URLs**
Na mesma tela, em **Redirect URLs**, adicione:

```
http://localhost:3000/auth/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
```

⚠️ **IMPORTANTE**: Use `/auth/callback` (sem duplicação de path)

### **Passo 3: Google OAuth Provider**
1. Vá em **Authentication** → **Providers** → **Google**
2. Verifique:
   - ✅ **Enable Google provider**: Ativado
   - ✅ **Client ID**: Configurado no Google Cloud Console
   - ✅ **Client Secret**: Configurado no Google Cloud Console
   - ❌ **Skip nonce check**: Desativado (segurança)

---

## 🌐 Configuração no Google Cloud Console

### **URIs de Redirecionamento Autorizados**
No Google Cloud Console → Credentials → OAuth 2.0 Client ID:

```
http://localhost:3000/auth/callback
https://moncoyfinance.com/auth/callback
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

⚠️ **CRÍTICO**: O URI do Supabase **DEVE** estar registrado!

---

## 📝 Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas:

### **.env.local** (Desenvolvimento)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dxdbpppymxfiojszrmir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=https://moncoyfinance.com
```

### **Vercel** (Produção)
Adicione as mesmas variáveis no Vercel Dashboard:
1. Project Settings → Environment Variables
2. Adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`

---

## 🧪 Teste do Fluxo OAuth

### **Cenário 1: Login com Google (Dev)**
1. Acesse: http://localhost:3000/login
2. Clique em "Continuar com Google"
3. Selecione conta Google
4. Deve redirecionar: `http://localhost:3000/auth/callback?code=...`
5. Deve finalizar em: `http://localhost:3000/` (dashboard)

### **Cenário 2: Login com Google (Produção)**
1. Acesse: https://moncoyfinance.com/login
2. Clique em "Continuar com Google"
3. Selecione conta Google
4. Deve redirecionar: `https://moncoyfinance.com/auth/callback?code=...`
5. Deve finalizar em: `https://moncoyfinance.com/` (dashboard)

### **Cenário 3: Admin Login com Google**
1. Acesse: https://moncoyfinance.com/admin/login
2. Clique em "Continuar com Google"
3. Selecione conta Google
4. Deve redirecionar: `https://moncoyfinance.com/auth/callback?code=...&next=/admin`
5. Deve finalizar em: `https://moncoyfinance.com/admin` (admin dashboard)

---

## 🔍 Debug de Erros

### **Erro: "OAuth state parameter missing"**
**Causa**: State PKCE não está sendo gerado/verificado corretamente

**Verificações**:
1. ✅ Supabase Dashboard → Site URL está configurada?
2. ✅ Redirect URLs incluem `/auth/callback`?
3. ✅ Cookies habilitados no navegador?
4. ✅ Middleware refresh sessão está funcionando?

### **Erro: CORS Policy (x-supabase-api-version)**
**Causa**: Supabase client tentando fazer request cross-origin

**Solução**:
- ✅ Use Route Handler (`app/auth/callback/route.ts`) para processar no servidor
- ✅ Middleware gerencia cookies automaticamente
- ✅ Não fazer `exchangeCodeForSession` no client-side

### **Erro: redirect_uri_mismatch**
**Causa**: URI não está registrado no Google Cloud Console

**Solução**:
1. Verifique Google Cloud Console → Credentials
2. Certifique-se que `https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback` está listado
3. Aguarde 5 minutos para propagação

---

## 🚀 Deploy e Verificação

### **Checklist Pré-Deploy**
- [ ] `.env.local` contém `NEXT_PUBLIC_SITE_URL`
- [ ] Supabase Dashboard: Site URL configurada
- [ ] Supabase Dashboard: Redirect URLs configuradas
- [ ] Google Cloud Console: URIs de redirecionamento atualizados
- [ ] Código commitado e pushed

### **Comandos de Deploy**
```bash
# Build local para verificar erros
pnpm build

# Deploy no Vercel
vercel --prod

# Ou push para main (auto-deploy)
git add .
git commit -m "fix: OAuth CORS e state parameter issues"
git push origin main
```

### **Verificações Pós-Deploy**
1. ✅ Vercel logs sem erros
2. ✅ Teste login Google em produção
3. ✅ Verifique cookies sendo setados (DevTools → Application → Cookies)
4. ✅ Verifique Supabase Auth logs (Dashboard → Logs → Auth Logs)

---

## 📊 Monitoramento

### **Supabase Auth Logs**
1. Acesse: https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir
2. Vá em: **Logs** → **Auth Logs**
3. Procure por:
   - ✅ `auth.signin.oauth` (início do fluxo)
   - ✅ `auth.signin.success` (sucesso)
   - ❌ `auth.signin.error` (erros)

### **Vercel Logs**
```bash
vercel logs [deployment-url] --follow
```

Procure por:
- ✅ `GET /auth/callback 200` (sucesso)
- ❌ `GET /auth/callback 500` (erro)

---

## 📞 Troubleshooting

Se ainda tiver problemas:

1. **Limpe cookies e cache do navegador**
   - Chrome: Ctrl+Shift+Delete → "Cookies e outros dados de sites"
   
2. **Teste em modo incógnito**
   - Elimina problemas de cache

3. **Verifique Network tab** (DevTools)
   - Procure requests falhando com CORS
   - Verifique headers das requisições

4. **Revise Supabase Auth Logs**
   - Identifique exatamente onde o fluxo falha

5. **Teste com email/senha primeiro**
   - Se funcionar, problema é específico do OAuth

---

**Última atualização**: 21 de outubro de 2025  
**Autor**: GitHub Copilot  
**Projeto**: MoncoyFinance
