import { useState, useEffect } from 'react'
import { transactionsApi, investmentsApi, goalsApi } from '@/lib/api'
import type { Transaction } from '@/lib/supabase'

interface MonthlyData {
  month: string
  receitas: number
  despesas: number
  saldo: number
}

interface CategoryExpense {
  category: string
  amount: number
  percentage: number
  color: string
}

interface KPIs {
  totalReceitas: number
  totalDespesas: number
  saldoMensal: number
  economiaMedia: number
  gastoMedioDiario: number
  maiorGasto: number
}

export function useReports() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await transactionsApi.getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMonthlyData = (): MonthlyData[] => {
    const monthlyMap = new Map<string, { receitas: number; despesas: number }>()
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date)
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { receitas: 0, despesas: 0 })
      }
      
      const monthData = monthlyMap.get(monthKey)!
      if (transaction.type === 'income') {
        monthData.receitas += transaction.amount
      } else {
        monthData.despesas += Math.abs(transaction.amount)
      }
    })

    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        receitas: data.receitas,
        despesas: data.despesas,
        saldo: data.receitas - data.despesas
      }))
      .slice(-6)
  }

  const getCategoryExpenses = (): CategoryExpense[] => {
    const categoryMap = new Map<string, number>()
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-gray-500']
    
    const expenses = transactions.filter(t => t.type === 'expense')
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0)
    
    expenses.forEach(transaction => {
      const category = transaction.category?.name || 'Outros'
      categoryMap.set(category, (categoryMap.get(category) || 0) + Math.abs(transaction.amount))
    })

    return Array.from(categoryMap.entries())
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
  }

  const getTopExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 5)
      .map(t => ({
        description: t.description,
        category: t.category?.name || 'Outros',
        amount: Math.abs(t.amount),
        date: new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      }))
  }

  const getKPIs = (): KPIs => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const totalReceitas = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalDespesas = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const saldoMensal = totalReceitas - totalDespesas

    const monthlyData = getMonthlyData()
    const economiaMedia = monthlyData.length > 0 
      ? monthlyData.reduce((sum, data) => sum + data.saldo, 0) / monthlyData.length 
      : 0

    const gastoMedioDiario = totalDespesas / new Date().getDate()

    const maiorGasto = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((max, t) => Math.max(max, Math.abs(t.amount)), 0)

    return {
      totalReceitas,
      totalDespesas,
      saldoMensal,
      economiaMedia,
      gastoMedioDiario,
      maiorGasto
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return {
    loading,
    getMonthlyData,
    getCategoryExpenses,
    getTopExpenses,
    getKPIs,
    refreshData: loadData
  }
}