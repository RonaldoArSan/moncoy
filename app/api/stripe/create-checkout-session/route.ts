import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'

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

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_email: typeof customerEmail === 'string' ? customerEmail : undefined,
      metadata: {
        ...(typeof metadata === 'object' && metadata !== null ? metadata : {}),
        plan: typeof plan === 'string' ? plan : undefined,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (err: any) {
    console.error('Erro ao criar sessão do Stripe:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
