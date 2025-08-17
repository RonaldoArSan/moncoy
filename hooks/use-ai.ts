import { useState } from 'react'
import { useUserPlan } from '@/contexts/user-plan-context'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const { currentPlan } = useUserPlan()

  const analyzeTransactions = async (transactions: any[], type: string) => {
    if (currentPlan !== 'professional') {
      throw new Error('IA disponível apenas no Plano Profissional')
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions,
          type,
          userPlan: currentPlan
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro na análise de IA')
      }

      const result = await response.json()
      return result.analysis
    } catch (error) {
      console.error('AI Analysis Error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    analyzeTransactions,
    loading,
    isAvailable: currentPlan === 'professional'
  }
}