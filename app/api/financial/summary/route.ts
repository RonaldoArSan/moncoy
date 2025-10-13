import { NextRequest, NextResponse } from 'next/server'

// GET - Obter resumo financeiro do usuário (versão simplificada)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    console.log('Buscando resumo financeiro para o usuário:', userId)

    // Retornar dados simulados por enquanto, até configurar o Supabase corretamente
    const financialSummary = {
      user_id: userId,
      name: 'Usuário',
      email: 'usuario@exemplo.com',
      plan: 'basic',
      total_income: 5000,
      total_expenses: 3000,
      net_income: 2000,
      total_balance: 10000,
      total_debt: 0,
      total_investments: 2000,
      completed_goals: 2,
      total_goals: 5,
      net_worth: 12000,
      savings_rate: 40,
      spending_by_category: [],
      unusual_spending: [],
      alerts: []
    }

    return NextResponse.json({ summary: financialSummary })
  } catch (error: any) {
    console.error('Erro na API de resumo financeiro:', error)
    return NextResponse.json({ error: error.message || 'Erro interno do servidor' }, { status: 500 })
  }
}