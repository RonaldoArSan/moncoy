// Configuração do Stripe
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // IDs dos preços do Stripe (price_xxx, não prod_xxx)
  prices: {
    BASIC: 'price_1RzHDnPsqognaoSuCP1ygJhp',     // R$ 19,90/mês
    PRO: 'price_1RzHJ6PsqognaoSuqVts4KQv',  // prod_Sv7W5J7vLgKSrj',        // R$ 49,90/mês  
    PREMIUM: 'price_1RzHJ6PsqognaoSuqVts4KQv',  // prod_Sv7YAotdVKo63f'     // R$ 59,90/mês
  }
}

export const redirectToStripeCheckout = async (priceId: string) => {
  try {
    const { loadStripe } = await import('@stripe/stripe-js')
    const stripe = await loadStripe(STRIPE_CONFIG.publishableKey)
    
    if (!stripe) {
      throw new Error('Stripe não carregou')
    }

    // Garantir que temos uma origem válida
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      successUrl: `${origin}/success`,
      cancelUrl: `${origin}/cancel`,
    })

    if (error) {
      console.error('Erro no checkout:', error)
      throw error
    }
  } catch (error) {
    console.error('Erro ao inicializar Stripe:', error)
    throw error
  }
}