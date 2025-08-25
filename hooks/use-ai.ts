import { useState } from 'react'
import { useUserPlan } from '@/contexts/user-plan-context'
import { useSettingsContext } from '@/contexts/settings-context'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [usage, setUsage] = useState({ remaining: 0, resetDate: new Date() })
  const { currentPlan } = useUserPlan()
  const { user } = useSettingsContext()

  const analyzeTransactions = async (transactions: any[], type: string) => {
    // Verificação de tempo de uso para plano básico
    if (currentPlan === 'basic' && user?.registration_date) {
      const registrationDate = new Date(user.registration_date)
      const now = new Date()
      const diffDays = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays < 22) {
        throw new Error('As análises de IA estarão disponíveis após 22 dias de uso. Continue utilizando para desbloquear esta funcionalidade!')
      }
      // TODO: Verificar limite de 5 perguntas por semana
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
          userPlan: currentPlan,
          userId: user?.id
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro na análise de IA')
      }

      const result = await response.json()
      if (result.usage) {
        setUsage(result.usage)
      }
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
    usage,
    isAvailable: ['basic', 'pro', 'premium'].includes(currentPlan)
  }
}