import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { checkAILimit, incrementAIUsage, getAIUsageKey, type AIUsage } from '@/lib/ai-limits'

if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY not found in environment variables')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    const { transactions, type, userPlan, userId } = await request.json()
    
    // Check AI usage limits
    const usageKey = getAIUsageKey(userId || 'anonymous')
    const currentUsage: AIUsage = {
      count: 0,
      lastReset: new Date().toISOString(),
      plan: userPlan,
      ...JSON.parse(globalThis.localStorage?.getItem(usageKey) || '{}')
    }
    
    const limitCheck = checkAILimit(userPlan, currentUsage)
    
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { 
          error: `Limite de perguntas excedido. Próxima renovação: ${limitCheck.resetDate.toLocaleDateString('pt-BR')}`,
          remaining: limitCheck.remaining,
          resetDate: limitCheck.resetDate
        },
        { status: 429 }
      )
    }

    let prompt = ''
    
    switch (type) {
      case 'spending_analysis':
        const totalExpenses = transactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0)
        prompt = `Analise estes gastos financeiros em português brasileiro e forneça insights úteis. Total gasto: R$ ${totalExpenses.toFixed(2)}. Transações: ${JSON.stringify(transactions.slice(0, 10))}. Seja conciso e prático.`
        break
      case 'budget_suggestions':
        prompt = `Com base nestas transações financeiras, sugira um orçamento mensal realista em português brasileiro: ${JSON.stringify(transactions.slice(0, 10))}. Seja específico com valores.`
        break
      case 'category_prediction':
        prompt = `Categorize esta transação financeira em português: "${transactions[0]?.description}". Responda apenas com a categoria sugerida.`
        break
      default:
        throw new Error('Tipo de análise não suportado')
    }

    // Selecionar modelo baseado no plano
    let model = 'gpt-4o-mini' // default
    if (userPlan === 'premium') {
      model = 'gpt-4o-mini' // Use gpt-4o when available
    } else if (userPlan === 'pro' && type === 'advanced_analysis') {
      model = 'gpt-4o-mini' // Limited GPT-4o for pro plan
    }
    
    const completion = await openai.chat.completions.create({
      model,
      messages: [{
        role: "system",
        content: "Você é um consultor financeiro especializado em finanças pessoais brasileiras. Responda sempre em português brasileiro de forma clara e objetiva."
      }, {
        role: "user",
        content: prompt
      }],
      max_tokens: 300,
      temperature: 0.7
    })

    // Increment usage count
    const newUsage = incrementAIUsage({
      ...currentUsage,
      lastReset: limitCheck.resetDate.toISOString()
    })
    
    // Store updated usage (in real app, this would be in database)
    if (typeof window !== 'undefined') {
      localStorage.setItem(usageKey, JSON.stringify(newUsage))
    }
    
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