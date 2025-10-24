// Configuração do Stripe
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // IDs dos preços do Stripe (price_xxx, não prod_xxx)
  // IMPORTANTE: Crie estes produtos no Stripe Dashboard ou execute: node scripts/create-stripe-products.js
  prices: {
    BASIC: process.env.STRIPE_PRICE_BASIC || '',
    PRO: process.env.STRIPE_PRICE_PRO || '',
    PREMIUM: process.env.STRIPE_PRICE_PREMIUM || '',
  }
}

// Validação defensiva: nunca permitir sk_ no cliente
if (
  typeof window !== 'undefined' &&
  STRIPE_CONFIG.publishableKey &&
  !STRIPE_CONFIG.publishableKey.startsWith('pk_')
) {
  // Não expor a chave, apenas orientar
  console.error('Chave Stripe inválida no cliente. Use NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY começando com "pk_".');
}

/**
 * Valida se as configurações do Stripe estão definidas corretamente
 * @param priceId - O ID do preço a ser validado
 * @throws Error com mensagem detalhada se a configuração estiver incorreta
 */
function validateStripeConfig(priceId: string): void {
  // Validar chave publicável
  if (!STRIPE_CONFIG.publishableKey) {
    throw new Error(
      '❌ Configuração incompleta: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY não está definida.\n\n' +
      '📋 Para configurar:\n' +
      '1. Acesse: https://dashboard.stripe.com/test/apikeys\n' +
      '2. Copie sua Publishable Key (começa com pk_test_)\n' +
      '3. Adicione no arquivo .env.local:\n' +
      '   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui\n' +
      '4. Reinicie o servidor: npm run dev\n\n' +
      '📖 Veja STRIPE-SETUP.md para instruções completas'
    )
  }

  if (!STRIPE_CONFIG.publishableKey.startsWith('pk_')) {
    throw new Error(
      '❌ Chave Stripe inválida: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY deve começar com "pk_".\n' +
      'Verifique se você está usando a chave publicável correta (não use a secret key aqui!)'
    )
  }

  // Validar price ID
  if (!priceId) {
    throw new Error(
      '❌ Configuração incompleta: Price IDs do Stripe não estão configurados.\n\n' +
      '🛠️ Você precisa criar os produtos no Stripe primeiro:\n\n' +
      'Opção 1 - Via Script (Recomendado):\n' +
      '  1. Configure STRIPE_SECRET_KEY no .env.local\n' +
      '  2. Execute: node scripts/create-stripe-products.js\n' +
      '  3. Copie os Price IDs gerados para o .env.local\n\n' +
      'Opção 2 - Manual no Dashboard:\n' +
      '  1. Acesse: https://dashboard.stripe.com/test/products\n' +
      '  2. Crie os 3 produtos (Básico R$19,90, Pro R$49,90, Premium R$59,90)\n' +
      '  3. Copie os Price IDs (começam com price_)\n' +
      '  4. Adicione no .env.local:\n' +
      '     STRIPE_PRICE_BASIC=price_...\n' +
      '     STRIPE_PRICE_PRO=price_...\n' +
      '     STRIPE_PRICE_PREMIUM=price_...\n\n' +
      '📖 Veja CRIAR-PRODUTOS-STRIPE.md para instruções detalhadas'
    )
  }

  if (!priceId.startsWith('price_')) {
    throw new Error(
      '❌ Price ID inválido: "' + priceId + '"\n\n' +
      'Os Price IDs do Stripe devem começar com "price_".\n' +
      'Certifique-se de usar o Price ID (não o Product ID que começa com prod_).\n\n' +
      '💡 Como encontrar o Price ID:\n' +
      '1. Acesse: https://dashboard.stripe.com/test/products\n' +
      '2. Clique no produto\n' +
      '3. Na seção "Preços", copie o ID que começa com "price_"'
    )
  }
}

export const redirectToStripeCheckout = async (priceId: string) => {
  try {
    // Validar configuração antes de prosseguir
    validateStripeConfig(priceId)

    // 1) Cria a sessão no servidor
    const res = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Falha ao criar sessão do checkout')
    }

    const { sessionId } = await res.json()

    // 2) Redireciona via Stripe.js
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(STRIPE_CONFIG.publishableKey)
    if (!stripe) throw new Error('Stripe não carregou')

    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) {
      console.error('Erro no checkout:', error)
      throw error
    }
  } catch (error) {
    console.error('Erro ao inicializar Stripe:', error)
    throw error
  }
}