# 🔐 Configuração do Google OAuth 2.0 - MoncoyFinance

Este documento fornece instruções detalhadas para configurar o Google OAuth 2.0 e resolver o erro:
```
Não é possível fazer login no app porque ele não obedece à política do OAuth 2.0 do Google.
redirect_uri=https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback flowName=GeneralOAuthFlow
```

## 📋 Pré-requisitos

- Conta no Google Cloud Platform
- Projeto criado no Google Cloud Console
- Projeto Supabase configurado
- Domínio da aplicação (produção e/ou desenvolvimento)

## 🎯 Problema

O erro ocorre porque a URI de redirecionamento `https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback` não está registrada no Google Cloud Console. Esta URI é utilizada pelo Supabase para processar o callback do OAuth 2.0 do Google.

## 🔧 Solução Passo a Passo

### Passo 1: Acessar o Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Selecione seu projeto ou crie um novo
3. Habilite a **Google+ API** (necessária para OAuth)

### Passo 2: Configurar OAuth Consent Screen

Navegue até: **APIs & Services** → **OAuth consent screen**

#### Configurações Obrigatórias:

```
User Type: External (ou Internal se for para G Suite/Workspace)
Application name: MoncoyFinance
User support email: [seu-email@moncoyfinance.com]
Developer contact email: [seu-email@moncoyfinance.com]
```

#### Configurações Recomendadas:

```
Application logo: [Upload logo 120x120px ou maior]
Application home page: https://moncoyfinance.com
Application privacy policy: https://moncoyfinance.com/privacy
Application terms of service: https://moncoyfinance.com/terms
```

#### Authorized Domains:

Adicione os seguintes domínios:
```
moncoyfinance.com
supabase.co
localhost (para desenvolvimento)
```

#### Scopes:

Adicione os seguintes scopes:
```
.../auth/userinfo.email
.../auth/userinfo.profile
openid
```

Clique em **Save and Continue**.

### Passo 3: Criar OAuth 2.0 Client ID

Navegue até: **APIs & Services** → **Credentials**

1. Clique em **Create Credentials** → **OAuth 2.0 Client ID**
2. Selecione **Application type**: Web application
3. Configure:

```
Name: MoncoyFinance Web Client
```

#### Authorized JavaScript Origins:

**IMPORTANTE**: Adicione todas as URLs de onde sua aplicação pode iniciar o fluxo OAuth:

```
http://localhost:3000
https://moncoyfinance.com
https://www.moncoyfinance.com
```

#### Authorized Redirect URIs:

**CRÍTICO**: Adicione TODAS as URIs abaixo. Este é o ponto mais importante para resolver o erro:

```
http://localhost:3000/auth/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

**⚠️ ATENÇÃO**: A URI do Supabase (`https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback`) é OBRIGATÓRIA. Sem ela, o erro continuará acontecendo.

4. Clique em **Create**
5. Copie o **Client ID** e **Client Secret** gerados

### Passo 4: Configurar o Supabase

1. Acesse o Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir
   ```

2. Navegue até: **Authentication** → **Providers** → **Google**

3. Configure:
   ```
   Enable Google provider: ✅ Enabled
   Client ID (for OAuth): [Cole o Client ID do Google]
   Client Secret (for OAuth): [Cole o Client Secret do Google]
   ```

4. Anote a **Redirect URL** fornecida pelo Supabase:
   ```
   https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
   ```

5. Em **Authentication** → **URL Configuration**:
   ```
   Site URL: https://moncoyfinance.com
   ```

6. Em **Redirect URLs**, adicione:
   ```
   http://localhost:3000/**
   https://moncoyfinance.com/**
   https://www.moncoyfinance.com/**
   ```

### Passo 5: Configurar Variáveis de Ambiente

Crie ou atualize o arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dxdbpppymxfiojszrmir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-anon-key]

# Google OAuth (Opcional - para customização)
NEXT_PUBLIC_GOOGLE_HD=moncoyfinance.com
NEXT_PUBLIC_APP_NAME=MoncoyFinance
NEXT_PUBLIC_APP_DOMAIN=moncoyfinance.com

# Admin
NEXT_PUBLIC_ADMIN_EMAIL=[email-do-admin]
```

### Passo 6: Verificar a Configuração

Execute o seguinte checklist:

- [ ] Google Cloud Console:
  - [ ] OAuth consent screen configurado com "MoncoyFinance"
  - [ ] Logo carregado (recomendado)
  - [ ] Domínios autorizados: `moncoyfinance.com`, `supabase.co`, `localhost`
  - [ ] Scopes configurados: email, profile, openid

- [ ] OAuth 2.0 Client ID:
  - [ ] Authorized JavaScript origins configuradas
  - [ ] Authorized redirect URIs incluindo a URI do Supabase
  - [ ] Client ID e Client Secret copiados

- [ ] Supabase:
  - [ ] Provider Google habilitado
  - [ ] Client ID configurado
  - [ ] Client Secret configurado
  - [ ] Site URL configurada
  - [ ] Redirect URLs configuradas

- [ ] Projeto:
  - [ ] Arquivo `.env.local` criado
  - [ ] Variáveis de ambiente configuradas
  - [ ] Dependências instaladas: `npm install --legacy-peer-deps`

## 🧪 Testar a Configuração

1. **Limpe o cache do navegador** ou use o modo incógnito
2. **Reinicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```
3. **Acesse**: http://localhost:3000/login
4. **Clique em "Continuar com Google"**
5. **Verifique**:
   - A tela de consentimento do Google deve aparecer
   - O nome "MoncoyFinance" deve ser exibido
   - Após autorizar, você deve ser redirecionado para o dashboard

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"

**Causa**: A URI de redirecionamento não está registrada no Google Cloud Console.

**Solução**:
1. Verifique se todas as URIs do Passo 3 estão cadastradas
2. Aguarde 5-10 minutos para propagação das mudanças
3. Limpe o cache do navegador
4. Tente novamente

### Erro: "Access blocked: Authorization Error"

**Causa**: A aplicação não está verificada pelo Google ou os scopes não foram configurados.

**Solução**:
1. Adicione seu email como "Test user" no OAuth consent screen
2. Configure todos os scopes necessários
3. Para produção, submeta a aplicação para verificação do Google

### Erro: "Error 400: invalid_request"

**Causa**: Configuração incorreta no código ou nas variáveis de ambiente.

**Solução**:
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme que o código está usando `supabase.auth.signInWithOAuth({ provider: 'google' })`
3. Verifique os logs do Supabase para mais detalhes

### Login funciona localmente mas não em produção

**Causa**: URIs de produção não registradas no Google Cloud Console.

**Solução**:
1. Adicione as URIs de produção nas Authorized redirect URIs
2. Atualize a Site URL no Supabase para o domínio de produção
3. Verifique se as variáveis de ambiente de produção estão corretas

## 📚 Recursos Adicionais

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

## 🎨 Customizações Adicionais

Para personalizar ainda mais a experiência do usuário, consulte:
- `docs/GOOGLE_AUTH_CUSTOMIZATION.md` - Customizações visuais e branding

## 💡 Dicas Importantes

1. **Propagação**: Mudanças no Google Cloud Console podem levar alguns minutos para propagar
2. **Cache**: Sempre limpe o cache do navegador após fazer mudanças
3. **Teste em Múltiplos Ambientes**: Teste tanto em desenvolvimento quanto em produção
4. **Segurança**: NUNCA commite o arquivo `.env.local` no Git
5. **Backup**: Mantenha backup do Client ID e Client Secret em local seguro

## ⚠️ Segurança

- Mantenha o Client Secret em segredo
- Use variáveis de ambiente para credenciais
- Adicione `.env.local` no `.gitignore`
- Configure Rate Limiting no Supabase
- Monitore tentativas de login suspeitas

---

**Última atualização**: 2025-10-20
**Versão**: 1.0.0
