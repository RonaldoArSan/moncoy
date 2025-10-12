import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export interface Budget {
  id: string
  user_id: string
  name: string
  description?: string
  total_amount: number
  spent_amount: number
  period_type: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
  budget_categories?: BudgetCategory[]
}

export interface BudgetCategory {
  id: string
  budget_id: string
  category_id: string
  allocated_amount: number
  spent_amount: number
  categories?: {
    id: string
    name: string
    color: string
  }
}

export interface CreateBudgetData {
  name: string
  description?: string
  total_amount: number
  period_type?: string
  start_date: string
  end_date: string
  categories?: Array<{
    category_id: string
    allocated_amount: number
  }>
}

export function useBudgets() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgets = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/financial/budgets?user_id=${user.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar orçamentos')
      }

      setBudgets(data.budgets)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar orçamentos:', err)
    } finally {
      setLoading(false)
    }
  }

  const createBudget = async (budgetData: CreateBudgetData) => {
    if (!user?.id) throw new Error('Usuário não autenticado')

    try {
      const response = await fetch('/api/financial/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...budgetData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar orçamento')
      }

      await fetchBudgets() // Recarregar lista
      return data.budget
    } catch (err: any) {
      console.error('Erro ao criar orçamento:', err)
      throw err
    }
  }

  const updateBudget = async (id: string, updateData: Partial<Budget>) => {
    try {
      const response = await fetch('/api/financial/budgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar orçamento')
      }

      await fetchBudgets() // Recarregar lista
      return data.budget
    } catch (err: any) {
      console.error('Erro ao atualizar orçamento:', err)
      throw err
    }
  }

  const deleteBudget = async (id: string) => {
    try {
      const response = await fetch(`/api/financial/budgets?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar orçamento')
      }

      await fetchBudgets() // Recarregar lista
    } catch (err: any) {
      console.error('Erro ao deletar orçamento:', err)
      throw err
    }
  }

  const getBudgetProgress = (budget: Budget) => {
    if (budget.total_amount === 0) return 0
    return Math.min((budget.spent_amount / budget.total_amount) * 100, 100)
  }

  const getRemainingAmount = (budget: Budget) => {
    return Math.max(budget.total_amount - budget.spent_amount, 0)
  }

  const getBudgetStatus = (budget: Budget) => {
    const progress = getBudgetProgress(budget)
    if (progress >= 100) return 'exceeded'
    if (progress >= 80) return 'warning'
    if (progress >= 50) return 'normal'
    return 'low'
  }

  useEffect(() => {
    fetchBudgets()
  }, [user?.id])

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetProgress,
    getRemainingAmount,
    getBudgetStatus
  }
}