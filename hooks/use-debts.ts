import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export interface Debt {
  id: string
  user_id: string
  name: string
  description?: string
  original_amount: number
  current_balance: number
  interest_rate: number
  minimum_payment: number
  due_date?: string
  debt_type: string
  creditor?: string
  is_active: boolean
  created_at: string
  updated_at: string
  debt_payments?: DebtPayment[]
}

export interface DebtPayment {
  id: string
  debt_id: string
  amount: number
  payment_date: string
  payment_type: string
  notes?: string
  created_at: string
}

export interface CreateDebtData {
  name: string
  description?: string
  original_amount: number
  current_balance: number
  interest_rate?: number
  minimum_payment?: number
  due_date?: string
  debt_type?: string
  creditor?: string
}

export interface CreatePaymentData {
  debt_id: string
  amount: number
  payment_date: string
  payment_type?: string
  notes?: string
}

export function useDebts() {
  const { user } = useAuth()
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDebts = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/financial/debts?user_id=${user.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar dívidas')
      }

      setDebts(data.debts)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar dívidas:', err)
    } finally {
      setLoading(false)
    }
  }

  const createDebt = async (debtData: CreateDebtData) => {
    if (!user?.id) throw new Error('Usuário não autenticado')

    try {
      const response = await fetch('/api/financial/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...debtData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar dívida')
      }

      await fetchDebts() // Recarregar lista
      return data.debt
    } catch (err: any) {
      console.error('Erro ao criar dívida:', err)
      throw err
    }
  }

  const updateDebt = async (id: string, updateData: Partial<Debt>) => {
    try {
      const response = await fetch('/api/financial/debts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar dívida')
      }

      await fetchDebts() // Recarregar lista
      return data.debt
    } catch (err: any) {
      console.error('Erro ao atualizar dívida:', err)
      throw err
    }
  }

  const payOffDebt = async (id: string) => {
    try {
      const response = await fetch(`/api/financial/debts?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao quitar dívida')
      }

      await fetchDebts() // Recarregar lista
    } catch (err: any) {
      console.error('Erro ao quitar dívida:', err)
      throw err
    }
  }

  const addPayment = async (paymentData: CreatePaymentData) => {
    try {
      const response = await fetch('/api/financial/debt-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar pagamento')
      }

      await fetchDebts() // Recarregar lista para atualizar saldos
      return data
    } catch (err: any) {
      console.error('Erro ao registrar pagamento:', err)
      throw err
    }
  }

  const getPayments = async (debtId: string) => {
    try {
      const response = await fetch(`/api/financial/debt-payments?debt_id=${debtId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar pagamentos')
      }

      return data.payments
    } catch (err: any) {
      console.error('Erro ao buscar pagamentos:', err)
      throw err
    }
  }

  const getTotalDebt = () => {
    return debts.reduce((total, debt) => total + debt.current_balance, 0)
  }

  const getTotalOriginalDebt = () => {
    return debts.reduce((total, debt) => total + debt.original_amount, 0)
  }

  const getDebtProgress = (debt: Debt) => {
    if (debt.original_amount === 0) return 100
    const paid = debt.original_amount - debt.current_balance
    return Math.max((paid / debt.original_amount) * 100, 0)
  }

  const getPayoffEstimate = (debt: Debt) => {
    if (debt.minimum_payment <= 0 || debt.current_balance <= 0) return null
    
    const monthlyRate = debt.interest_rate / 100 / 12
    if (monthlyRate === 0) {
      return Math.ceil(debt.current_balance / debt.minimum_payment)
    }

    // Fórmula para calcular tempo de quitação com juros
    const months = Math.log(1 + (debt.current_balance * monthlyRate) / debt.minimum_payment) / 
                   Math.log(1 + monthlyRate)
    
    return Math.ceil(months)
  }

  const getDebtStatus = (debt: Debt) => {
    if (!debt.is_active) return 'paid'
    
    const progress = getDebtProgress(debt)
    if (progress >= 75) return 'good'
    if (progress >= 50) return 'normal'
    if (progress >= 25) return 'warning'
    return 'critical'
  }

  const getMonthlyPayments = () => {
    return debts.reduce((total, debt) => total + debt.minimum_payment, 0)
  }

  useEffect(() => {
    fetchDebts()
  }, [user?.id])

  return {
    debts,
    loading,
    error,
    fetchDebts,
    createDebt,
    updateDebt,
    payOffDebt,
    addPayment,
    getPayments,
    getTotalDebt,
    getTotalOriginalDebt,
    getDebtProgress,
    getPayoffEstimate,
    getDebtStatus,
    getMonthlyPayments
  }
}