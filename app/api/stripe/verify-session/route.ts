import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID é obrigatório' },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    // Buscar informações da sessão
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription']
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Sessão não encontrada' },
        { status: 404 }
      )
    }

    // Extrair informações relevantes
    const customerEmail = session.customer_details?.email || session.customer_email
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
    const plan = session.metadata?.plan || 'professional'
    const paymentStatus = session.payment_status
    
    return NextResponse.json({
      email: customerEmail,
      customerId: customerId,
      plan: plan,
      paymentStatus: paymentStatus,
      subscriptionId: session.subscription
    })
  } catch (error) {
    console.error('Erro ao verificar sessão:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar sessão do Stripe' },
      { status: 500 }
    )
  }
}
