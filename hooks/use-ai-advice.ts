import { useState, useEffect } from 'react'
import { useReports } from './use-reports'

interface AIAdvice {
  id: string
  category: string
  title: string
  content: string
  priority: 'high' | 'medium' | 'low'
  savings?: string
}

export function useAIAdvice() {
  const [advices, setAdvices] = useState<AIAdvice[]>([])
  const [loading, setLoading] = useState(true)
  const { getKPIs, getCategoryExpenses, getMonthlyData } = useReports()

  const generateAdvices = () => {
    const kpis = getKPIs()
    const categoryExpenses = getCategoryExpenses()
    const monthlyData = getMonthlyData()
    const generatedAdvices: AIAdvice[] = []

    // Análise de saldo negativo
    if (kpis.saldoMensal < 0) {
      generatedAdvices.push({
        id: 'negative-balance',
        category: 'Alerta',
        title: 'Saldo Mensal Negativo',
        content: `Suas despesas estão R$ ${Math.abs(kpis.saldoMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} acima das receitas este mês. Revise seus gastos e considere cortar despesas não essenciais.`,
        priority: 'high'
      })
    }

    // Análise de categoria com maior gasto
    if (categoryExpenses.length > 0) {
      const topCategory = categoryExpenses[0]
      if (topCategory.percentage > 40) {
        generatedAdvices.push({
          id: 'high-category-spending',
          category: 'Economia',
          title: `Alto Gasto em ${topCategory.category}`,
          content: `Você está gastando ${topCategory.percentage.toFixed(1)}% do seu orçamento com ${topCategory.category}. Considere reduzir esses gastos em 10% para economizar.`,
          priority: 'high',
          savings: `R$ ${(topCategory.amount * 0.1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        })
      }
    }

    // Análise de tendência mensal
    if (monthlyData.length >= 2) {
      const lastMonth = monthlyData[monthlyData.length - 1]
      const previousMonth = monthlyData[monthlyData.length - 2]
      const expenseIncrease = ((lastMonth.despesas - previousMonth.despesas) / previousMonth.despesas) * 100

      if (expenseIncrease > 15) {
        generatedAdvices.push({
          id: 'expense-increase',
          category: 'Alerta',
          title: 'Aumento Significativo de Gastos',
          content: `Suas despesas aumentaram ${expenseIncrease.toFixed(1)}% em relação ao mês anterior. Analise onde estão os maiores aumentos e ajuste seu orçamento.`,
          priority: 'medium'
        })
      }
    }

    // Análise de economia positiva
    if (kpis.saldoMensal > 0 && kpis.economiaMedia > 0) {
      generatedAdvices.push({
        id: 'positive-savings',
        category: 'Investimentos',
        title: 'Oportunidade de Investimento',
        content: `Você tem um saldo positivo de R$ ${kpis.saldoMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Considere investir parte desse valor para fazer seu dinheiro render.`,
        priority: 'low'
      })
    }

    // Análise de gasto diário alto
    if (kpis.gastoMedioDiario > 200) {
      generatedAdvices.push({
        id: 'high-daily-spending',
        category: 'Planejamento',
        title: 'Gasto Diário Elevado',
        content: `Seu gasto médio diário é de R$ ${kpis.gastoMedioDiario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Estabeleça um limite diário menor para melhor controle financeiro.`,
        priority: 'medium'
      })
    }

    // Conselho padrão se não houver dados suficientes
    if (generatedAdvices.length === 0) {
      generatedAdvices.push({
        id: 'default-advice',
        category: 'Planejamento',
        title: 'Continue Registrando suas Transações',
        content: 'Continue registrando suas transações para que eu possa fornecer conselhos mais personalizados baseados no seu comportamento financeiro.',
        priority: 'low'
      })
    }

    return generatedAdvices
  }

  useEffect(() => {
    setLoading(true)
    // Simular delay para análise IA
    const timer = setTimeout(() => {
      const newAdvices = generateAdvices()
      setAdvices(newAdvices)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return {
    advices,
    loading,
    refreshAdvices: () => {
      setLoading(true)
      const timer = setTimeout(() => {
        const newAdvices = generateAdvices()
        setAdvices(newAdvices)
        setLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }
}