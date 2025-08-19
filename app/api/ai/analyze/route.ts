import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import supabase from '@/lib/supabase'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { transactions, type, userPlan, userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    // Verificar limites de IA usando função do banco
    const { data: limitCheck, error: limitError } = await supabase
      .rpc('check_ai_limit', { p_user_id: userId, p_plan: userPlan })

    if (limitError) {
      console.error('Erro ao verificar limite:', limitError)
      return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }

    if (!limitCheck.allowed) {
      return NextResponse.json({
        error: `Limite de ${limitCheck.limit} perguntas excedido. Próxima renovação: ${new Date(limitCheck.resetDate).toLocaleDateString('pt-BR')}`,
        remaining: limitCheck.remaining,
        resetDate: limitCheck.resetDate
      }, { status: 429 })
    }

    // Verificar se usuário pode usar IA (período de carência)
    const { data: user } = await supabase
      .from('users')
      .select('registration_date, plan')
      .eq('id', userId)
      .single()

    if (user?.plan === 'professional') {
      const daysSinceRegistration = Math.floor(
        (Date.now() - new Date(user.registration_date).getTime()) / (1000 * 60 * 60 * 24)
      )
      
      if (daysSinceRegistration < 22) {
        return NextResponse.json({
          error: `IA será liberada em ${22 - daysSinceRegistration} dias. Período de carência para plano profissional.`,
          daysRemaining: 22 - daysSinceRegistration
        }, { status: 403 })
      }
    }

    // Gerar prompt baseado no tipo
    let prompt = ''
    switch (type) {
      case 'spending_analysis':
        const totalExpenses = transactions
          .filter((t: any) => t.type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0)
        prompt = `Analise estes gastos financeiros e forneça insights úteis em português brasileiro. Total gasto: R$ ${totalExpenses.toFixed(2)}. Transações recentes: ${JSON.stringify(transactions.slice(0, 10))}. Seja conciso e prático com sugestões de economia.`
        break
      case 'budget_suggestions':
        prompt = `Com base nestas transações, sugira um orçamento mensal realista em português brasileiro: ${JSON.stringify(transactions.slice(0, 10))}. Inclua valores específicos por categoria.`
        break
      case 'category_prediction':
        prompt = `Categorize esta transação: "${transactions[0]?.description}". Responda apenas com a categoria mais apropriada.`
        break
      default:
        return NextResponse.json({ error: 'Tipo de análise não suportado' }, { status: 400 })
    }

    // Selecionar modelo baseado no plano
    const model = userPlan === 'premium' ? 'gpt-4o-mini' : 'gpt-4o-mini'
    
    const completion = await openai.chat.completions.create({
      model,
      messages: [{
        role: "system",
        content: "Você é um consultor financeiro especializado em finanças pessoais brasileiras. Responda sempre em português brasileiro de forma clara, objetiva e útil."
      }, {
        role: "user",
        content: prompt
      }],
      max_tokens: userPlan === 'premium' ? 500 : 300,
      temperature: 0.7
    })

    // Incrementar contador de uso
    await supabase.rpc('increment_ai_usage', { p_user_id: userId })

    return NextResponse.json({
      analysis: completion.choices[0].message.content,
      timestamp: new Date().toISOString(),
      usage: {
        remaining: limitCheck.remaining - 1,
        resetDate: limitCheck.resetDate
      }
    })

  } catch (error: any) {
    console.error('AI Analysis Error:', error)
    return NextResponse.json(
      { error: error.message || 'Erro na análise de IA' },
      { status: 500 }
    )
  }
}