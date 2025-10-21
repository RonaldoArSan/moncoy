import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { handleCorsPreFlight, addCorsHeaders } from '@/lib/cors'

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request.headers.get('origin'))
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  try {
    const { customerId } = await request.json()

    if (!customerId) {
      const response = NextResponse.json(
        { error: 'Customer ID é obrigatório' },
        { status: 400 }
      )
      return addCorsHeaders(response, origin)
    }

    const stripe = getStripe()
    const supabase = await createClient()

    // Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user) {
      const response = NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
      return addCorsHeaders(response, origin)
    }

    // Verificar se o customer ID pertence ao usuário
    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (userData?.stripe_customer_id !== customerId) {
      const response = NextResponse.json(
        { error: 'Customer ID inválido' },
        { status: 403 }
      )
      return addCorsHeaders(response, origin)
    }

    // Criar sessão do portal de cobrança
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${request.headers.get('origin')}/settings`,
    })

    const response = NextResponse.json({ url: portalSession.url })
    return addCorsHeaders(response, origin)
  } catch (error) {
    console.error('Erro ao criar sessão do portal de cobrança:', error)
    const response = NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
    return addCorsHeaders(response, origin)
  }
}
