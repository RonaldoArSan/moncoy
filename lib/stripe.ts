import Stripe from 'stripe'

let stripe: Stripe | null = null

export const getStripe = () => {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    
    if (!secretKey) {
      throw new Error(
        '❌ STRIPE_SECRET_KEY não está configurada.\n' +
        'Por favor, adicione a variável no arquivo .env.local:\n' +
        'STRIPE_SECRET_KEY=sk_test_...'
      )
    }

    if (!secretKey.startsWith('sk_')) {
      throw new Error(
        '❌ STRIPE_SECRET_KEY inválida.\n' +
        'A chave deve começar com "sk_test_" (teste) ou "sk_live_" (produção)'
      )
    }

    stripe = new Stripe(secretKey, {
      apiVersion: '2025-07-30.basil' as any,
    })
  }
  return stripe
}
