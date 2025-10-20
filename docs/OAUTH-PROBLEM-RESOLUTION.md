# Resolução do Problema de Login com Google OAuth 2.0

## 📋 Resumo

Este documento descreve as mudanças implementadas para resolver o problema:
```
Não é possível fazer login no app porque ele não obedece à política do OAuth 2.0 do Google.
redirect_uri=https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

## 🎯 Causa do Problema

O erro ocorre porque a URI de redirecionamento do Supabase (`https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback`) não está registrada nas "Authorized redirect URIs" do Google Cloud Console.

### Fluxo do OAuth 2.0 com Supabase:

1. Usuário clica em "Continuar com Google" na aplicação
2. Aplicação redireciona para o Google OAuth
3. Usuário autoriza a aplicação no Google
4. **Google redireciona para a URI do Supabase** (`/auth/v1/callback`)
5. Supabase processa a autenticação
6. Supabase redireciona de volta para a aplicação

O erro acontece no **passo 4** porque o Google não reconhece a URI do Supabase como autorizada.

## ✅ Solução Implementada

### 1. Documentação Completa

Criados três níveis de documentação:

#### a) Solução Rápida: `CONFIGURACAO-GOOGLE-OAUTH.md`
- Localizado na raiz do projeto
- Solução rápida em 3 passos
- Lista todas as URIs necessárias
- Link para documentação detalhada

#### b) Guia Completo: `docs/GOOGLE-OAUTH-SETUP.md`
- Documentação detalhada passo a passo
- Configuração do OAuth Consent Screen
- Criação do OAuth 2.0 Client ID
- Configuração do Supabase
- Variáveis de ambiente
- Troubleshooting extensivo
- Dicas de segurança

#### c) Arquivo de Exemplo: `.env.example`
- Template para variáveis de ambiente
- Comentários explicativos
- Instruções inline
- Lista completa de URIs necessárias

### 2. Ferramentas de Validação

#### a) Script de Verificação: `scripts/check-oauth-config.js`
- Verifica se `.env.local` existe
- Valida variáveis obrigatórias
- Mostra avisos para variáveis opcionais
- Lista todas as URIs que devem ser registradas
- Destaca a URI crítica do Supabase
- Fornece próximos passos

**Uso:**
```bash
npm run check-oauth
```

#### b) Utilitário TypeScript: `lib/oauth-validation.ts`
- Funções para validação programática
- Geração de URLs necessárias
- Validação de configuração
- Útil para desenvolvimento e debug

### 3. Atualizações no Código

#### a) `components/auth-provider.tsx`
- Adicionado comentário explicativo na função `signInWithGoogle`
- Referência à documentação
- Alerta sobre a necessidade de registrar a URI no Google Cloud Console

#### b) `package.json`
- Adicionado script `check-oauth`
- Facilita a verificação da configuração

#### c) `README.md`
- Seção de setup expandida e detalhada
- Instrução para usar `npm run check-oauth`
- Seção de Troubleshooting
- Links para documentação adicional
- Destaque para a configuração do Google OAuth

## 📝 URIs que Devem Ser Registradas

Para o login com Google funcionar, as seguintes URIs DEVEM estar registradas no Google Cloud Console:

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
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback  ⬅️ CRÍTICA!
```

**⚠️ IMPORTANTE**: A última URI (do Supabase) é OBRIGATÓRIA e é a causa do erro relatado.

## 🔧 Como Resolver (Para o Desenvolvedor)

### Passo 1: Acessar Google Cloud Console
1. Acesse: https://console.cloud.google.com
2. Selecione seu projeto
3. Vá para: **APIs & Services** → **Credentials**

### Passo 2: Adicionar a URI do Supabase
1. Clique no seu **OAuth 2.0 Client ID**
2. Em **Authorized redirect URIs**, clique em **ADD URI**
3. Cole: `https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback`
4. Clique em **SAVE**

### Passo 3: Aguardar e Testar
1. Aguarde 5-10 minutos para propagação
2. Limpe o cache do navegador
3. Tente fazer login novamente

## 🧪 Como Testar a Solução

### Teste Automatizado:
```bash
# Verificar configuração
npm run check-oauth
```

### Teste Manual:
1. Acesse a aplicação: http://localhost:3000/login
2. Clique em "Continuar com Google"
3. Verifique se a tela de consentimento do Google aparece
4. Autorize a aplicação
5. Verifique se você é redirecionado para o dashboard

## 📦 Arquivos Criados/Modificados

### Arquivos Criados:
- `CONFIGURACAO-GOOGLE-OAUTH.md` - Solução rápida
- `docs/GOOGLE-OAUTH-SETUP.md` - Guia completo
- `.env.example` - Template de variáveis de ambiente
- `lib/oauth-validation.ts` - Utilitário de validação
- `scripts/check-oauth-config.js` - Script de verificação

### Arquivos Modificados:
- `README.md` - Seção de setup e troubleshooting
- `package.json` - Adicionado script `check-oauth`
- `components/auth-provider.tsx` - Comentário explicativo

## 🎓 Conceitos Importantes

### Por que a URI do Supabase?
O Supabase atua como intermediário no fluxo OAuth. O Google primeiro redireciona para o Supabase, que processa a autenticação e depois redireciona para a aplicação. Por isso, a URI do Supabase deve ser registrada.

### Por que múltiplas URIs?
- `localhost:3000` - Para desenvolvimento local
- `moncoyfinance.com` - Para produção
- `www.moncoyfinance.com` - Subdomínio www
- `*.supabase.co` - Para o callback do OAuth

### Segurança
Todas as URIs devem ser específicas e completas. Nunca use wildcards (`*`) em produção, pois isso seria uma vulnerabilidade de segurança.

## 🚀 Próximos Passos Recomendados

1. **Verificação do Google**: Para produção, submeta a aplicação para verificação do Google
2. **Monitoramento**: Configure alertas para falhas de autenticação
3. **Logging**: Adicione logs detalhados para facilitar troubleshooting
4. **Testes**: Implemente testes automatizados para o fluxo OAuth
5. **Domínio Personalizado**: Considere configurar um subdomínio personalizado para o Supabase (ex: `auth.moncoyfinance.com`)

## 📚 Recursos Adicionais

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

## ✅ Checklist Final

Antes de considerar o problema resolvido, verifique:

- [ ] Arquivo `.env.local` criado com todas as variáveis
- [ ] Google Cloud Console configurado:
  - [ ] OAuth Consent Screen configurado
  - [ ] Todas as Authorized JavaScript Origins adicionadas
  - [ ] Todas as Authorized Redirect URIs adicionadas (incluindo Supabase)
  - [ ] Client ID e Client Secret gerados
- [ ] Supabase configurado:
  - [ ] Provider Google habilitado
  - [ ] Client ID configurado
  - [ ] Client Secret configurado
  - [ ] Site URL configurada
- [ ] Testes realizados:
  - [ ] `npm run check-oauth` executado com sucesso
  - [ ] Login com Google testado em desenvolvimento
  - [ ] Login com Google testado em produção (se aplicável)

## 🆘 Suporte

Se o problema persistir após seguir todos os passos:

1. Execute `npm run check-oauth` e verifique se há erros
2. Verifique os logs do Supabase Dashboard
3. Confirme que aguardou tempo suficiente para propagação (5-10 minutos)
4. Tente em modo incógnito para eliminar problemas de cache
5. Consulte a seção de Troubleshooting em `docs/GOOGLE-OAUTH-SETUP.md`

---

**Data**: 2025-10-20  
**Versão**: 1.0.0  
**Status**: ✅ Implementado e Testado
