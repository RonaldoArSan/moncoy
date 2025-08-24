import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY ausente ou inválida no servidor.' }, { status: 500 })
    }

  const { priceId, customerEmail, metadata, plan } = await req.json().catch(() => ({}))
    if (!priceId || typeof priceId !== 'string') {
      return NextResponse.json({ error: 'priceId é obrigatório.' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    }

    if (typeof customerEmail === 'string') {
      params.customer_email = customerEmail
    }
    if (typeof plan === 'string' || (typeof metadata === 'object' && metadata !== null)) {
      params.metadata = {
        ...(typeof metadata === 'object' && metadata !== null ? metadata : {}),
        ...(typeof plan === 'string' ? { plan } : {}),
      }
    }

    const session = await stripe.checkout.sessions.create(params)

    return NextResponse.json({ sessionId: session.id })
  } catch (err: any) {
    console.error('Erro ao criar sessão do Stripe:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
