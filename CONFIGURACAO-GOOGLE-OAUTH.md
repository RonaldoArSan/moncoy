# 🔐 SOLUÇÃO: Erro de Login com Google OAuth 2.0

## ❌ Erro Atual

```
Não é possível fazer login no app porque ele não obedece à política do OAuth 2.0 do Google.

Se você é o desenvolvedor do app, registre o URI de redirecionamento no Console do Google Cloud.
Detalhes da solicitação: redirect_uri=https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

## ✅ Solução Rápida

O problema ocorre porque a URI de redirecionamento do Supabase não está registrada no Google Cloud Console.

### Passo 1: Acessar Google Cloud Console

1. Acesse: https://console.cloud.google.com
2. Selecione seu projeto

### Passo 2: Adicionar URI de Redirecionamento

1. Vá para: **APIs & Services** → **Credentials**
2. Clique no seu **OAuth 2.0 Client ID**
3. Em **Authorized redirect URIs**, adicione:

```
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

4. Clique em **Save**

### Passo 3: Aguardar Propagação

- Aguarde 5-10 minutos para as mudanças propagarem
- Limpe o cache do navegador ou use modo incógnito
- Tente fazer login novamente

## 📖 Documentação Completa

Para instruções detalhadas e configuração completa, consulte:

👉 **[docs/GOOGLE-OAUTH-SETUP.md](docs/GOOGLE-OAUTH-SETUP.md)**

Este documento inclui:
- Configuração completa do OAuth consent screen
- Todas as URIs necessárias (desenvolvimento e produção)
- Configuração do Supabase
- Variáveis de ambiente
- Troubleshooting detalhado
- Customizações de branding

## 🎯 URIs Necessárias

Para funcionamento completo em desenvolvimento e produção, adicione todas as URIs abaixo:

### Authorized JavaScript Origins:
```
http://localhost:3000
https://moncoyfinance.com
https://www.moncoyfinance.com
```

### Authorized Redirect URIs:
```
http://localhost:3000/auth/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

## 🆘 Precisa de Ajuda?

Se o problema persistir após seguir estes passos:

1. Verifique os logs do Supabase Dashboard
2. Confirme que o Client ID e Client Secret estão corretos no Supabase
3. Verifique se o Google Provider está habilitado no Supabase
4. Consulte a documentação completa em `docs/GOOGLE-OAUTH-SETUP.md`

---

**Nota**: Este é um problema de configuração do Google Cloud Console, não um bug no código. O código está correto e funcionará assim que a URI for registrada.
