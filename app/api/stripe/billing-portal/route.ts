import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { getPublicBaseUrl } from '@/lib/url'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
  const { customerId, returnUrl } = await req.json()
    if (!customerId) return NextResponse.json({ error: 'customerId é obrigatório' }, { status: 400 })

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: (typeof returnUrl === 'string' && returnUrl) || getPublicBaseUrl(req),
    })

    return NextResponse.json({ url: portal.url })
  } catch (err: any) {
    console.error('Erro ao criar sessão do Portal de Faturamento:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
