# 📚 Índice da Documentação do Google OAuth 2.0

## 🎯 Para Começar Rapidamente

**Se você está com o erro de "redirect_uri" e precisa resolver agora:**

👉 **[CONFIGURACAO-GOOGLE-OAUTH.md](../CONFIGURACAO-GOOGLE-OAUTH.md)** ⚡ 

Solução em 3 passos simples!

---

## 📖 Documentação Completa

### 1. Guias de Setup

#### 🚀 [Quick Reference](./QUICK-REFERENCE-OAUTH.md)
- Solução ultra-rápida
- URIs para copy-paste
- Comandos essenciais
- Troubleshooting básico

**Quando usar**: Você já configurou antes e só precisa de referência rápida.

---

#### 📋 [Configuração Rápida](../CONFIGURACAO-GOOGLE-OAUTH.md)
- Solução do erro em 3 passos
- Lista completa de URIs
- Links para documentação detalhada

**Quando usar**: Você tem o erro e precisa resolver agora.

---

#### 📚 [Guia Completo](./GOOGLE-OAUTH-SETUP.md)
- Configuração passo a passo detalhada
- OAuth Consent Screen
- Criação do Client ID
- Configuração do Supabase
- Variáveis de ambiente
- Troubleshooting extensivo
- Dicas de segurança

**Quando usar**: Primeira configuração ou precisa entender todos os detalhes.

---

### 2. Entendimento Técnico

#### 🔄 [Diagrama de Fluxo OAuth](./OAUTH-FLOW-DIAGRAM.md)
- Diagrama visual do fluxo completo
- Explicação de cada etapa
- Onde ocorre o erro
- Por que a URI do Supabase é crítica
- Debug passo a passo

**Quando usar**: Quer entender como o OAuth funciona ou debugar problemas.

---

#### 🔧 [Resolução do Problema](./OAUTH-PROBLEM-RESOLUTION.md)
- Análise completa do problema
- Causa raiz do erro
- Solução implementada
- Arquivos criados/modificados
- Conceitos importantes
- Checklist final

**Quando usar**: Quer entender o que foi feito para resolver o problema.

---

### 3. Documentação Existente (Referência)

#### 🎨 [Customização do Google Auth](./GOOGLE_AUTH_CUSTOMIZATION.md)
- Personalização da tela de login
- Branding do OAuth
- Logo e cores
- Domínio personalizado

**Quando usar**: OAuth funcionando e quer melhorar a aparência.

---

## 🛠️ Ferramentas

### Script de Validação
```bash
npm run check-oauth
```

**O que faz**:
- Verifica se `.env.local` existe
- Valida variáveis obrigatórias
- Lista todas as URIs necessárias
- Destaca a URI crítica do Supabase
- Fornece próximos passos

**Arquivo**: `scripts/check-oauth-config.js`

### Utilitário TypeScript
```typescript
import { validateGoogleOAuthConfig, getRequiredGoogleOAuthUrls } from '@/lib/oauth-validation'
```

**O que faz**:
- Validação programática
- Geração de URLs
- Helper functions para desenvolvimento

**Arquivo**: `lib/oauth-validation.ts`

---

## 🎯 Fluxo de Resolução Recomendado

### Situação 1: Erro de redirect_uri
```
1. Leia: CONFIGURACAO-GOOGLE-OAUTH.md (3 min)
2. Execute: npm run check-oauth (1 min)
3. Configure: Google Cloud Console (5 min)
4. Aguarde: 10 minutos para propagação
5. Teste: Login com Google
```

### Situação 2: Primeira Configuração
```
1. Leia: GOOGLE-OAUTH-SETUP.md (15 min)
2. Configure: .env.local (5 min)
3. Execute: npm run check-oauth (1 min)
4. Configure: Google Cloud Console (15 min)
5. Configure: Supabase (5 min)
6. Teste: Login com Google
```

### Situação 3: Entender o Sistema
```
1. Leia: OAUTH-FLOW-DIAGRAM.md (10 min)
2. Leia: OAUTH-PROBLEM-RESOLUTION.md (10 min)
3. Explore: Código em components/auth-provider.tsx
4. Teste: Diferentes cenários
```

---

## 📝 Templates e Exemplos

### Template .env.local
Arquivo: `.env.example`

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### URIs Completas (Copy-Paste)

**Authorized JavaScript Origins:**
```
http://localhost:3000
https://moncoyfinance.com
https://www.moncoyfinance.com
```

**Authorized Redirect URIs:**
```
http://localhost:3000/auth/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

---

## 🆘 Troubleshooting por Tipo de Erro

### Erro: "redirect_uri_mismatch"
📖 Leia: [CONFIGURACAO-GOOGLE-OAUTH.md](../CONFIGURACAO-GOOGLE-OAUTH.md)  
🔧 Solução: Adicionar URI do Supabase no Google Cloud Console

### Erro: "Access blocked: Authorization Error"
📖 Leia: [GOOGLE-OAUTH-SETUP.md](./GOOGLE-OAUTH-SETUP.md) - Seção OAuth Consent Screen  
🔧 Solução: Adicionar email como Test User ou verificar scopes

### Erro: "invalid_request"
📖 Leia: [OAUTH-FLOW-DIAGRAM.md](./OAUTH-FLOW-DIAGRAM.md) - Seção Debug  
🔧 Solução: Verificar Client ID/Secret no Supabase

### Funciona local, mas não em produção
📖 Leia: [GOOGLE-OAUTH-SETUP.md](./GOOGLE-OAUTH-SETUP.md) - Passo 3  
🔧 Solução: Adicionar URIs de produção no Google Cloud Console

---

## 🔍 Busca Rápida

| Preciso de... | Documento | Seção |
|--------------|-----------|--------|
| **Resolver erro agora** | [CONFIGURACAO-GOOGLE-OAUTH.md](../CONFIGURACAO-GOOGLE-OAUTH.md) | Solução Rápida |
| **Lista de URIs** | [QUICK-REFERENCE-OAUTH.md](./QUICK-REFERENCE-OAUTH.md) | Copy-Paste Ready |
| **Configurar do zero** | [GOOGLE-OAUTH-SETUP.md](./GOOGLE-OAUTH-SETUP.md) | Todo o guia |
| **Entender o fluxo** | [OAUTH-FLOW-DIAGRAM.md](./OAUTH-FLOW-DIAGRAM.md) | Diagrama |
| **Verificar config** | Terminal | `npm run check-oauth` |
| **Debug de erro** | [OAUTH-FLOW-DIAGRAM.md](./OAUTH-FLOW-DIAGRAM.md) | Seção Debug |
| **Template .env** | `.env.example` | Raiz do projeto |
| **Customização** | [GOOGLE_AUTH_CUSTOMIZATION.md](./GOOGLE_AUTH_CUSTOMIZATION.md) | Todo o guia |

---

## 📊 Arquivos Relacionados

### Documentação
```
├── CONFIGURACAO-GOOGLE-OAUTH.md        (Solução rápida - raiz)
├── .env.example                         (Template - raiz)
└── docs/
    ├── GOOGLE-OAUTH-SETUP.md           (Guia completo)
    ├── OAUTH-FLOW-DIAGRAM.md           (Diagrama de fluxo)
    ├── OAUTH-PROBLEM-RESOLUTION.md     (Análise da resolução)
    ├── QUICK-REFERENCE-OAUTH.md        (Referência rápida)
    ├── GOOGLE_AUTH_CUSTOMIZATION.md    (Customização)
    └── README-INDEX-OAUTH.md           (Este arquivo)
```

### Código
```
├── components/auth-provider.tsx        (Implementação do OAuth)
├── app/auth/callback/page.tsx          (Callback handler)
├── app/login/page.tsx                  (Login UI)
└── lib/
    ├── oauth-validation.ts             (Utilitários de validação)
    └── supabase/
        ├── client.ts                   (Cliente Supabase)
        └── server.ts                   (Servidor Supabase)
```

### Scripts
```
└── scripts/
    └── check-oauth-config.js           (npm run check-oauth)
```

---

## ✅ Checklist Completo

Antes de considerar a configuração completa:

- [ ] **Google Cloud Console**
  - [ ] Projeto criado/selecionado
  - [ ] OAuth Consent Screen configurado
  - [ ] Application name = "MoncoyFinance"
  - [ ] Authorized domains incluem moncoyfinance.com e supabase.co
  - [ ] Scopes configurados (email, profile, openid)
  - [ ] OAuth 2.0 Client ID criado
  - [ ] Todas as JavaScript Origins adicionadas (3 URIs)
  - [ ] Todas as Redirect URIs adicionadas (4 URIs)
  - [ ] URI do Supabase incluída
  - [ ] Client ID e Secret copiados

- [ ] **Supabase Dashboard**
  - [ ] Provider Google habilitado
  - [ ] Client ID configurado
  - [ ] Client Secret configurado
  - [ ] Site URL = https://moncoyfinance.com
  - [ ] Redirect URLs configuradas

- [ ] **Aplicação**
  - [ ] Arquivo `.env.local` criado
  - [ ] Todas as variáveis configuradas
  - [ ] `npm run check-oauth` executado com sucesso
  - [ ] Servidor reiniciado

- [ ] **Testes**
  - [ ] Login testado em desenvolvimento
  - [ ] Login testado em modo incógnito
  - [ ] Login testado em produção (se aplicável)
  - [ ] Sem erros no console do navegador

---

## 🎓 Links Externos

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com)

---

**Última atualização**: 2025-10-20  
**Versão**: 1.0.0  
**Mantenedor**: MoncoyFinance Dev Team
