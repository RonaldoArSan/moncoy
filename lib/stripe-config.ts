// Configuração do Stripe
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  
  // IDs dos preços do Stripe (price_xxx, não prod_xxx)
  // IMPORTANTE: Substitua pelos IDs reais do seu Stripe Dashboard
  prices: {
    BASIC: 'price_SEU_ID_BASICO_AQUI',     // R$ 19,90/mês
    PRO: 'price_SEU_ID_PRO_AQUI',          // R$ 49,90/mês  
    PREMIUM: 'price_SEU_ID_PREMIUM_AQUI'   // R$ 59,90/mês
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