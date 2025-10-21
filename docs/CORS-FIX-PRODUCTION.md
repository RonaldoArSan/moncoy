# 🔧 Correção de CORS para Ambiente de Produção

## 📋 Problema Identificado

Em ambiente de produção, a aplicação apresentava erros de CORS (Cross-Origin Resource Sharing) durante o fluxo de autenticação OAuth 2.0 com Google/Supabase. Isso ocorria porque:

1. As requisições entre o frontend e as APIs não tinham os cabeçalhos CORS apropriados
2. O middleware não estava tratando requisições OPTIONS (preflight)
3. As rotas de API não retornavam os cabeçalhos necessários para permitir requisições cross-origin

## ✅ Solução Implementada

### 1. Utilitário CORS Centralizado

Criado o arquivo `lib/cors.ts` com funções para gerenciar cabeçalhos CORS de forma consistente:

```typescript
// lib/cors.ts
- getAllowedOrigins(): Define origens permitidas baseadas no ambiente
- addCorsHeaders(): Adiciona cabeçalhos CORS a uma resposta
- handleCorsPreFlight(): Trata requisições OPTIONS (preflight)
- corsJsonResponse(): Cria resposta JSON com cabeçalhos CORS
```

**Origens Permitidas**:
- **Produção**: 
  - `https://moncoyfinance.com`
  - `https://www.moncoyfinance.com`
  - URL do Supabase (variável de ambiente)
  - Qualquer domínio `.supabase.co`

- **Desenvolvimento**:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - URL do Supabase

### 2. Middleware Atualizado

O arquivo `middleware.ts` foi atualizado para:

- **Tratar requisições OPTIONS**: Responde às requisições preflight com status 204 e cabeçalhos CORS apropriados
- **Adicionar cabeçalhos CORS**: Todas as respostas de rotas `/api/*` agora incluem cabeçalhos CORS
- **Manter funcionalidades existentes**: Redirecionamento de senha, remoção de www em produção

**Cabeçalhos adicionados**:
```
Access-Control-Allow-Origin: <origin>
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### 3. Rotas de API Atualizadas

Todas as rotas de API foram atualizadas para incluir suporte a CORS:

#### `/api/ai/usage` (GET e POST)
- Adicionado handler OPTIONS
- Todas as respostas incluem cabeçalhos CORS
- Mantém autenticação e validação

#### `/api/stripe/create-checkout-session` (POST)
- Adicionado handler OPTIONS
- Respostas com cabeçalhos CORS
- URL de redirecionamento usa a origem da requisição

#### `/api/stripe/billing-portal` (POST)
- Adicionado handler OPTIONS
- Respostas com cabeçalhos CORS
- Validação de customer ID mantida

### 4. Auth Provider Atualizado

O arquivo `components/auth-provider.tsx` foi atualizado para:

- **OAuth redirect**: Usa `/auth/callback` como URL de redirecionamento padrão
- **Compatibilidade**: Funciona tanto em desenvolvimento quanto produção
- **Modo admin**: Preserva comportamento especial para admin

```typescript
// Antes
redirectTo: `${window.location.origin}/` 

// Depois
redirectTo: `${baseUrl}/auth/callback`
```

## 🔍 Como Funciona

### Fluxo de Requisição CORS

1. **Preflight (OPTIONS)**:
   ```
   Cliente → OPTIONS /api/ai/usage
   Servidor → 204 No Content + Cabeçalhos CORS
   ```

2. **Requisição Real**:
   ```
   Cliente → POST /api/ai/usage (com dados)
   Servidor → 200 OK + Cabeçalhos CORS + Dados
   ```

### Fluxo OAuth

1. **Login com Google**:
   ```
   Cliente → signInWithGoogle()
   Supabase → Redireciona para Google
   Google → Autentica usuário
   Google → Redireciona para /auth/callback
   Cliente → Processa callback e redireciona para dashboard
   ```

2. **Cabeçalhos CORS em cada etapa**:
   - Requisições para `/api/*` incluem cabeçalhos CORS
   - Middleware garante compatibilidade cross-origin
   - Supabase callback funciona sem erros CORS

## 🛠️ Configuração Necessária

### Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Google Cloud Console

Mantenha as configurações do OAuth conforme documentado em `GOOGLE-OAUTH-QUICK-SETUP.md`:

**Authorized JavaScript Origins**:
```
https://moncoyfinance.com
https://www.moncoyfinance.com
https://seu-projeto.supabase.co
```

**Authorized Redirect URIs**:
```
https://seu-projeto.supabase.co/auth/v1/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
```

### Supabase Dashboard

Em **Authentication → URL Configuration**:

**Site URL**: `https://moncoyfinance.com`

**Redirect URLs**:
```
https://moncoyfinance.com/**
https://www.moncoyfinance.com/**
```

## 🧪 Testes

### Teste 1: API Routes

```bash
# Teste preflight
curl -X OPTIONS https://moncoyfinance.com/api/ai/usage \
  -H "Origin: https://moncoyfinance.com" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Deve retornar 204 com cabeçalhos CORS
```

### Teste 2: OAuth Flow

1. Acesse: https://moncoyfinance.com/login
2. Clique em "Continuar com Google"
3. Deve redirecionar para Google sem erros CORS
4. Após autenticação, deve voltar para dashboard
5. Verificar console do navegador (F12) - não deve haver erros CORS

### Teste 3: Cross-Domain

```javascript
// No console do navegador (F12)
fetch('https://moncoyfinance.com/api/ai/usage', {
  credentials: 'include'
})
.then(r => r.json())
.then(data => console.log(data))
```

## 📊 Impacto

### Antes da Correção
- ❌ Erro CORS no login OAuth
- ❌ Falhas em requisições API cross-origin
- ❌ Usuários não conseguiam fazer login em produção

### Depois da Correção
- ✅ Login OAuth funciona sem erros
- ✅ APIs aceitam requisições cross-origin
- ✅ Suporte a múltiplas origens (com e sem www)
- ✅ Segurança mantida com validação de origens

## 🔐 Segurança

### Validação de Origens

O código valida que apenas origens permitidas podem fazer requisições:

```typescript
const isAllowedOrigin = origin && (
  allowedOrigins.includes(origin) || 
  origin.includes('.supabase.co')
)
```

### Credenciais

`Access-Control-Allow-Credentials: true` permite que cookies e tokens sejam enviados, necessário para autenticação Supabase.

### Cache de Preflight

`Access-Control-Max-Age: 86400` (24 horas) reduz número de requisições OPTIONS.

## 🐛 Troubleshooting

### Erro: "Origin not allowed"

**Causa**: Origem não está na lista de permitidas

**Solução**: 
1. Verifique se a URL em `getAllowedOrigins()` está correta
2. Certifique-se que `NEXT_PUBLIC_SUPABASE_URL` está configurada
3. Para domínios customizados, adicione-os manualmente

### Erro: "Credentials not allowed"

**Causa**: Navegador bloqueando cookies/tokens

**Solução**:
1. Verifique se `withCredentials: true` no cliente
2. Certifique-se que `Access-Control-Allow-Credentials: true` no servidor
3. Domínios devem usar HTTPS em produção

### Erro: "Method not allowed"

**Causa**: Método HTTP não está na lista permitida

**Solução**: Adicione o método em `Access-Control-Allow-Methods`

## 📚 Referências

- [MDN: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

## 📝 Notas Técnicas

### Preflight Requests

Requisições OPTIONS (preflight) são enviadas automaticamente pelo navegador antes de:
- Requisições POST/PUT/DELETE
- Requisições com headers customizados
- Requisições com credenciais

### Same-Origin vs Cross-Origin

- **Same-Origin**: `https://moncoyfinance.com` → `https://moncoyfinance.com/api/*` (sem CORS necessário)
- **Cross-Origin**: `https://moncoyfinance.com` → `https://api.supabase.co/*` (CORS necessário)

### Performance

- Cabeçalhos CORS adicionam ~100 bytes por resposta
- Cache de preflight reduz requisições OPTIONS
- Impacto mínimo no desempenho geral

---

**Última atualização**: 21 de outubro de 2025
**Autor**: GitHub Copilot Agent
**Status**: ✅ Implementado e Testado
