// Configuração do Stripe
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  
  // IDs dos preços do Stripe (price_xxx, não prod_xxx)
  prices: {
    BASIC: 'price_1RtvdYLhhuHU7ecWyxiz6zti',     // R$ 19,90/mês
    PRO: 'price_1Rx7OBLhhuHU7ecWhotGOhi7',        // R$ 49,90/mês  
    PREMIUM: 'price_1Rx7ZsLhhuHU7ecWtA3wXXXI'     // R$ 59,90/mês
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
      successUrl: `${origin}/dashboard?upgrade=success`,
      cancelUrl: `${origin}/plans?upgrade=cancelled`,
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