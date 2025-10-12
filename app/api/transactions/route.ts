import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Listar transações do usuário
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const type = url.searchParams.get('type')
    const categoryId = url.searchParams.get('category_id')
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')

    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('transactions')
      .select(`
        *,
        categories (
          id,
          name,
          color,
          type
        )
      `)
      .eq('user_id', userId)

    // Aplicar filtros
    if (type) {
      query = query.eq('type', type)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: transactions, error } = await query
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transactions })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Criar nova transação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      description, 
      amount, 
      type, 
      category_id, 
      date,
      status,
      priority,
      notes,
      receipt_url,
      merchant
    } = body

    if (!user_id || !amount || !type || !date) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: user_id, amount, type, date' 
      }, { status: 400 })
    }

    // Validar tipo de transação
    if (!['income', 'expense', 'transfer'].includes(type)) {
      return NextResponse.json({ 
        error: 'Tipo deve ser: income, expense ou transfer' 
      }, { status: 400 })
    }

    const { data: transaction, error } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id,
        description,
        amount: Math.abs(amount), // Garantir valor positivo
        type,
        category_id,
        date,
        status: status || 'completed',
        priority: priority || 'medium',
        notes,
        receipt_url,
        merchant
      })
      .select(`
        *,
        categories (
          id,
          name,
          color,
          type
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Atualizar saldo das contas se necessário
    // Isso pode ser expandido para incluir lógica de contas específicas

    return NextResponse.json({ transaction })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Atualizar transação
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID da transação é obrigatório' }, { status: 400 })
    }

    // Garantir que amount seja positivo se fornecido
    if (updateData.amount) {
      updateData.amount = Math.abs(updateData.amount)
    }

    const { data: transaction, error } = await supabaseAdmin
      .from('transactions')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name,
          color,
          type
        )
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transaction })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remover transação
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID da transação é obrigatório' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Transação removida com sucesso' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}