import Stripe from 'stripe'

let stripe: Stripe | null = null

export const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: '2024-06-20',
    })
  }
  return stripe
}
