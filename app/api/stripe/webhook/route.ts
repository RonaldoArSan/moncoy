import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import stripe from '@/lib/stripe'
import supabaseAdmin from '@/lib/supabase-admin'

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
        let email = session.customer_email || undefined
        const stripeCustomerId = typeof session.customer === 'string' ? session.customer : undefined
        const targetPlan = (session.metadata?.plan as string | undefined) || undefined

        if (!email && typeof session.customer === 'string') {
          try {
            const customer = await stripe.customers.retrieve(session.customer)
            if (customer && !('deleted' in customer)) {
              email = customer.email || undefined
            }
          } catch (e) {
            console.warn('Não foi possível recuperar cliente para obter email:', e)
          }
        }

        if (!email) {
          console.warn('checkout.session.completed sem customer_email. Não foi possível atualizar plano.')
          break
        }

        const plan = targetPlan || 'professional'

        const { error } = await supabaseAdmin
          .from('users')
          .update({ plan, stripe_customer_id: stripeCustomerId })
          .eq('email', email)

        if (error) {
          console.error('Erro ao atualizar plano no Supabase:', error)
        }
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
