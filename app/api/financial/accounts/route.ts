import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Listar contas financeiras do usuário
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    const { data: accounts, error } = await supabaseAdmin
      .from('financial_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ accounts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Criar nova conta financeira
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      name, 
      account_type, 
      institution, 
      currency, 
      current_balance,
      credit_limit,
      account_number,
      routing_number
    } = body

    if (!user_id || !name || !account_type) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: user_id, name, account_type' 
      }, { status: 400 })
    }

    const { data: account, error } = await supabaseAdmin
      .from('financial_accounts')
      .insert({
        user_id,
        name,
        account_type,
        institution,
        currency: currency || 'BRL',
        current_balance: current_balance || 0,
        credit_limit: credit_limit || 0,
        account_number,
        routing_number
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ account })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Atualizar conta financeira
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID da conta é obrigatório' }, { status: 400 })
    }

    const { data: account, error } = await supabaseAdmin
      .from('financial_accounts')
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

    return NextResponse.json({ account })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Desativar conta financeira
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID da conta é obrigatório' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('financial_accounts')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Conta desativada com sucesso' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}