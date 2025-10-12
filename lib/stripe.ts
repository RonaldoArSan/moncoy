import Stripe from 'stripe'

let stripe: Stripe | null = null

export const getStripe = () => {
  if (!stripe) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeSecretKey) {
      throw new Error(
        'STRIPE_SECRET_KEY is required. Please check your environment variables. ' +
        'See .env.example for required configuration. ' +
        'Note: This key should only be used on the server side and never exposed to the client.'
      )
    }

    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    })
  }
  return stripe
}
