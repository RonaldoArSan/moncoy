import { useState, useEffect } from 'react'
import { transactionsApi, investmentsApi, goalsApi } from '@/lib/api'

interface FinancialSummary {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  totalInvestments: number
  totalSavings: number
  loading: boolean
}

export function useFinancialSummary(): FinancialSummary {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalInvestments: 0,
    totalSavings: 0,
    loading: true
  })

  useEffect(() => {
    async function calculateSummary() {
      try {
        // Buscar transações
        const transactions = await transactionsApi.getTransactions()
        
        // Calcular receitas e despesas
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0)
        
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0)
        
        // Buscar investimentos
        const investments = await investmentsApi.getInvestments()
        const totalInvestments = investments
          .reduce((sum, inv) => sum + (inv.quantity * (inv.current_price || inv.avg_price)), 0)
        
        // Buscar metas (economia)
        const goals = await goalsApi.getGoals()
        const totalSavings = goals
          .reduce((sum, goal) => sum + goal.current_amount, 0)
        
        // Calcular saldo total
        const totalBalance = income - expenses + totalInvestments + totalSavings
        
        setSummary({
          totalBalance,
          totalIncome: income,
          totalExpenses: expenses,
          totalInvestments,
          totalSavings,
          loading: false
        })
        
      } catch (error) {
        console.error('Erro ao calcular resumo financeiro:', error)
        // Se não autenticado, usar valores padrão
        setSummary({
          totalBalance: 0,
          totalIncome: 0,
          totalExpenses: 0,
          totalInvestments: 0,
          totalSavings: 0,
          loading: false
        })
      }
    }

    calculateSummary()
  }, [])

  return summary
}