import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Listar alertas financeiros do usuário
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')
    const includeRead = url.searchParams.get('include_read') === 'true'
    const includeDismissed = url.searchParams.get('include_dismissed') === 'true'

    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('financial_alerts')
      .select('*')
      .eq('user_id', userId)

    // Filtros opcionais
    if (!includeRead) {
      query = query.eq('is_read', false)
    }

    if (!includeDismissed) {
      query = query.eq('is_dismissed', false)
    }

    // Apenas alertas que não expiraram
    query = query.or('expires_at.is.null,expires_at.gte.' + new Date().toISOString())

    const { data: alerts, error } = await query
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ alerts })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Criar novos alertas financeiros
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    // Usar função do banco para criar alertas automaticamente
    const { data: alertsCreated, error } = await supabaseAdmin
      .rpc('create_financial_alerts', { user_uuid: user_id })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: `${alertsCreated} alertas criados`,
      alerts_created: alertsCreated
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Marcar alerta como lido ou dismissado
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, is_read, is_dismissed } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do alerta é obrigatório' }, { status: 400 })
    }

    const updateData: any = {}
    if (typeof is_read === 'boolean') {
      updateData.is_read = is_read
    }
    if (typeof is_dismissed === 'boolean') {
      updateData.is_dismissed = is_dismissed
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ 
        error: 'Pelo menos um campo deve ser fornecido: is_read ou is_dismissed' 
      }, { status: 400 })
    }

    const { data: alert, error } = await supabaseAdmin
      .from('financial_alerts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ alert })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Remover alerta
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID do alerta é obrigatório' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('financial_alerts')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Alerta removido com sucesso' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}