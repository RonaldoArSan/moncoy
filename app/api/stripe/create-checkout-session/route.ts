import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { priceId, plan } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID é obrigatório' },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    // Obter a origem da requisição
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Criar sessão do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        plan: plan || 'professional',
      },
      subscription_data: {
        metadata: {
          plan: plan || 'professional',
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Erro ao criar sessão do checkout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
