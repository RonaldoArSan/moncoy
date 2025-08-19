// Configuração do Stripe
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  
  // IDs dos preços do Stripe (price_xxx, não prod_xxx)
  prices: {
    BASIC: 'price_1RtvdYLhhuHU7ecWyxiz6zti',     // R$ 19,90/mês
    PRO: 'price_1Rx7OBLhhuHU7ecWhotGOhi7',        // R$ 49,90/mês  
    PREMIUM: 'price_1Rx7ZsLhhuHU7ecWtA3wXXXI'     // R$ 59,90/mês
  },
  
  // URLs de redirecionamento
  urls: {
    success: (origin: string) => `${origin}/dashboard?upgrade=success`,
    cancel: (origin: string) => `${origin}/plans?upgrade=cancelled`
  }
}

export const redirectToStripeCheckout = async (priceId: string) => {
  const stripe = await import('@stripe/stripe-js').then(m => 
    m.loadStripe(STRIPE_CONFIG.publishableKey)
  )
  
  if (!stripe) {
    throw new Error('Stripe não carregou')
  }

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{
      price: priceId,
      quantity: 1,
    }],
    mode: 'subscription',
    successUrl: STRIPE_CONFIG.urls.success(window.location.origin),
    cancelUrl: STRIPE_CONFIG.urls.cancel(window.location.origin),
  })

  if (error) {
    console.error('Erro no checkout:', error)
    throw error
  }
}