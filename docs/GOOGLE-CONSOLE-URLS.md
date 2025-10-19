# 🔐 URLs para Configuração no Google Console

## Guia Completo para Configurar OAuth 2.0 - MoncoyFinance

---

## 📋 Informações do Projeto

- **Nome do Projeto**: MoncoyFinance
- **Domínio Principal**: moncoyfinance.com
- **Ambiente Local**: localhost:3000
- **Supabase URL**: qlweowbsfpumojgibikk.supabase.co

---

## 🎯 Passo 1: OAuth Consent Screen

Acesse: https://console.cloud.google.com/apis/credentials/consent

### **Informações da Aplicação**

| Campo | Valor |
|-------|-------|
| **Application name** | `MoncoyFinance` |
| **User support email** | `suporte@moncoyfinance.com` |
| **Application home page** | `https://moncoyfinance.com` |
| **Application privacy policy link** | `https://moncoyfinance.com/privacy` |
| **Application terms of service link** | `https://moncoyfinance.com/terms` |
| **Authorized domains** | `moncoyfinance.com` |
| **Developer contact email** | `suporte@moncoyfinance.com` |

### **Logo da Aplicação**
- Formato: PNG ou JPG
- Tamanho recomendado: 120x120 pixels
- Localização: `public/logo.png` ou `public/og-image.png`

### **Scopes (Escopos)**
Adicione os seguintes escopos:
- `https://www.googleapis.com/auth/userinfo.email`
- `https://www.googleapis.com/auth/userinfo.profile`
- `openid`

---

## 🔑 Passo 2: Criar OAuth 2.0 Client ID

Acesse: https://console.cloud.google.com/apis/credentials

### **Tipo de Aplicação**
- Selecione: **Web application**

### **Nome**
```
MoncoyFinance - Web App
```

---

## 🌐 Passo 3: Authorized JavaScript Origins

### **Para PRODUÇÃO (moncoyfinance.com)**

Adicione estas **3 URLs**:

```
https://moncoyfinance.com
https://www.moncoyfinance.com
https://qlweowbsfpumojgibikk.supabase.co
```

### **Para DESENVOLVIMENTO Local (localhost)**

Se quiser testar localmente, adicione também:

```
http://localhost:3000
http://localhost:3001
```

---

## 🔄 Passo 4: Authorized Redirect URIs

### **Para PRODUÇÃO (moncoyfinance.com)**

Adicione estas **6 URLs** (ordem importa):

```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://moncoyfinance.com/api/auth/callback/google
https://www.moncoyfinance.com/api/auth/callback/google
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/authorize
```

### **Para DESENVOLVIMENTO Local (localhost)**

Se quiser testar localmente, adicione também:

```
http://localhost:3000/auth/callback
http://localhost:3000/api/auth/callback/google
http://localhost:3001/auth/callback
```

---

## ✅ Checklist de Configuração

### OAuth Consent Screen
- [ ] Application name: "MoncoyFinance"
- [ ] User support email configurado
- [ ] Logo carregado (120x120px)
- [ ] Application home page: https://moncoyfinance.com
- [ ] Privacy policy link: https://moncoyfinance.com/privacy
- [ ] Terms of service link: https://moncoyfinance.com/terms
- [ ] Authorized domain: moncoyfinance.com
- [ ] Scopes adicionados (email, profile, openid)

### OAuth 2.0 Client ID
- [ ] Tipo: Web application
- [ ] Nome: "MoncoyFinance - Web App"
- [ ] 3 JavaScript Origins (produção)
- [ ] 6 Redirect URIs (produção)
- [ ] Client ID copiado
- [ ] Client Secret copiado

### Supabase Dashboard
- [ ] Google OAuth habilitado em Authentication → Providers
- [ ] Client ID do Google colado
- [ ] Client Secret do Google colado
- [ ] Redirect URL copiada: `https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback`

---

## 🔧 Configuração no Supabase

### 1. Acesse o Supabase Dashboard
```
https://supabase.com/dashboard/project/qlweowbsfpumojgibikk
```

### 2. Navegue para Authentication → Providers

### 3. Encontre "Google" e habilite

### 4. Cole as credenciais do Google Console

| Campo | Onde encontrar |
|-------|---------------|
| **Client ID** | Google Console → Credentials → OAuth 2.0 Client IDs |
| **Client Secret** | Mesma tela acima, clique em "Show Secret" |

### 5. Verifique a Redirect URL

O Supabase mostrará esta URL (copie e adicione no Google Console):
```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
```

---

## 🧪 Testando a Configuração

### Teste Local (localhost:3000)

1. Inicie o servidor: `pnpm dev`
2. Acesse: http://localhost:3000/login
3. Clique em "Continuar com Google"
4. Deve aparecer: **"Prosseguir para MoncoyFinance"** ✅
5. Complete o login

### Teste Produção (moncoyfinance.com)

1. Acesse: https://moncoyfinance.com/login
2. Clique em "Continuar com Google"
3. Deve aparecer: **"Prosseguir para MoncoyFinance"** ✅
4. Complete o login

---

## 🚨 Problemas Comuns

### ❌ "Error: redirect_uri_mismatch"

**Causa**: A URL de redirecionamento não está registrada no Google Console.

**Solução**:
1. Copie a URL exata do erro
2. Adicione em "Authorized redirect URIs"
3. Aguarde 5 minutos para propagar
4. Tente novamente

### ❌ Ainda aparece nome do Supabase ao invés de MoncoyFinance

**Causa**: OAuth Consent Screen não foi configurado corretamente.

**Solução**:
1. Volte em OAuth consent screen
2. Verifique se "Application name" está como "MoncoyFinance"
3. Salve novamente
4. Limpe cache do navegador (Ctrl + Shift + Delete)
5. Teste em aba anônima

### ❌ "Access blocked: This app's request is invalid"

**Causa**: Scopes não foram adicionados no OAuth Consent Screen.

**Solução**:
1. OAuth consent screen → Scopes
2. Adicione: email, profile, openid
3. Salve
4. Tente novamente

---

## 📱 URLs Resumidas (Copy/Paste)

### JavaScript Origins (3 URLs)
```
https://moncoyfinance.com
https://www.moncoyfinance.com
https://qlweowbsfpumojgibikk.supabase.co
```

### Redirect URIs (6 URLs)
```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://moncoyfinance.com/api/auth/callback/google
https://www.moncoyfinance.com/api/auth/callback/google
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/authorize
```

### Authorized Domain
```
moncoyfinance.com
```

---

## 🎨 Customização Adicional

### Logo no OAuth Screen

O logo aparecerá:
- Na tela de consentimento do Google
- Na lista de apps conectados do usuário
- Emails de notificação do Google

**Especificações**:
- Formato: PNG com fundo transparente (recomendado) ou JPG
- Tamanho: 120x120 pixels
- Peso máximo: 1MB
- Localização sugerida: `public/google-oauth-logo.png`

### Brand Colors

O Google extrai automaticamente as cores do seu logo para personalizar a tela.

---

## 📚 Links Úteis

- **Google Cloud Console**: https://console.cloud.google.com
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent
- **Credentials**: https://console.cloud.google.com/apis/credentials
- **Supabase Dashboard**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk
- **Documentação Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Documentação Supabase Auth**: https://supabase.com/docs/guides/auth/social-login/auth-google

---

## 🔐 Segurança

### ⚠️ NUNCA exponha publicamente:
- Client Secret do Google
- Service Role Key do Supabase
- Stripe Secret Key
- OpenAI API Key

### ✅ Pode ser público:
- Client ID do Google (usado no frontend)
- Supabase URL
- Supabase Anon Key
- Stripe Publishable Key

---

## 📝 Notas Finais

1. **Propagação de Mudanças**: Alterações no Google Console podem levar até 5 minutos para propagar
2. **Cache do Navegador**: Sempre teste em aba anônima após mudanças
3. **Ambiente de Teste**: Mantenha credenciais separadas para desenvolvimento e produção
4. **Auditoria**: Revise periodicamente os apps conectados em: https://myaccount.google.com/permissions

---

Documento criado em: 19/01/2025
Última atualização: 19/01/2025
