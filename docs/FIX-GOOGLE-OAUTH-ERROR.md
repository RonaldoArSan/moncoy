# 🔧 Correção do Erro OAuth 2.0 do Google

## ❌ Erro Atual
```
Não é possível fazer login no app porque ele não obedece à política do OAuth 2.0 do Google.

Detalhes da solicitação: 
redirect_uri=https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
flowName=GeneralOAuthFlow
```

## 🎯 Causa do Problema
O URI de redirecionamento do Supabase não está registrado no Google Cloud Console.

---

## ✅ Solução: Passo a Passo

### **Passo 1: Acessar o Google Cloud Console**

1. Acesse: https://console.cloud.google.com
2. Faça login com sua conta Google
3. Selecione o projeto do MoncoyFinance (ou crie um novo)

### **Passo 2: Configurar OAuth Consent Screen**

1. No menu lateral, vá em: **APIs & Services** → **OAuth consent screen**

2. Configure as informações:
   - **User Type**: External (ou Internal se for workspace)
   - **Application name**: `MoncoyFinance`
   - **User support email**: Seu email
   - **Application logo**: (opcional) Upload do logo 120x120px
   - **Application home page**: `https://moncoyfinance.com`
   - **Application privacy policy**: `https://moncoyfinance.com/privacy`
   - **Application terms of service**: `https://moncoyfinance.com/terms`
   - **Authorized domains**: 
     - `moncoyfinance.com`
     - `supabase.co`
     - `localhost` (para desenvolvimento)

3. Clique em **Save and Continue**

### **Passo 3: Configurar Credenciais OAuth 2.0**

1. No menu lateral, vá em: **APIs & Services** → **Credentials**

2. Se ainda não tiver, clique em **+ CREATE CREDENTIALS** → **OAuth client ID**
   - **Application type**: Web application
   - **Name**: `MoncoyFinance Web Client`

3. **Configure os URIs de Redirecionamento** (CRÍTICO):

   **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   https://moncoyfinance.com
   https://www.moncoyfinance.com
   ```

   **Authorized redirect URIs:**
   ```
   http://localhost:3000/auth/callback
   https://moncoyfinance.com/auth/callback
   https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
   ```

   ⚠️ **IMPORTANTE**: O URI `https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback` é OBRIGATÓRIO!

4. Clique em **CREATE** ou **SAVE**

5. Copie o **Client ID** e **Client Secret** gerados

### **Passo 4: Configurar no Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir

2. Vá em: **Authentication** → **Providers** → **Google**

3. Configure:
   - ✅ **Enable Google provider**: Ativado
   - **Client ID (for OAuth)**: Cole o Client ID do Google Cloud
   - **Client Secret (for OAuth)**: Cole o Client Secret do Google Cloud
   - **Authorized Client IDs**: (deixe em branco se não usar)
   - **Skip nonce check**: ❌ Desativado (mais seguro)

4. Clique em **Save**

### **Passo 5: Configurar URLs no Supabase**

1. Ainda no Supabase Dashboard, vá em: **Settings** → **API** → **Configuration**

2. Configure:
   - **Site URL**: `http://localhost:3000` (desenvolvimento) ou `https://moncoyfinance.com` (produção)

3. Em **Redirect URLs**, adicione:
   ```
   http://localhost:3000/**
   https://moncoyfinance.com/**
   https://www.moncoyfinance.com/**
   ```

4. Clique em **Save**

---

## 🧪 Testar a Configuração

### **Teste 1: Verificar Credenciais**

Execute este script para verificar se as variáveis estão corretas:

```bash
cd /home/ronald/moncoyfinance/moncoy
cat .env.local | grep SUPABASE
```

Deve mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=https://dxdbpppymxfiojszrmir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Teste 2: Testar Login**

1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Acesse: http://localhost:3000/login
3. Clique em "Continuar com Google"
4. Deve abrir a tela de seleção de conta do Google
5. Após selecionar, deve redirecionar de volta para o app

### **Teste 3: Verificar Logs**

No terminal do servidor Next.js, deve aparecer:
```
✓ Compiled /auth/callback in 500ms
GET /auth/callback 200 in 800ms
```

---

## 🔍 Checklist de Verificação

Marque cada item após completar:

- [ ] Google Cloud Console: Projeto criado/selecionado
- [ ] OAuth Consent Screen: Configurado com nome "MoncoyFinance"
- [ ] Credentials: OAuth 2.0 Client ID criado
- [ ] Redirect URIs: Supabase callback URL adicionado (`https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback`)
- [ ] Supabase: Google provider ativado
- [ ] Supabase: Client ID e Secret configurados
- [ ] Supabase: Site URL configurada
- [ ] Supabase: Redirect URLs adicionadas
- [ ] Teste: Login funcionando
- [ ] Cache do navegador limpo

---

## 🚨 Erros Comuns e Soluções

### **Erro: "redirect_uri_mismatch"**
**Causa**: URI de redirecionamento não está registrado corretamente

**Solução**:
1. Volte no Google Cloud Console → Credentials
2. Verifique se o URI está EXATAMENTE assim: `https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback`
3. Sem espaços, sem barra extra no final
4. Aguarde 5 minutos após salvar (propagação)

### **Erro: "invalid_client"**
**Causa**: Client ID ou Secret incorretos

**Solução**:
1. Verifique se copiou corretamente do Google Cloud
2. Recrie as credenciais se necessário
3. Atualize no Supabase Dashboard

### **Erro: "access_denied"**
**Causa**: OAuth consent screen não publicado ou domínio não autorizado

**Solução**:
1. No OAuth consent screen, clique em "PUBLISH APP"
2. Adicione `supabase.co` nos Authorized domains

### **Erro: "popup_closed_by_user"**
**Causa**: Popup bloqueado ou fechado pelo usuário

**Solução**:
1. Desabilite bloqueadores de popup
2. Tente em modo incógnito
3. Use redirect ao invés de popup (padrão do Supabase)

---

## 📋 Informações do Projeto

**Supabase Project URL**: `https://dxdbpppymxfiojszrmir.supabase.co`
**Callback URL**: `https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback`
**App URL (dev)**: `http://localhost:3000`
**App URL (prod)**: `https://moncoyfinance.com`

---

## 🎯 Próximos Passos

Após corrigir o OAuth:

1. ✅ Testar login completo (dev e prod)
2. ✅ Configurar logo no OAuth consent screen
3. ✅ Adicionar políticas de privacidade
4. ✅ Adicionar termos de serviço
5. ✅ Configurar domínio personalizado (opcional)
6. ✅ Publicar o app no Google (sair do modo teste)

---

## 📞 Suporte

Se ainda tiver problemas:
1. Verifique os logs do Supabase Dashboard em **Logs** → **Auth Logs**
2. Verifique o console do navegador (F12) → Network tab
3. Consulte: https://supabase.com/docs/guides/auth/social-login/auth-google

---

**Última atualização**: 20 de outubro de 2025
