import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import stripe from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig) {
    return NextResponse.json({ message: 'Cabeçalho stripe-signature ausente' }, { status: 400 })
  }

  // Se o segredo não estiver configurado, não falhar em produção acidentalmente
  if (!webhookSecret) {
    console.warn('STRIPE_WEBHOOK_SECRET não configurado. Ignorando evento com sucesso (modo no-op).')
    return NextResponse.json({ received: true })
  }

  let event: Stripe.Event
  const payload = await req.text()

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Erro no webhook: ${err.message}`)
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        // TODO: Atualizar plano do usuário no banco (ex.: Supabase) usando dados do session
        // session.customer, session.customer_email, session.metadata, etc.
        break
      }
      case 'invoice.payment_failed': {
        // TODO: sinalizar falha de pagamento
        break
      }
      default: {
        // Outros eventos podem ser tratados aqui
        break
      }
    }
  } catch (handlerError) {
    console.error('Erro ao tratar evento Stripe:', handlerError)
    // Ainda retornar 200 para evitar reentregas infinitas dependendo do caso
  }

  return NextResponse.json({ received: true })
}
