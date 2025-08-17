import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { transactions, type, userPlan } = await request.json()
    
    if (userPlan !== 'professional') {
      return NextResponse.json(
        { error: 'IA disponível apenas no Plano Profissional' },
        { status: 403 }
      )
    }

    // Simulação de análise de IA (substitua pela integração real com OpenAI)
    let analysis = ''
    
    switch (type) {
      case 'spending_analysis':
        analysis = `Análise de gastos: Você gastou R$ ${transactions.reduce((sum: number, t: any) => sum + (t.type === 'expense' ? t.amount : 0), 0).toFixed(2)} este mês. Principais categorias: alimentação e transporte.`
        break
      case 'budget_suggestions':
        analysis = `Sugestão de orçamento: Com base nos seus gastos, recomendo um orçamento mensal de R$ ${(transactions.reduce((sum: number, t: any) => sum + (t.type === 'expense' ? t.amount : 0), 0) * 1.1).toFixed(2)}.`
        break
      case 'category_prediction':
        analysis = `Categoria sugerida: ${transactions[0]?.description?.toLowerCase().includes('mercado') ? 'Alimentação' : 'Outros'}`
        break
      default:
        analysis = 'Análise não disponível para este tipo.'
    }

    return NextResponse.json({
      analysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Analysis Error:', error)
    return NextResponse.json(
      { error: 'Erro na análise de IA' },
      { status: 500 }
    )
  }
}