import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export interface FinancialAlert {
  id: string
  user_id: string
  alert_type: string
  title: string
  message: string
  severity: string
  is_read: boolean
  is_dismissed: boolean
  related_entity_type?: string
  related_entity_id?: string
  action_url?: string
  expires_at?: string
  created_at: string
}

export interface FinancialSummary {
  user_id: string
  name?: string
  email?: string
  plan?: string
  total_income?: number
  total_expenses?: number
  net_income?: number
  total_balance?: number
  total_debt?: number
  total_investments?: number
  completed_goals?: number
  total_goals?: number
  net_worth: number
  savings_rate: number
  spending_by_category: Array<{
    category_name: string
    total_amount: number
    transaction_count: number
    percentage: number
  }>
  unusual_spending: Array<{
    transaction_id: string
    amount: number
    description: string
    category_name: string
    date: string
    avg_amount: number
    deviation_percentage: number
  }>
  alerts: FinancialAlert[]
}

interface LegacyFinancialSummary {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  totalInvestments: number
  totalSavings: number
  loading: boolean
}

export function useFinancialSummary() {
  const { user } = useAuth()
  const [summary, setSummary] = useState<FinancialSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/financial/summary?user_id=${user.id}`)
      
      // Verificar se a resposta é HTML (página de erro)
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Resposta não é JSON:', await response.text())
        throw new Error('Servidor retornou uma resposta inválida')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar resumo financeiro')
      }

      setSummary(data.summary)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar resumo financeiro:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyReport = async (month: string) => {
    if (!user?.id) throw new Error('Usuário não autenticado')

    try {
      const response = await fetch('/api/financial/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          month
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar relatório')
      }

      return data.report
    } catch (err: any) {
      console.error('Erro ao gerar relatório:', err)
      throw err
    }
  }

  const getFinancialHealth = () => {
    if (!summary) return 'unknown'

    const factors = []
    
    // Patrimônio líquido positivo
    if (summary.net_worth > 0) factors.push(1)
    else factors.push(-1)

    // Taxa de poupança saudável (> 10%)
    if (summary.savings_rate > 10) factors.push(1)
    else if (summary.savings_rate > 0) factors.push(0)
    else factors.push(-1)

    // Relação dívida/patrimônio
    const debtRatio = summary.total_debt && summary.net_worth > 0 
      ? (summary.total_debt / summary.net_worth) * 100 
      : 0
    
    if (debtRatio < 30) factors.push(1)
    else if (debtRatio < 50) factors.push(0)
    else factors.push(-1)

    // Receita vs despesas
    const netIncomeRatio = summary.total_income && summary.total_income > 0
      ? ((summary.total_income - (summary.total_expenses || 0)) / summary.total_income) * 100
      : 0

    if (netIncomeRatio > 20) factors.push(1)
    else if (netIncomeRatio > 0) factors.push(0)
    else factors.push(-1)

    const score = factors.reduce((sum, factor) => sum + factor, 0)
    
    if (score >= 2) return 'excellent'
    if (score >= 0) return 'good'
    if (score >= -2) return 'fair'
    return 'poor'
  }

  const getSpendingTrend = () => {
    if (!summary?.spending_by_category) return []
    
    return summary.spending_by_category
      .sort((a, b) => b.total_amount - a.total_amount)
      .slice(0, 5) // Top 5 categorias
  }

  const getNetWorthTrend = () => {
    // Este seria calculado com dados históricos em uma implementação completa
    return summary?.net_worth || 0
  }

  const hasUnusualSpending = () => {
    return summary?.unusual_spending && summary.unusual_spending.length > 0
  }

  const getActiveAlertsCount = () => {
    return summary?.alerts?.filter(alert => !alert.is_dismissed && !alert.is_read).length || 0
  }

  const getCriticalAlertsCount = () => {
    return summary?.alerts?.filter(
      alert => !alert.is_dismissed && alert.severity === 'critical'
    ).length || 0
  }

  // Compatibilidade com a interface legacy
  const getLegacySummary = (): LegacyFinancialSummary => {
    if (!summary) {
      return {
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalInvestments: 0,
        totalSavings: 0,
        loading
      }
    }

    return {
      totalBalance: summary.total_balance || 0,
      totalIncome: summary.total_income || 0,
      totalExpenses: summary.total_expenses || 0,
      totalInvestments: summary.total_investments || 0,
      totalSavings: (summary.completed_goals || 0) * 1000, // Estimativa
      loading: false
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [user?.id])

  return {
    summary,
    error,
    fetchSummary,
    generateMonthlyReport,
    getFinancialHealth,
    getSpendingTrend,
    getNetWorthTrend,
    hasUnusualSpending,
    getActiveAlertsCount,
    getCriticalAlertsCount,
    // Legacy compatibility
    ...getLegacySummary()
  }
}