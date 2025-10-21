import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { handleCorsPreFlight, addCorsHeaders } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin') || 'http://localhost:3000'
  
  try {
    const { priceId, plan } = await request.json()

    if (!priceId) {
      const response = NextResponse.json(
        { error: 'Price ID é obrigatório' },
        { status: 400 }
      )
      return addCorsHeaders(response, origin)
    }

    const stripe = getStripe()

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

    const response = NextResponse.json({ sessionId: session.id })
    return addCorsHeaders(response, origin)
  } catch (error) {
    console.error('Erro ao criar sessão do checkout:', error)
    const response = NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
    return addCorsHeaders(response, origin)
  }
}
