# 🚀 Supabase - Guia Rápido de Configuração

## 📍 Links Diretos (Acesso Instantâneo)

### Supabase Dashboard
```
🏠 Projeto Principal
https://supabase.com/dashboard/project/qlweowbsfpumojgibikk

🔐 URL Configuration (Redirect URLs)
https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration

👥 Providers (Google OAuth)
https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/providers

📊 Auth Logs
https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/logs/auth-logs

⚙️ API Settings
https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/settings/api
```

---

## 🔧 1. Configurar Redirect URLs

**Onde**: Authentication → URL Configuration  
**Link**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration

### Site URL
```
https://moncoyfinance.com
```

### Redirect URLs (Cole uma por linha)
```
https://moncoyfinance.com/**
https://www.moncoyfinance.com/**
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://moncoyfinance.com/reset-password
http://localhost:3000/**
http://localhost:3000/auth/callback
```

---

## 🔐 2. Configurar Google OAuth

**Onde**: Authentication → Providers → Google  
**Link**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/providers

### Ativar Provider
- ✅ Enable Google provider

### Credenciais
- **Client ID**: (copie do Google Console)
- **Client Secret**: (copie do Google Console)

### Callback URL (Copie e cole no Google Console)
```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
```

---

## 🌐 3. Configurar Google Console

**Onde**: Google Cloud Console → Credentials  
**Link**: https://console.cloud.google.com/apis/credentials

### Authorized JavaScript Origins
```
https://moncoyfinance.com
https://www.moncoyfinance.com
https://qlweowbsfpumojgibikk.supabase.co
http://localhost:3000
```

### Authorized Redirect URIs
```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
http://localhost:3000/auth/callback
```

---

## ✅ Checklist Rápido

### Supabase
- [ ] Site URL configurada
- [ ] Redirect URLs adicionadas (mínimo 2)
- [ ] Google provider habilitado
- [ ] Client ID/Secret do Google colados
- [ ] Configurações salvas

### Google Console
- [ ] OAuth Consent Screen configurado
- [ ] Application name: "MoncoyFinance"
- [ ] 3-4 JavaScript Origins adicionadas
- [ ] 4-6 Redirect URIs adicionadas
- [ ] Callback URL do Supabase incluída
- [ ] Client ID/Secret copiados

---

## 🚨 Erro Comum: "Invalid Redirect URL"

**Solução Rápida**:
1. Copie a URL exata do erro
2. Vá em: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration
3. Cole em "Redirect URLs"
4. Salve e aguarde 5 minutos
5. Limpe cache do navegador (Ctrl+Shift+Delete)

---

## 🧪 Teste Rápido

1. Acesse: http://localhost:3000/login
2. Clique em "Continuar com Google"
3. Deve aparecer: **"Prosseguir para MoncoyFinance"** ✅
4. Após login, deve redirecionar para `/`

---

## 📚 Documentação Completa

- **Configuração Supabase Dashboard**: [`docs/SUPABASE-DASHBOARD-CONFIG.md`](docs/SUPABASE-DASHBOARD-CONFIG.md)
- **Configuração Google Console**: [`docs/GOOGLE-CONSOLE-URLS.md`](docs/GOOGLE-CONSOLE-URLS.md)
- **Quick Setup Google OAuth**: [`GOOGLE-OAUTH-QUICK-SETUP.md`](GOOGLE-OAUTH-QUICK-SETUP.md)
- **Correção de Erros OAuth**: [`docs/FIX-GOOGLE-OAUTH-ERROR.md`](docs/FIX-GOOGLE-OAUTH-ERROR.md)

---

## 🆘 Precisa de Ajuda?

### Logs e Debugging
- **Auth Logs**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/logs/auth-logs
- **Console do Navegador**: F12 → Console / Network
- **Docs Supabase**: https://supabase.com/docs/guides/auth

### Valores de Referência
| Item | Valor |
|------|-------|
| Supabase URL | `https://qlweowbsfpumojgibikk.supabase.co` |
| Callback URL | `https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback` |
| Site URL | `https://moncoyfinance.com` |
| App Callback | `https://moncoyfinance.com/auth/callback` |

---

**Última atualização**: 21 de outubro de 2025
