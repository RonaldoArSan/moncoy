import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

// GET - Obter resumo financeiro do usuário
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    // Verificar se o usuário existe
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) {
      console.error('Erro ao buscar usuário:', userError)
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Calcular totais diretamente das tabelas
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Total de receitas (últimos 30 dias)
    const { data: incomeData, error: incomeError } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'income')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

    const totalIncome = incomeData?.reduce((sum, t) => sum + Number(t.amount || 0), 0) || 0

    // Total de despesas (últimos 30 dias)
    const { data: expenseData, error: expenseError } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

    const totalExpenses = expenseData?.reduce((sum, t) => sum + Number(t.amount || 0), 0) || 0

    // Total de investimentos
    const { data: investmentData, error: investmentError } = await supabaseAdmin
      .from('investments')
      .select('quantity, current_price')
      .eq('user_id', userId)

    const totalInvestments = investmentData?.reduce((sum, inv) => 
      sum + (Number(inv.quantity || 0) * Number(inv.current_price || 0)), 0) || 0

    // Contas bancárias
    const { data: accountData, error: accountError } = await supabaseAdmin
      .from('bank_accounts')
      .select('balance')
      .eq('user_id', userId)
      .eq('is_active', true)

    const totalBalance = accountData?.reduce((sum, acc) => sum + Number(acc.balance || 0), 0) || 0

    // Metas
    const { data: goalsData, error: goalsError } = await supabaseAdmin
      .from('goals')
      .select('is_completed')
      .eq('user_id', userId)

    const totalGoals = goalsData?.length || 0
    const completedGoals = goalsData?.filter(g => g.is_completed).length || 0

    // Simular gastos por categoria (últimos 30 dias)
    let categorySpending = []
    try {
      const categoryResult = await supabaseAdmin
        .rpc('get_spending_by_category', { 
          user_uuid: userId,
          start_date: thirtyDaysAgo.toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0]
        })
      
      if (!categoryResult.error && categoryResult.data) {
        categorySpending = categoryResult.data
      }
    } catch (error) {
      console.warn('Função get_spending_by_category não existe, usando fallback')
    }

    const financialSummary = {
      user_id: userId,
      name: user.name,
      email: user.email,
      plan: user.plan,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net_income: totalIncome - totalExpenses,
      total_balance: totalBalance,
      total_debt: 0, // Por enquanto sem dívidas
      total_investments: totalInvestments,
      completed_goals: completedGoals,
      total_goals: totalGoals,
      net_worth: totalBalance + totalInvestments,
      savings_rate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      spending_by_category: categorySpending,
      unusual_spending: [],
      alerts: []
    }

    return NextResponse.json({ summary: financialSummary })
  } catch (error: any) {
    console.error('Erro na API de resumo financeiro:', error)
    return NextResponse.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Gerar relatório mensal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, month } = body

    if (!user_id || !month) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: user_id, month (formato: YYYY-MM)' 
      }, { status: 400 })
    }

    const { data: reportId, error } = await supabaseAdmin
      .rpc('generate_monthly_report', { 
        user_uuid: user_id,
        report_month: month
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Buscar o relatório criado
    const { data: report, error: reportError } = await supabaseAdmin
      .from('financial_reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (reportError) {
      return NextResponse.json({ error: reportError.message }, { status: 500 })
    }

    return NextResponse.json({ report })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}