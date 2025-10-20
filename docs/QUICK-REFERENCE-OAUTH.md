# 🚀 Quick Reference - Google OAuth Setup

## ⚡ Solução Rápida em 3 Passos

### 1️⃣ Google Cloud Console
```
https://console.cloud.google.com
→ APIs & Services → Credentials
→ OAuth 2.0 Client ID
→ Authorized redirect URIs
→ + ADD URI
```

### 2️⃣ Cole esta URI (CRÍTICA!)
```
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

### 3️⃣ Salve e Aguarde
```
→ [SAVE]
→ Aguarde 5-10 minutos
→ Limpe cache do navegador
→ Tente login novamente
```

---

## 📋 Todas as URIs Necessárias

### Copy-Paste Ready:

#### Authorized JavaScript Origins:
```
http://localhost:3000
https://moncoyfinance.com
https://www.moncoyfinance.com
```

#### Authorized Redirect URIs:
```
http://localhost:3000/auth/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

---

## 🧪 Verificação Rápida

```bash
# Verificar configuração
npm run check-oauth

# Deve mostrar todas as URIs necessárias
# e confirmar se .env.local está configurado
```

---

## 🔧 Setup Inicial (.env.local)

```bash
# Copiar exemplo
cp .env.example .env.local

# Editar e preencher
NEXT_PUBLIC_SUPABASE_URL=https://dxdbpppymxfiojszrmir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-chave]
NEXT_PUBLIC_APP_NAME=MoncoyFinance
NEXT_PUBLIC_APP_DOMAIN=moncoyfinance.com
NEXT_PUBLIC_ADMIN_EMAIL=[seu-email]
```

---

## ⚠️ Erros Comuns

### "redirect_uri_mismatch"
✅ Adicione a URI do Supabase no Google Cloud Console

### "Access blocked"
✅ Adicione seu email como Test User no OAuth consent screen

### "invalid_request"
✅ Verifique Client ID e Secret no Supabase

---

## 📖 Documentação Completa

- **Solução Rápida**: [CONFIGURACAO-GOOGLE-OAUTH.md](../CONFIGURACAO-GOOGLE-OAUTH.md)
- **Guia Completo**: [GOOGLE-OAUTH-SETUP.md](./GOOGLE-OAUTH-SETUP.md)
- **Diagrama de Fluxo**: [OAUTH-FLOW-DIAGRAM.md](./OAUTH-FLOW-DIAGRAM.md)
- **Resolução Detalhada**: [OAUTH-PROBLEM-RESOLUTION.md](./OAUTH-PROBLEM-RESOLUTION.md)

---

## 🎯 Checklist Mínimo

- [ ] URI do Supabase adicionada no Google Cloud Console
- [ ] Client ID e Secret configurados no Supabase
- [ ] Provider Google habilitado no Supabase
- [ ] `.env.local` criado e preenchido
- [ ] `npm run check-oauth` executado com sucesso
- [ ] Login testado em modo incógnito

---

**🆘 Precisa de ajuda?** Consulte a documentação completa acima.
