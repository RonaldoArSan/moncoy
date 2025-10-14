# 🎨 Personalizar Tela de Login do Google - MoncoyFinance

Este guia mostra como personalizar a tela de autenticação do Google para exibir "MoncoyFinance" ao invés do nome técnico do Supabase.

## 🎯 Problema Atual

Quando o usuário faz login com Google, aparece:
- ❌ "Prosseguir para dxdbpppymxfiojszrmir.supabase.co"
- ❌ "Fazer login no serviço dxdbpppymxfiojszrmir"

**Queremos que apareça:**
- ✅ "Prosseguir para MoncoyFinance"
- ✅ "Fazer login no MoncoyFinance"

## 🔧 Solução Completa

### **Passo 1: Configurar no Google Cloud Console**

1. **Acesse o Google Cloud Console**:
   ```
   https://console.cloud.google.com
   ```

2. **Vá para APIs & Services → OAuth consent screen**:
   - **Application name**: `MoncoyFinance`
   - **User support email**: `support@moncoyfinance.com`
   - **Application logo**: Upload logo da aplicação (120x120px recomendado)
   - **Application home page**: `https://moncoyfinance.com`
   - **Application privacy policy**: `https://moncoyfinance.com/privacy`
   - **Application terms of service**: `https://moncoyfinance.com/terms`
   - **Authorized domains**: 
     - `moncoyfinance.com`
     - `localhost` (para desenvolvimento)

3. **Vá para APIs & Services → Credentials**:
   - Clique na sua **OAuth 2.0 Client ID**
   - **Name**: `MoncoyFinance Web Client`
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     https://moncoyfinance.com
     https://www.moncoyfinance.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/auth/callback
     https://moncoyfinance.com/auth/callback
     https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
     ```

### **Passo 2: Configurar no Supabase Dashboard**

1. **Acesse Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir
   ```

2. **Authentication → Settings → General**:
   - **Site URL**: `https://moncoyfinance.com`
   - **Additional Redirect URLs**:
     ```
     http://localhost:3000/**
     https://moncoyfinance.com/**
     https://www.moncoyfinance.com/**
     ```

3. **Authentication → Providers → Google**:
   - **Enable Google provider**: ✅ Enabled
   - **Client ID**: [Seu Google Client ID]
   - **Client Secret**: [Seu Google Client Secret]
   - **Redirect URL**: `https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback`

### **Passo 3: Configurar Domínio Personalizado (Opcional)**

Para uma experiência ainda melhor, configure um subdomínio para o Supabase:

1. **No Supabase Dashboard**:
   - Vá para **Settings** → **Custom Domains**
   - Configure: `auth.moncoyfinance.com`

2. **Configure DNS**:
   ```
   CNAME auth dxdbpppymxfiojszrmir.supabase.co
   ```

3. **Atualize as configurações**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://auth.moncoyfinance.com
   ```

### **Passo 4: Adicionar Variáveis de Ambiente**

Adicione no `.env.local`:

```env
# Google OAuth Customization
NEXT_PUBLIC_GOOGLE_HD=moncoyfinance.com  # Domain hint (opcional)
NEXT_PUBLIC_APP_NAME=MoncoyFinance
NEXT_PUBLIC_APP_DOMAIN=moncoyfinance.com
```

### **Passo 5: Atualizar Metadados da Aplicação**

Vou atualizar o `layout.tsx` para ter metadados consistentes:

```tsx
export const metadata = {
  title: 'MoncoyFinance - Gestão Financeira Inteligente',
  description: 'Plataforma completa de gestão financeira pessoal e empresarial',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'MoncoyFinance',
    description: 'Gestão Financeira Inteligente',
    url: 'https://moncoyfinance.com',
    siteName: 'MoncoyFinance',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}
```

## 🎨 Melhorias Visuais Adicionais

### **1. Logo e Branding**

Certifique-se de ter:
- **Logo principal**: 512x512px (para Google OAuth)
- **Favicon**: 32x32px
- **Apple Touch Icon**: 180x180px
- **Open Graph Image**: 1200x630px

### **2. Cores e Temas Consistentes**

```css
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --brand-name: 'MoncoyFinance';
}
```

## 🧪 Testar as Mudanças

1. **Limpe o cache do navegador**
2. **Teste em modo incógnito**
3. **Faça logout completo e tente novamente**
4. **Verifique se o nome "MoncoyFinance" aparece nas telas do Google**

## 🔍 Verificação de Configuração

Execute este checklist:

- [ ] Google Cloud Console configurado com nome "MoncoyFinance"
- [ ] Logo carregado no OAuth consent screen
- [ ] Domínios autorizados configurados
- [ ] Redirect URIs corretas
- [ ] Supabase Site URL configurada
- [ ] Variáveis de ambiente atualizadas
- [ ] Cache do navegador limpo
- [ ] Teste realizado em modo incógnito

## ⚠️ Notas Importantes

1. **Propagação**: Mudanças no Google podem levar até 24h para propagar
2. **Cache**: Limpe sempre o cache após mudanças
3. **Domínio**: Se usar domínio personalizado, configure SSL corretamente
4. **Testes**: Sempre teste em produção e desenvolvimento

## 🚀 Resultado Esperado

Após as configurações, o usuário verá:
- ✅ "Prosseguir para MoncoyFinance"
- ✅ "Fazer login no MoncoyFinance"
- ✅ Logo da aplicação na tela de consentimento
- ✅ Informações consistentes da marca

---

**💡 Dica**: Se as mudanças não aparecerem imediatamente, aguarde algumas horas ou teste em outro navegador/dispositivo.