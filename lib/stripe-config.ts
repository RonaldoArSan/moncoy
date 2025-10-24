// Configuração do Stripe
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // IDs dos preços do Stripe (price_xxx, não prod_xxx)
  // IMPORTANTE: Crie estes produtos no Stripe Dashboard ou execute: node scripts/create-stripe-products.js
  prices: {
    // Temporariamente todos apontam para o mesmo preço de teste
    // Após criar os produtos, substitua pelos IDs reais
    BASIC: process.env.STRIPE_PRICE_BASIC || 'price_TESTE',
    PRO: process.env.STRIPE_PRICE_PRO || 'price_TESTE',
    PREMIUM: process.env.STRIPE_PRICE_PREMIUM || 'price_TESTE',
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

export const redirectToStripeCheckout = async (priceId: string) => {
  try {
    if (!STRIPE_CONFIG.publishableKey || !STRIPE_CONFIG.publishableKey.startsWith('pk_')) {
      throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ausente ou inválida (deve iniciar com pk_)')
    }

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