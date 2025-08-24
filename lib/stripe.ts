import Stripe from 'stripe'

// Singleton do Stripe para uso no servidor
// Não fixa apiVersion para evitar conflitos de tipos durante upgrades da SDK
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export default stripe
