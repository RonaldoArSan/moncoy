import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export interface FinancialAccount {
  id: string
  user_id: string
  name: string
  account_type: string
  institution?: string
  currency: string
  current_balance: number
  credit_limit: number
  is_active: boolean
  account_number?: string
  routing_number?: string
  created_at: string
  updated_at: string
}

export interface CreateAccountData {
  name: string
  account_type: string
  institution?: string
  currency?: string
  current_balance?: number
  credit_limit?: number
  account_number?: string
  routing_number?: string
}

export function useFinancialAccounts() {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<FinancialAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const response = await fetch(`/api/financial/accounts?user_id=${user.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar contas')
      }

      setAccounts(data.accounts)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar contas:', err)
    } finally {
      setLoading(false)
    }
  }

  const createAccount = async (accountData: CreateAccountData) => {
    if (!user?.id) throw new Error('Usuário não autenticado')

    try {
      const response = await fetch('/api/financial/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...accountData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta')
      }

      await fetchAccounts() // Recarregar lista
      return data.account
    } catch (err: any) {
      console.error('Erro ao criar conta:', err)
      throw err
    }
  }

  const updateAccount = async (id: string, updateData: Partial<FinancialAccount>) => {
    try {
      const response = await fetch('/api/financial/accounts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updateData })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar conta')
      }

      await fetchAccounts() // Recarregar lista
      return data.account
    } catch (err: any) {
      console.error('Erro ao atualizar conta:', err)
      throw err
    }
  }

  const deleteAccount = async (id: string) => {
    try {
      const response = await fetch(`/api/financial/accounts?id=${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar conta')
      }

      await fetchAccounts() // Recarregar lista
    } catch (err: any) {
      console.error('Erro ao deletar conta:', err)
      throw err
    }
  }

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => {
      if (account.account_type === 'credit') {
        return total - account.current_balance // Cartão de crédito é dívida
      }
      return total + account.current_balance
    }, 0)
  }

  const getAccountsByType = (type: string) => {
    return accounts.filter(account => account.account_type === type)
  }

  const getCreditUtilization = () => {
    const creditAccounts = getAccountsByType('credit')
    const totalLimit = creditAccounts.reduce((sum, acc) => sum + acc.credit_limit, 0)
    const totalUsed = creditAccounts.reduce((sum, acc) => sum + acc.current_balance, 0)
    
    if (totalLimit === 0) return 0
    return (totalUsed / totalLimit) * 100
  }

  const getAccountStatus = (account: FinancialAccount) => {
    if (account.account_type === 'credit') {
      const utilization = account.credit_limit > 0 
        ? (account.current_balance / account.credit_limit) * 100 
        : 0
      
      if (utilization >= 90) return 'critical'
      if (utilization >= 70) return 'warning'
      return 'normal'
    }

    if (account.current_balance < 0) return 'negative'
    if (account.current_balance < 100) return 'low'
    return 'normal'
  }

  useEffect(() => {
    fetchAccounts()
  }, [user?.id])

  return {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    getTotalBalance,
    getAccountsByType,
    getCreditUtilization,
    getAccountStatus
  }
}