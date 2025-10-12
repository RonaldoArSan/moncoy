import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Listar dívidas do usuário
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    const { data: debts, error } = await supabaseAdmin
      .from('debts')
      .select(`
        *,
        debt_payments (
          id,
          amount,
          payment_date,
          payment_type,
          notes
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ debts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Criar nova dívida
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      name, 
      description,
      original_amount, 
      current_balance,
      interest_rate,
      minimum_payment,
      due_date,
      debt_type,
      creditor
    } = body

    if (!user_id || !name || !original_amount || !current_balance) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: user_id, name, original_amount, current_balance' 
      }, { status: 400 })
    }

    const { data: debt, error } = await supabaseAdmin
      .from('debts')
      .insert({
        user_id,
        name,
        description,
        original_amount,
        current_balance,
        interest_rate: interest_rate || 0,
        minimum_payment: minimum_payment || 0,
        due_date,
        debt_type: debt_type || 'other',
        creditor
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ debt })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Atualizar dívida
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID da dívida é obrigatório' }, { status: 400 })
    }

    const { data: debt, error } = await supabaseAdmin
      .from('debts')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ debt })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Marcar dívida como quitada
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID da dívida é obrigatório' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('debts')
      .update({ 
        is_active: false,
        current_balance: 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Dívida marcada como quitada' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}