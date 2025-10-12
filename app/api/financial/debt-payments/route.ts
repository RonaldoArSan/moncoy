import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// POST - Registrar pagamento de dívida
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      debt_id, 
      amount, 
      payment_date, 
      payment_type, 
      notes 
    } = body

    if (!debt_id || !amount || !payment_date) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: debt_id, amount, payment_date' 
      }, { status: 400 })
    }

    // Verificar se a dívida existe
    const { data: debt, error: debtError } = await supabaseAdmin
      .from('debts')
      .select('*')
      .eq('id', debt_id)
      .single()

    if (debtError || !debt) {
      return NextResponse.json({ error: 'Dívida não encontrada' }, { status: 404 })
    }

    // Registrar pagamento
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('debt_payments')
      .insert({
        debt_id,
        amount,
        payment_date,
        payment_type: payment_type || 'regular',
        notes
      })
      .select()
      .single()

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 500 })
    }

    // Atualizar saldo da dívida
    const newBalance = Math.max(0, debt.current_balance - amount)
    const { error: updateError } = await supabaseAdmin
      .from('debts')
      .update({ 
        current_balance: newBalance,
        is_active: newBalance > 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', debt_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      payment,
      new_balance: newBalance,
      is_paid_off: newBalance === 0
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET - Listar pagamentos de uma dívida
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const debtId = url.searchParams.get('debt_id')

    if (!debtId) {
      return NextResponse.json({ error: 'Debt ID é obrigatório' }, { status: 400 })
    }

    const { data: payments, error } = await supabaseAdmin
      .from('debt_payments')
      .select('*')
      .eq('debt_id', debtId)
      .order('payment_date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ payments })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}