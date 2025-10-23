# 🚨 Quick Fix: Login Error "Email ou senha incorretos"

## ⚡ Quick Checks (1 minute)

### 1. Variáveis de Ambiente no Vercel
```
✅ NEXT_PUBLIC_SUPABASE_URL está configurada?
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY está configurada?
✅ Fez REDEPLOY depois de configurar?
```

**Como verificar:**
1. https://vercel.com/[projeto]/settings/environment-variables
2. Se faltando → Adicionar → Redeploy
3. Aguardar 2-3 minutos

### 2. Usuário Existe no Supabase?
```
✅ Usuário está na lista de Auth Users?
✅ Email está confirmado (confirmed)?
✅ Não está bloqueado (banned)?
```

**Como verificar:**
1. https://supabase.com/dashboard/project/[id]/auth/users
2. Procurar pelo email
3. Ver status

### 3. Configuração do Supabase
```
✅ Site URL = https://moncoyfinance.com
✅ Redirect URL inclui /auth/callback
```

**Como verificar:**
1. https://supabase.com/dashboard/project/[id]/auth/url-configuration
2. Verificar URLs

## 🔍 Ler Logs do Vercel

**Onde:** https://vercel.com/[projeto]/logs

**O que procurar:**

| Mensagem no Log | O que significa | Solução |
|----------------|-----------------|---------|
| 🚨 CRITICAL: Missing Supabase | Faltam variáveis de ambiente | Adicionar no Vercel + Redeploy |
| ❌ Invalid login credentials | Email ou senha errados | Verificar credenciais |
| ❌ Email not confirmed | Email não confirmado | Confirmar email na caixa de entrada |
| ❌ User not found | Usuário não existe | Criar usuário no Supabase |
| ⚠️ Login successful but session not created | Problema com cookies | Limpar cookies ou testar em anônimo |

## 🎯 Passo a Passo Rápido

### Se NÃO tem logs de erro:
```
Problema: Variáveis de ambiente faltando
Solução: Configurar no Vercel → Redeploy
```

### Se tem "Invalid login credentials":
```
1. Confirmar email está correto
2. Confirmar senha está correta
3. Verificar usuário existe no Supabase
4. Verificar email está confirmado
```

### Se tem "session not created":
```
1. Limpar cookies: Ctrl+Shift+Delete
2. Testar em modo anônimo
3. Verificar Site URL no Supabase
4. Verificar HTTPS está ativo
```

## 🆘 Teste Rápido Local

```bash
# 1. Clone e configure
git clone https://github.com/RonaldoArSan/moncoy.git
cd moncoy
echo "NEXT_PUBLIC_SUPABASE_URL=https://..." > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=..." >> .env.local

# 2. Instale e rode
npm install --legacy-peer-deps
npm run dev

# 3. Teste em http://localhost:3000/login
```

**Resultado:**
- ✅ **Funciona local, não funciona produção** → Problema de deploy/env vars
- ❌ **Não funciona local** → Problema com credenciais/Supabase

## 📋 Checklist Final

```
[ ] Variáveis no Vercel configuradas
[ ] Redeploy feito
[ ] Usuário existe no Supabase
[ ] Email confirmado
[ ] Site URL correta
[ ] Testado em anônimo
[ ] Logs verificados
```

## 💡 Mais Detalhes

Ver arquivo completo: `DEBUGGING_LOGIN_PRODUCTION.md`

---

**Branch:** `copilot/fix-auth-login-error`  
**Status:** ✅ Pronto para deploy
