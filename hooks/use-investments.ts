import { useState, useEffect } from 'react'
import { investmentsApi, categoriesApi } from '@/lib/api'
import type { Investment, Category, InvestmentTransaction } from '@/lib/supabase/types'

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([])
  const [investmentTransactions, setInvestmentTransactions] = useState<InvestmentTransaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const loadInvestments = async () => {
    try {
      setLoading(true)
      const [investmentsData, transactionsData] = await Promise.all([
        investmentsApi.getInvestments(),
        investmentsApi.getInvestmentTransactions()
      ])
      setInvestments(investmentsData)
      setInvestmentTransactions(transactionsData)
    } catch (error) {
      console.error('Erro ao carregar investimentos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getCategories('investment')
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const createInvestment = async (investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newInvestment = await investmentsApi.createInvestment(investment)
      setInvestments(prev => [newInvestment, ...prev])
      return newInvestment
    } catch (error) {
      console.error('Erro ao criar investimento:', error)
      throw error
    }
  }

  const createInvestmentTransaction = async (transaction: Omit<InvestmentTransaction, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const newTransaction = await investmentsApi.createInvestmentTransaction(transaction)
      setInvestmentTransactions(prev => [newTransaction, ...prev])
      // Recarregar investimentos para atualizar posições
      await loadInvestments()
      return newTransaction
    } catch (error) {
      console.error('Erro ao criar transação de investimento:', error)
      throw error
    }
  }

  const deleteInvestment = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este investimento?')) {
      return
    }
    
    try {
      await investmentsApi.deleteInvestment(id)
      setInvestments(prev => prev.filter(inv => inv.id !== id))
    } catch (error) {
      console.error('Erro ao excluir investimento:', error)
      alert('Erro ao excluir investimento')
    }
  }

  const calculatePortfolioSummary = () => {
    const totalInvested = investments.reduce((sum, inv) => sum + ((inv.quantity ?? 0) * inv.avg_price), 0)
    const totalValue = investments.reduce((sum, inv) => sum + ((inv.quantity ?? 0) * (inv.current_price || inv.avg_price)), 0)
    const totalGain = totalValue - totalInvested
    const gainPercentage = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0

    return {
      totalInvested,
      totalValue,
      totalGain,
      gainPercentage
    }
  }

  const getAssetTypeDistribution = () => {
    const distribution = investments.reduce((acc, inv) => {
      const value = (inv.quantity ?? 0) * (inv.current_price || inv.avg_price)
      if (!acc[inv.asset_type]) {
        acc[inv.asset_type] = { value: 0, count: 0 }
      }
      acc[inv.asset_type].value += value
      acc[inv.asset_type].count += 1
      return acc
    }, {} as Record<string, { value: number; count: number }>)

    const totalValue = Object.values(distribution).reduce((sum, item) => sum + item.value, 0)
    
    return Object.entries(distribution).map(([type, data]) => ({
      type,
      value: data.value,
      percentage: totalValue > 0 ? (data.value / totalValue) * 100 : 0,
      count: data.count
    }))
  }

  useEffect(() => {
    loadInvestments()
    loadCategories()
  }, [])

  return {
    investments,
    investmentTransactions,
    categories,
    loading,
    createInvestment,
    createInvestmentTransaction,
    deleteInvestment,
    calculatePortfolioSummary,
    getAssetTypeDistribution,
    refreshInvestments: loadInvestments
  }
}