# 🔧 CORREÇÃO: Erro "No such price: 'price_TESTE'"

## ❌ Problema Original

Ao clicar em "Assinar" na landing page ou tentar fazer upgrade de plano, você recebia o erro:

```
No such price: 'price_TESTE'
at redirectToStripeCheckout (lib/stripe-config.ts:41:13)
```

## 🔍 Causa

O código estava usando `'price_TESTE'` como valor padrão quando as variáveis de ambiente não estavam configuradas. Este ID não existe no Stripe, causando a falha na criação da sessão de checkout.

## ✅ Solução Implementada

### 1. Validação Melhorada
Agora o sistema valida a configuração ANTES de tentar criar uma sessão no Stripe, mostrando mensagens de erro claras e acionáveis.

### 2. Mensagens de Erro Úteis
Em vez de um erro genérico do Stripe, você verá instruções detalhadas sobre como configurar:

```
❌ Configuração incompleta: Price IDs do Stripe não estão configurados.

🛠️ Você precisa criar os produtos no Stripe primeiro:

Opção 1 - Via Script (Recomendado):
  1. Configure STRIPE_SECRET_KEY no .env.local
  2. Execute: node scripts/create-stripe-products.js
  3. Copie os Price IDs gerados para o .env.local

Opção 2 - Manual no Dashboard:
  1. Acesse: https://dashboard.stripe.com/test/products
  2. Crie os 3 produtos (Básico R$19,90, Pro R$49,90, Premium R$59,90)
  3. Copie os Price IDs (começam com price_)
  4. Adicione no .env.local:
     STRIPE_PRICE_BASIC=price_...
     STRIPE_PRICE_PRO=price_...
     STRIPE_PRICE_PREMIUM=price_...
```

### 3. Documentação Completa
- Arquivo `.env.example` criado com template completo
- README.md atualizado com instruções passo a passo
- Script `create-stripe-products.js` melhorado para facilitar setup

## 📋 Como Configurar (Guia Rápido)

### Passo 1: Copie o template
```bash
cp .env.example .env.local
```

### Passo 2: Obtenha as chaves do Stripe
1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie:
   - **Publishable Key** (começa com `pk_test_`)
   - **Secret Key** (começa com `sk_test_`)

### Passo 3: Adicione as chaves no .env.local
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
```

### Passo 4: Crie os produtos (escolha uma opção)

**Opção A - Automático (Recomendado):**
```bash
node scripts/create-stripe-products.js
```

**Opção B - Manual:**
1. Acesse: https://dashboard.stripe.com/test/products
2. Crie 3 produtos:
   - Básico: R$ 19,90/mês
   - Pro: R$ 49,90/mês
   - Premium: R$ 59,90/mês
3. Copie os Price IDs

### Passo 5: Adicione os Price IDs no .env.local
```env
STRIPE_PRICE_BASIC=price_XXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_PRO=price_XXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_PREMIUM=price_XXXXXXXXXXXXXXXXXXXXX
```

### Passo 6: Reinicie o servidor
```bash
npm run dev
```

### Passo 7: Teste!
1. Acesse: http://localhost:3000/landingpage
2. Clique em "Assinar"
3. Deve redirecionar para o Stripe Checkout ✅

## 🧪 Testando Pagamentos

Use os cartões de teste do Stripe:
- **Cartão de sucesso**: `4242 4242 4242 4242`
- **CVC**: Qualquer 3 dígitos
- **Data**: Qualquer data futura

Mais cartões: https://stripe.com/docs/testing#cards

## 📚 Documentação Adicional

- [README.md](./README.md) - Guia completo de setup
- [STRIPE-SETUP.md](./STRIPE-SETUP.md) - Configuração detalhada do Stripe
- [CRIAR-PRODUTOS-STRIPE.md](./CRIAR-PRODUTOS-STRIPE.md) - Guia rápido de produtos
- [.env.example](./.env.example) - Template de variáveis de ambiente

## ⚠️ Importante

- **Nunca** commite o arquivo `.env.local` (já está no `.gitignore`)
- Use chaves de **TESTE** (`pk_test_` e `sk_test_`) para desenvolvimento
- Para produção, use chaves **LIVE** (`pk_live_` e `sk_live_`)

## ✨ Benefícios da Correção

1. **Erros Claros**: Mensagens de erro em português com instruções práticas
2. **Detecção Antecipada**: Validação no cliente antes de chamar a API
3. **Documentação**: Guias completos para setup rápido
4. **Melhor UX**: Desenvolvedores sabem exatamente o que fazer
5. **Sem Surpresas**: Sistema não tenta usar IDs inválidos

---

**Data da Correção**: 2025-10-24  
**Autor**: GitHub Copilot Agent
