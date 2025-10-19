# ⚡ Google Console - URLs de Configuração (Quick Reference)

## 🔗 Acesso Rápido ao Google Console

**OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
**Credentials**: https://console.cloud.google.com/apis/credentials

---

## 📋 OAuth Consent Screen

### Application Information
```
Application name: MoncoyFinance
User support email: suporte@moncoyfinance.com
Application home page: https://moncoyfinance.com
Application privacy policy: https://moncoyfinance.com/privacy
Application terms of service: https://moncoyfinance.com/terms
```

### Authorized Domains
```
moncoyfinance.com
```

### Scopes
```
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
openid
```

---

## 🌐 Authorized JavaScript Origins

**Cole estas 3 URLs no Google Console:**

```
https://moncoyfinance.com
https://www.moncoyfinance.com
https://qlweowbsfpumojgibikk.supabase.co
```

### Desenvolvimento (Opcional)
```
http://localhost:3000
http://localhost:3001
```

---

## 🔄 Authorized Redirect URIs

**Cole estas 6 URLs no Google Console:**

```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://moncoyfinance.com/api/auth/callback/google
https://www.moncoyfinance.com/api/auth/callback/google
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/authorize
```

### Desenvolvimento (Opcional)
```
http://localhost:3000/auth/callback
http://localhost:3000/api/auth/callback/google
http://localhost:3001/auth/callback
```

---

## ✅ Checklist Rápido

- [ ] OAuth Consent Screen configurado com nome "MoncoyFinance"
- [ ] Logo carregado (120x120px)
- [ ] 3 JavaScript Origins adicionadas
- [ ] 6 Redirect URIs adicionadas
- [ ] Client ID copiado para o Supabase
- [ ] Client Secret copiado para o Supabase
- [ ] Testado em aba anônima

---

## 🎯 Supabase Configuration

**Dashboard**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk

**Navegue**: Authentication → Providers → Google

**Cole**:
- Client ID do Google Console
- Client Secret do Google Console

**Callback URL do Supabase**:
```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
```

---

## 🧪 Teste

**Local**: http://localhost:3000/login
**Produção**: https://moncoyfinance.com/login

Deve aparecer: **"Prosseguir para MoncoyFinance"** ✅

---

Guia completo: docs/GOOGLE-CONSOLE-URLS.md
