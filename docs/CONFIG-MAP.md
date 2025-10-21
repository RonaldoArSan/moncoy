# 🗺️ Mapa de Configuração - OAuth e Supabase

Este documento mostra visualmente onde encontrar cada configuração necessária para OAuth funcionar.

---

## 📊 Fluxo de Configuração

```
┌─────────────────────────────────────────────────────────────┐
│                    1. Google Console                         │
│  https://console.cloud.google.com/apis/credentials           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ OAuth Consent Screen                                     │
│     • Application name: "MoncoyFinance"                      │
│     • User support email                                     │
│     • Application home page                                  │
│     • Privacy policy / Terms of service                      │
│     • Authorized domains: moncoyfinance.com                  │
│                                                               │
│  ✅ Credentials → OAuth 2.0 Client ID                        │
│     • Application type: Web application                      │
│     • Authorized JavaScript origins (3 URLs)                 │
│     • Authorized redirect URIs (6 URLs)                      │
│                                                               │
│  ➡️  Client ID  ────────────────────────┐                   │
│  ➡️  Client Secret ──────────────────┐  │                   │
└──────────────────────────────────────┼──┼───────────────────┘
                                       │  │
                                       ▼  ▼
┌─────────────────────────────────────────────────────────────┐
│                    2. Supabase Dashboard                      │
│  https://supabase.com/dashboard/project/qlweowbsfpumojgibikk │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ✅ Authentication → Providers → Google                      │
│     • Enable Google provider ✓                               │
│     • Client ID (from Google) ◄──────────────────────┘       │
│     • Client Secret (from Google) ◄──────────────────┘       │
│                                                               │
│  ➡️  Callback URL ────────────────────┐                     │
│      https://...supabase.co/auth/v1/callback                 │
│                                                               │
│  ✅ Authentication → URL Configuration                       │
│     • Site URL: https://moncoyfinance.com                    │
│     • Redirect URLs:                                         │
│       - https://moncoyfinance.com/**                         │
│       - https://moncoyfinance.com/auth/callback              │
│       - http://localhost:3000/**                             │
│                                                               │
└──────────────────────────────────────┼──────────────────────┘
                                       │
                                       ▼
         ┌─────────────────────────────────────────┐
         │   Voltar ao Google Console              │
         │   Adicionar Callback URL do Supabase    │
         │   em "Authorized redirect URIs"         │
         └─────────────────────────────────────────┘
```

---

## 🎯 Onde Encontrar Cada Configuração

### 1️⃣ Google Console

#### OAuth Consent Screen
**Caminho**: APIs & Services → OAuth consent screen  
**URL**: https://console.cloud.google.com/apis/credentials/consent

```
┌────────────────────────────────────┐
│  OAuth consent screen              │
├────────────────────────────────────┤
│                                    │
│  App information                   │
│  ┌──────────────────────────────┐ │
│  │ App name: MoncoyFinance      │ │
│  │ User support email: [email]  │ │
│  │ App logo: [120x120px]        │ │
│  └──────────────────────────────┘ │
│                                    │
│  App domain                        │
│  ┌──────────────────────────────┐ │
│  │ Home page:                   │ │
│  │ https://moncoyfinance.com    │ │
│  │                              │ │
│  │ Privacy policy:              │ │
│  │ https://moncoyfinance.com/   │ │
│  │ privacy                      │ │
│  │                              │ │
│  │ Terms of service:            │ │
│  │ https://moncoyfinance.com/   │ │
│  │ terms                        │ │
│  └──────────────────────────────┘ │
│                                    │
│  Authorized domains                │
│  ┌──────────────────────────────┐ │
│  │ moncoyfinance.com            │ │
│  └──────────────────────────────┘ │
│                                    │
│  [ SAVE AND CONTINUE ]             │
└────────────────────────────────────┘
```

#### Credentials
**Caminho**: APIs & Services → Credentials  
**URL**: https://console.cloud.google.com/apis/credentials

```
┌────────────────────────────────────────────────┐
│  OAuth 2.0 Client IDs                          │
├────────────────────────────────────────────────┤
│                                                │
│  Name: MoncoyFinance - Web App                 │
│  Type: Web application                         │
│                                                │
│  Authorized JavaScript origins                 │
│  ┌──────────────────────────────────────────┐ │
│  │ https://moncoyfinance.com                │ │
│  │ https://www.moncoyfinance.com            │ │
│  │ https://qlweowbsfpumojgibikk.supabase.co│ │
│  │ http://localhost:3000                    │ │
│  │                                          │ │
│  │ [ + ADD URI ]                            │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Authorized redirect URIs                      │
│  ┌──────────────────────────────────────────┐ │
│  │ https://qlweowbsfpumojgibikk.supabase.co│ │
│  │ /auth/v1/callback         ◄── OBRIGATÓRIA│ │
│  │                                          │ │
│  │ https://moncoyfinance.com/auth/callback  │ │
│  │ https://www.moncoyfinance.com/           │ │
│  │ auth/callback                            │ │
│  │ http://localhost:3000/auth/callback      │ │
│  │                                          │ │
│  │ [ + ADD URI ]                            │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  [ SAVE ]                                      │
│                                                │
│  Client ID: [copiar para Supabase]            │
│  Client Secret: [copiar para Supabase]        │
└────────────────────────────────────────────────┘
```

---

### 2️⃣ Supabase Dashboard

#### Authentication → Providers
**Caminho**: Authentication → Providers → Google  
**URL**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/providers

```
┌────────────────────────────────────────────────┐
│  Google                                  [▼]   │
├────────────────────────────────────────────────┤
│                                                │
│  Enable Google provider    [✓ ON]             │
│                                                │
│  Client ID (for OAuth)                         │
│  ┌──────────────────────────────────────────┐ │
│  │ [Cole o Client ID do Google Console]    │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Client Secret (for OAuth)                     │
│  ┌──────────────────────────────────────────┐ │
│  │ [Cole o Client Secret do Google Console]│ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Callback URL (for OAuth)                      │
│  ┌──────────────────────────────────────────┐ │
│  │ https://qlweowbsfpumojgibikk.supabase.co│ │
│  │ /auth/v1/callback                        │ │
│  │                                          │ │
│  │ [📋 Copy] ◄── Copie e cole no Google     │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  [ SAVE ]                                      │
└────────────────────────────────────────────────┘
```

#### Authentication → URL Configuration
**Caminho**: Authentication → URL Configuration  
**URL**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration

```
┌────────────────────────────────────────────────┐
│  URL Configuration                             │
├────────────────────────────────────────────────┤
│                                                │
│  Site URL                                      │
│  ┌──────────────────────────────────────────┐ │
│  │ https://moncoyfinance.com                │ │
│  └──────────────────────────────────────────┘ │
│  ℹ️  Default URL to redirect to after auth    │
│                                                │
│  Redirect URLs                                 │
│  ┌──────────────────────────────────────────┐ │
│  │ https://moncoyfinance.com/**             │ │
│  │ https://www.moncoyfinance.com/**         │ │
│  │ https://moncoyfinance.com/auth/callback  │ │
│  │ https://www.moncoyfinance.com/           │ │
│  │ auth/callback                            │ │
│  │ https://moncoyfinance.com/reset-password │ │
│  │ http://localhost:3000/**                 │ │
│  │ http://localhost:3000/auth/callback      │ │
│  │                                          │ │
│  │ [ + Add another ]                        │ │
│  └──────────────────────────────────────────┘ │
│  ℹ️  One URL per line. Wildcards (**) allowed │
│                                                │
│  [ SAVE ]                                      │
└────────────────────────────────────────────────┘
```

---

## 🔄 Fluxo de Login (Como Funciona)

```
1. Usuário clica em "Continuar com Google"
   │
   ▼
2. App redireciona para Supabase
   URL: https://qlweowbsfpumojgibikk.supabase.co/auth/v1/authorize
   │
   ▼
3. Supabase redireciona para Google
   URL: https://accounts.google.com/o/oauth2/auth
   Params: client_id, redirect_uri, scope
   │
   ▼
4. Usuário faz login no Google e autoriza o app
   │
   ▼
5. Google redireciona para Supabase Callback
   URL: https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
   Params: code, state
   │
   ▼
6. Supabase processa o código e cria sessão
   │
   ▼
7. Supabase redireciona para app
   URL: https://moncoyfinance.com/auth/callback
   Params: code (JWT)
   │
   ▼
8. App processa o código e redireciona para dashboard
   URL: https://moncoyfinance.com/
```

---

## 📋 Checklist Visual

### ✅ Google Console

```
┌─────────────────────────────────────────┐
│ OAuth Consent Screen                    │
├─────────────────────────────────────────┤
│ [ ] Application name: MoncoyFinance     │
│ [ ] User support email configurado      │
│ [ ] Logo carregado (120x120px)          │
│ [ ] Home page: moncoyfinance.com        │
│ [ ] Privacy policy link adicionado      │
│ [ ] Terms of service link adicionado    │
│ [ ] Authorized domain: moncoyfinance.com│
│ [ ] Scopes: email, profile, openid      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ OAuth 2.0 Client ID                     │
├─────────────────────────────────────────┤
│ [ ] Type: Web application               │
│ [ ] 3-4 JavaScript Origins adicionadas  │
│ [ ] 4-6 Redirect URIs adicionadas       │
│ [ ] Callback do Supabase incluída ⭐    │
│ [ ] Client ID copiado                   │
│ [ ] Client Secret copiado               │
└─────────────────────────────────────────┘
```

### ✅ Supabase Dashboard

```
┌─────────────────────────────────────────┐
│ URL Configuration                        │
├─────────────────────────────────────────┤
│ [ ] Site URL: moncoyfinance.com         │
│ [ ] Redirect URLs:                      │
│     [ ] https://moncoyfinance.com/**    │
│     [ ] .../auth/callback               │
│     [ ] .../reset-password              │
│     [ ] localhost URLs (dev)            │
│ [ ] Configurações salvas                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Google Provider                          │
├─────────────────────────────────────────┤
│ [ ] Enable Google provider ✓            │
│ [ ] Client ID colado do Google          │
│ [ ] Client Secret colado do Google      │
│ [ ] Callback URL copiada                │
│ [ ] Callback adicionada no Google       │
│ [ ] Configurações salvas                │
└─────────────────────────────────────────┘
```

---

## 🚨 Pontos de Atenção

### ⚠️ URLs Obrigatórias

**No Google Console** (Authorized redirect URIs):
```
✅ OBRIGATÓRIA:
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback

✅ Recomendadas:
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
```

**No Supabase** (Redirect URLs):
```
✅ OBRIGATÓRIAS:
https://moncoyfinance.com/auth/callback
https://moncoyfinance.com/**

✅ Recomendadas:
https://www.moncoyfinance.com/auth/callback
https://moncoyfinance.com/reset-password
```

### ⚠️ Erros Comuns

| Erro | Onde Ocorre | Causa | Solução |
|------|-------------|-------|---------|
| `redirect_uri_mismatch` | Google | Callback do Supabase não registrado | Adicione no Google Console |
| `Invalid Redirect URL` | Supabase | App URL não registrada | Adicione em URL Configuration |
| Tela em branco após login | App | Site URL incorreta | Verifique em URL Configuration |
| "Access blocked" | Google | Scopes não configurados | Configure OAuth Consent Screen |

---

## 📚 Documentação Relacionada

- **Guia Completo Supabase**: [`SUPABASE-DASHBOARD-CONFIG.md`](SUPABASE-DASHBOARD-CONFIG.md)
- **Quick Reference**: [`../SUPABASE-QUICK-REFERENCE.md`](../SUPABASE-QUICK-REFERENCE.md)
- **Google Console URLs**: [`GOOGLE-CONSOLE-URLS.md`](GOOGLE-CONSOLE-URLS.md)
- **Quick Setup OAuth**: [`../GOOGLE-OAUTH-QUICK-SETUP.md`](../GOOGLE-OAUTH-QUICK-SETUP.md)

---

**Última atualização**: 21 de outubro de 2025  
**Versão**: 1.0
