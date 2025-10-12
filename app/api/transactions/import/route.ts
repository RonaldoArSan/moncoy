import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// POST - Importar transações em lote via JSON
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, transactions_json } = body

    if (!user_id || !transactions_json) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: user_id, transactions_json' 
      }, { status: 400 })
    }

    // Validar formato JSON
    let transactionsData
    try {
      transactionsData = typeof transactions_json === 'string' 
        ? JSON.parse(transactions_json) 
        : transactions_json
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Formato JSON inválido para transactions_json' 
      }, { status: 400 })
    }

    // Usar função do banco para importar transações
    const { data: result, error } = await supabaseAdmin
      .rpc('import_transactions_from_json', { 
        user_uuid: user_id,
        transactions_json: JSON.stringify(transactionsData)
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Transações importadas com sucesso',
      imported_count: result
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET - Exportar transações em formato JSON
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')

    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    let query = supabaseAdmin
      .from('transactions')
      .select(`
        id,
        description,
        amount,
        type,
        date,
        status,
        priority,
        notes,
        merchant,
        categories (
          name,
          type,
          color
        )
      `)
      .eq('user_id', userId)

    if (startDate) {
      query = query.gte('date', startDate)
    }

    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: transactions, error } = await query
      .order('date', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Formatar dados para exportação
    const exportData = {
      export_date: new Date().toISOString(),
      user_id: userId,
      period: {
        start_date: startDate || 'all',
        end_date: endDate || 'all'
      },
      total_transactions: transactions.length,
      transactions: transactions.map(t => ({
        description: t.description,
        amount: t.amount,
        type: t.type,
        date: t.date,
        category: (t.categories as any)?.name || 'Sem categoria',
        status: t.status,
        priority: t.priority,
        notes: t.notes,
        merchant: t.merchant
      }))
    }

    return NextResponse.json(exportData)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}