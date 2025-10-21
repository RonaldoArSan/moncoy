# 🔧 Configurar Supabase Dashboard - Redirect URLs

## 📍 Onde Encontrar as Configurações no Supabase Dashboard

Este guia mostra **exatamente onde** encontrar e configurar os Redirect URLs no Supabase Dashboard.

---

## 🎯 Acesso Rápido ao Supabase Dashboard

**URL do seu projeto**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk

**Links Diretos**:
- **Authentication → URL Configuration**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration
- **Authentication → Providers**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/providers
- **Settings → API**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/settings/api

---

## 📋 Passo a Passo: Configurar Redirect URLs

### **Passo 1: Acessar URL Configuration**

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto: **moncoy** (ID: qlweowbsfpumojgibikk)
3. No menu lateral esquerdo, clique em: **Authentication** → **URL Configuration**

   Ou acesse diretamente: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration

### **Passo 2: Configurar Site URL**

Na seção **Site URL**, configure:

**Desenvolvimento (localhost)**:
```
http://localhost:3000
```

**Produção**:
```
https://moncoyfinance.com
```

> ⚠️ **Importante**: Use a URL de produção quando deployar. O Site URL é usado como fallback quando o redirect URL não é encontrado.

### **Passo 3: Configurar Redirect URLs**

Na seção **Redirect URLs**, adicione as seguintes URLs (uma por linha):

**Para Produção**:
```
https://moncoyfinance.com/**
https://www.moncoyfinance.com/**
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://moncoyfinance.com/reset-password
https://www.moncoyfinance.com/reset-password
```

**Para Desenvolvimento** (opcional):
```
http://localhost:3000/**
http://localhost:3001/**
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
```

> 💡 **Dica**: O padrão `/**` permite qualquer path nesse domínio. É mais flexível, mas menos seguro. Para produção, prefira URLs específicas.

### **Passo 4: Salvar as Configurações**

Clique no botão **Save** no final da página.

> ⏱️ **Atenção**: Mudanças podem levar até 5 minutos para propagar.

---

## 🔐 Configurar Google OAuth Provider

### **Passo 1: Acessar Providers**

1. No menu lateral, vá em: **Authentication** → **Providers**
   
   Ou acesse: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/providers

2. Role até encontrar **Google** na lista de providers

3. Clique em **Google** para expandir as configurações

### **Passo 2: Habilitar Google OAuth**

1. Clique no toggle **Enable Google provider** para ativar

2. Cole as credenciais do Google Console:
   - **Client ID (for OAuth)**: Cole o Client ID do Google
   - **Client Secret (for OAuth)**: Cole o Client Secret do Google

3. Configure opções adicionais (opcional):
   - **Authorized Client IDs**: Deixe em branco para web
   - **Skip nonce check**: ❌ Mantenha desativado (mais seguro)

### **Passo 3: Copiar o Callback URL do Supabase**

Na mesma tela, você verá o **Callback URL (for OAuth)**:

```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
```

> ⚠️ **IMPORTANTE**: Esta URL deve ser adicionada no Google Console → Credentials → OAuth 2.0 Client ID → Authorized redirect URIs

### **Passo 4: Salvar**

Clique em **Save** no final da seção do Google provider.

---

## 🔍 Verificar Configurações

### Checklist de Verificação

Marque cada item após configurar:

#### URL Configuration
- [ ] Site URL configurada (`http://localhost:3000` ou `https://moncoyfinance.com`)
- [ ] Redirect URLs adicionadas (mínimo 2 URLs para produção)
- [ ] Wildcard `/**` incluído para desenvolvimento
- [ ] URLs específicas `/auth/callback` e `/reset-password` adicionadas
- [ ] Configurações salvas

#### Google Provider
- [ ] Google provider habilitado
- [ ] Client ID do Google colado
- [ ] Client Secret do Google colado
- [ ] Callback URL copiada para o Google Console
- [ ] Configurações salvas

---

## 📊 Valores de Referência Rápida

### URLs do Supabase (Cole no Google Console)

**Callback URL do Supabase**:
```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
```

**Authorize URL do Supabase**:
```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/authorize
```

### URLs da Aplicação (Cole no Supabase)

**Site URL** (Produção):
```
https://moncoyfinance.com
```

**Redirect URLs** (Produção):
```
https://moncoyfinance.com/**
https://www.moncoyfinance.com/**
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://moncoyfinance.com/reset-password
https://www.moncoyfinance.com/reset-password
```

**Redirect URLs** (Desenvolvimento):
```
http://localhost:3000/**
http://localhost:3000/auth/callback
http://localhost:3001/**
http://localhost:3001/auth/callback
```

---

## 🚨 Problemas Comuns

### ❌ Erro: "Invalid Redirect URL"

**Causa**: A URL de redirecionamento não está na lista de Redirect URLs permitidas.

**Solução**:
1. Vá em Authentication → URL Configuration
2. Adicione a URL exata que está causando o erro
3. Salve e aguarde 5 minutos
4. Limpe o cache do navegador (Ctrl+Shift+Delete)
5. Tente novamente

### ❌ Erro: "redirect_uri_mismatch" no Google

**Causa**: O Callback URL do Supabase não está no Google Console.

**Solução**:
1. Copie: `https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback`
2. Vá no Google Console → Credentials
3. Adicione em "Authorized redirect URIs"
4. Salve e aguarde 5 minutos

### ❌ Usuário redirecionado para página errada após login

**Causa**: Site URL não está configurada corretamente.

**Solução**:
1. Verifique o Site URL em Authentication → URL Configuration
2. Deve ser `https://moncoyfinance.com` (sem barra no final)
3. Salve e teste novamente

---

## 🧪 Testar Configurações

### Teste 1: Login com Google

1. Acesse: https://moncoyfinance.com/login (ou http://localhost:3000/login)
2. Clique em "Continuar com Google"
3. Selecione uma conta Google
4. Deve redirecionar para `/auth/callback` e depois para `/`
5. ✅ Login bem-sucedido

### Teste 2: Password Reset

1. Na página de login, clique em "Esqueci minha senha"
2. Digite seu email e envie
3. No email recebido, clique no link
4. Deve redirecionar para `/reset-password`
5. ✅ Página de reset carregada

### Teste 3: Verificar Logs

1. Vá em: **Logs** → **Auth Logs** no Supabase Dashboard
2. Acesse: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/logs/auth-logs
3. Veja tentativas de login recentes
4. Procure por erros de redirect

---

## 📱 Outros Providers (Futuro)

### Estrutura Similar para Outros Providers

Se quiser adicionar outros providers (GitHub, Facebook, etc.):

1. Vá em **Authentication** → **Providers**
2. Encontre o provider desejado
3. Habilite e configure da mesma forma que o Google
4. Copie o Callback URL do Supabase
5. Configure no dashboard do provider

**Callback URL padrão** (funciona para todos):
```
https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback
```

---

## 📚 Links Úteis

### Supabase Dashboard
- **Projeto**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk
- **URL Configuration**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration
- **Providers**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/providers
- **Auth Logs**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/logs/auth-logs

### Documentação
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Social Login**: https://supabase.com/docs/guides/auth/social-login
- **Google OAuth**: https://supabase.com/docs/guides/auth/social-login/auth-google
- **Redirect URLs**: https://supabase.com/docs/guides/auth/redirect-urls

### Outros Guias no Projeto
- Google Console URLs: [`docs/GOOGLE-CONSOLE-URLS.md`](./GOOGLE-CONSOLE-URLS.md)
- Quick Setup Google OAuth: [`GOOGLE-OAUTH-QUICK-SETUP.md`](../GOOGLE-OAUTH-QUICK-SETUP.md)
- Fix OAuth Error: [`docs/FIX-GOOGLE-OAUTH-ERROR.md`](./FIX-GOOGLE-OAUTH-ERROR.md)

---

## 🎯 Resumo Executivo

### 3 Passos Principais

1. **URL Configuration** → Adicionar Redirect URLs da aplicação
2. **Providers** → Configurar Google OAuth com Client ID/Secret
3. **Google Console** → Adicionar Callback URL do Supabase

### URLs Mais Importantes

| Descrição | URL |
|-----------|-----|
| Supabase Callback | `https://qlweowbsfpumojgibikk.supabase.co/auth/v1/callback` |
| App Callback | `https://moncoyfinance.com/auth/callback` |
| Site URL | `https://moncoyfinance.com` |

---

**Última atualização**: 21 de outubro de 2025  
**Versão**: 1.0  
**Autor**: Equipe MoncoyFinance
