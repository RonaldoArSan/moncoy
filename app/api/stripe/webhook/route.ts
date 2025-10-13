import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil',
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Assinatura do webhook ausente' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Erro na verificação do webhook:', error)
    return NextResponse.json(
      { error: 'Webhook inválido' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          const customerId = session.customer as string
          const userId = session.metadata?.user_id
          const plan = session.metadata?.plan || 'professional'

          if (userId) {
            // Atualizar usuário com customer ID e plano
            await supabase
              .from('users')
              .update({
                stripe_customer_id: customerId,
                plan: plan,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId)
          }
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        
        // Buscar usuário pelo customer ID
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (userData) {
          let plan = 'basic'
          
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            // Determinar plano baseado no preço
            const priceId = subscription.items.data[0]?.price.id
            if (priceId === process.env.STRIPE_PRICE_PRO) {
              plan = 'professional'
            } else if (priceId === process.env.STRIPE_PRICE_PREMIUM) {
              plan = 'premium'
            }
          }

          await supabase
            .from('users')
            .update({
              plan: plan,
              updated_at: new Date().toISOString()
            })
            .eq('id', userData.id)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Pagamento bem-sucedido:', invoice.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Falha no pagamento:', invoice.id)
        break
      }

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Erro ao processar webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
