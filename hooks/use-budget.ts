import { useState, useEffect } from 'react'
import { useTransactions } from './use-transactions'

interface BudgetItem {
  categoria: string
  gasto: number
  limite: number
  cor: string
}

export function useBudget() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [loading, setLoading] = useState(true)
  const { transactions, categories } = useTransactions()

  useEffect(() => {
    calculateBudget()
  }, [transactions, categories])

  const calculateBudget = () => {
    try {
      setLoading(true)
      
      // Filtrar transações do mês atual
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const monthlyTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               t.type === 'expense'
      })

      // Agrupar gastos por categoria
      const categorySpending: { [key: string]: number } = {}
      
      monthlyTransactions.forEach(transaction => {
        const categoryName = transaction.category?.name || 'Outros'
        categorySpending[categoryName] = (categorySpending[categoryName] || 0) + transaction.amount
      })

      // Definir limites padrão baseados nos gastos (150% do gasto atual ou mínimo R$ 300)
      const colors = ['bg-primary-500', 'bg-secondary-500', 'bg-warning-500', 'bg-success-500', 'bg-purple-500']
      
      const budgetData = Object.entries(categorySpending)
        .slice(0, 4) // Mostrar apenas as 4 principais categorias
        .map(([categoria, gasto], index) => ({
          categoria,
          gasto: Math.abs(gasto),
          limite: Math.max(Math.abs(gasto) * 1.5, 300),
          cor: colors[index % colors.length]
        }))

      // Se não há dados suficientes, mostrar categorias padrão
      if (budgetData.length === 0) {
        setBudgetItems([
          { categoria: "Alimentação", gasto: 0, limite: 1200, cor: "bg-primary-500" },
          { categoria: "Transporte", gasto: 0, limite: 600, cor: "bg-secondary-500" },
          { categoria: "Lazer", gasto: 0, limite: 400, cor: "bg-warning-500" },
          { categoria: "Saúde", gasto: 0, limite: 300, cor: "bg-success-500" },
        ])
      } else {
        setBudgetItems(budgetData)
      }
    } catch (error) {
      console.error('Erro ao calcular orçamento:', error)
      setBudgetItems([])
    } finally {
      setLoading(false)
    }
  }

  return {
    budgetItems,
    loading
  }
}