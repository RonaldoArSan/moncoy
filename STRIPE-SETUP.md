# 🔑 Configuração das Chaves do Stripe

## ❌ Erro Atual

Se você está vendo o erro **"STRIPE_SECRET_KEY não está configurada"**, siga os passos abaixo:

## ✅ Solução Rápida

### 1. Obter suas chaves do Stripe

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Faça login na sua conta Stripe
3. Copie as duas chaves:
   - **Publishable key** (começa com `pk_test_...`)
   - **Secret key** (começa com `sk_test_...`) - **CLIQUE EM "Reveal test key"**

### 2. Adicionar no arquivo `.env.local`

Abra o arquivo `.env.local` na raiz do projeto e adicione:

```env
# Stripe - Chaves de TESTE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_AQUI
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_SECRETA_AQUI

# Stripe - IDs dos Preços (Price IDs)
STRIPE_PRICE_BASIC=price_1S0mqhLhhuHU7ecWyUZSdXQG
STRIPE_PRICE_PRO=price_1S0mqhLhhuHU7ecWyUZSdXQG
STRIPE_PRICE_PREMIUM=price_1S0mqhLhhuHU7ecWyUZSdXQG

# Stripe - Webhook Secret (para produção)
STRIPE_WEBHOOK_SECRET=whsec_SUA_CHAVE_WEBHOOK_AQUI
```

### 3. Reiniciar o servidor

```bash
# Parar o servidor (Ctrl+C)
# Depois reiniciar:
pnpm dev
```

## 🔐 Segurança

⚠️ **NUNCA** commite o arquivo `.env.local` no Git!

O arquivo `.env.local` já está no `.gitignore` e não deve ser compartilhado.

## 📝 Arquivo `.env.local` Completo de Exemplo

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dxdbpppymxfiojszrmir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe - Chaves de TESTE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SHjkoFJKEapQRHv...
STRIPE_SECRET_KEY=sk_test_51SHjkoFJKEapQRHv...

# Stripe - Webhook
STRIPE_WEBHOOK_SECRET=whsec_...

# Site URL (para produção)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Email (opcional)
NEXT_PUBLIC_ADMIN_EMAIL=admin@financeira.com
```

## 🧪 Testar se está funcionando

1. Acesse: http://localhost:3000/landingpage
2. Clique em qualquer botão "Assinar"
3. Deve redirecionar para o Stripe Checkout
4. Se ver o formulário do Stripe = ✅ Funcionando!

## 🎯 Criar Produtos e Preços no Stripe

### Passo a passo:

1. Acesse: https://dashboard.stripe.com/test/products
2. Clique em **"+ Criar produto"**
3. Preencha:
   - **Nome**: Plano Básico
   - **Descrição**: Funcionalidades essenciais
   - **Preço**: R$ 19,90
   - **Tipo**: Recorrente
   - **Período**: Mensal
4. Clique em **"Salvar produto"**
5. **Copie o Price ID** (começa com `price_...`)
6. Repita para os outros planos (Pro e Premium)

### Atualizar os Price IDs

Depois de criar os produtos, atualize o arquivo `/lib/stripe-config.ts`:

```typescript
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  prices: {
    BASIC: 'price_1SLYIUFBXQU4a5ve7HBIPRuT',
    PRO: 'price_1SLYoJFBXQU4a5veLVdDFuAn',
    PREMIUM: 'price_1SLYpKFBXQU4a5vebEIc0wj6',
  }
}
```

## 🌐 Configurar Webhook (Produção)

Para receber eventos do Stripe em produção:

1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique em **"+ Adicionar endpoint"**
3. URL: `https://seudominio.com/api/stripe/webhook`
4. Selecione eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copie o **Webhook signing secret** (começa com `whsec_...`)
6. Adicione no `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

## ❓ Problemas Comuns

### Erro: "No such price"
- Verifique se os Price IDs estão corretos
- Certifique-se de estar usando IDs de **Price**, não de **Product**

### Erro: "Invalid API Key"
- Verifique se copiou a chave secreta completa
- Certifique-se de que começa com `sk_test_` ou `sk_live_`

### Erro: "This customer has no attached payment source"
- Normal em ambiente de teste
- Use o cartão de teste: `4242 4242 4242 4242`

## 📚 Recursos Úteis

- [Documentação do Stripe](https://stripe.com/docs)
- [Dashboard do Stripe](https://dashboard.stripe.com)
- [Cartões de teste](https://stripe.com/docs/testing#cards)

---

**Após configurar tudo, delete este arquivo ou mova para `/docs/`**
