"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { logger } from '@/lib/logger'

export type UserPlan = "basic" | "pro" | "premium"

export interface UserPlanFeatures {
  aiModel: string
  aiQuestionsLimit: number | null // null = unlimited
  monthlyReport: 'none' | 'simple' | 'detailed' | 'advanced'
  advancedAnalysis: number // per month
  conversationHistory: boolean
  pdfReports: boolean
  spendingAlerts: boolean
  mobileAccess: boolean
  supportLevel: 'email' | 'email_whatsapp' | 'priority'
}

interface UserPlanContextType {
  currentPlan: UserPlan
  features: UserPlanFeatures
  isFeatureAvailable: (feature: keyof UserPlanFeatures) => boolean
  upgradeToProfessional: () => Promise<void>
  downgradeToBasic: () => Promise<void>
}

const planFeatures: Record<UserPlan, UserPlanFeatures> = {
  basic: {
    aiModel: 'gpt-4o-mini',
    aiQuestionsLimit: 5, // per week
    monthlyReport: 'simple',
    advancedAnalysis: 0,
    conversationHistory: false,
    pdfReports: false,
    spendingAlerts: false,
    mobileAccess: false,
    supportLevel: 'email'
  },
  pro: {
    aiModel: 'gpt-4o-mini',
    aiQuestionsLimit: 7, // per week (1 per day)
    monthlyReport: 'detailed',
    advancedAnalysis: 1,
    conversationHistory: true,
    pdfReports: true,
    spendingAlerts: true,
    mobileAccess: true,
    supportLevel: 'email_whatsapp'
  },
  premium: {
    aiModel: 'gpt-4o',
    aiQuestionsLimit: 50, // per month
    monthlyReport: 'advanced',
    advancedAnalysis: 1,
    conversationHistory: true,
    pdfReports: true,
    spendingAlerts: true,
    mobileAccess: true,
    supportLevel: 'priority'
  }
}

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined)

export function UserPlanProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<UserPlan>("basic")
  const [isLoaded, setIsLoaded] = useState(false)

  const features = planFeatures[currentPlan]

  const isFeatureAvailable = (feature: keyof UserPlanFeatures): boolean => {
    const featureValue = features[feature]
    if (typeof featureValue === "boolean") {
      return featureValue
    }
    if (typeof featureValue === "number") {
      return featureValue > 0
    }
    if (featureValue === null) {
      return true // null means unlimited/available
    }
    if (Array.isArray(featureValue)) {
      return featureValue.length > 0
    }
    return false
  }

  const upgradeToProfessional = async () => {
    try {
      // Verificar se estamos no browser
      if (typeof window === 'undefined') {
        throw new Error('Checkout só pode ser iniciado no cliente')
      }

      // Redirecionar para Stripe checkout
      const { redirectToStripeCheckout, STRIPE_CONFIG } = await import('@/lib/stripe-config')
      
      if (!STRIPE_CONFIG?.prices?.PRO) {
        throw new Error('Configuração do Stripe não encontrada')
      }

      // Iniciar checkout
      await redirectToStripeCheckout(STRIPE_CONFIG.prices.PRO)
    } catch (error) {
      logger.error('Erro ao processar plano:', error)
      // Fallback: tentar atualizar diretamente (para desenvolvimento)
      try {
        const { userApi } = await import('@/lib/api')
        await userApi.updateUser({ plan: 'professional' })
        setCurrentPlan("pro")
      } catch (fallbackError) {
        logger.error('Erro ao atualizar plano:', fallbackError)
      }
    }
  }

  const downgradeToBasic = async () => {
    try {
      const { userApi } = await import('@/lib/api')
      await userApi.updateUser({ plan: 'basic' })
      setCurrentPlan("basic")
    } catch (error) {
      logger.error('Erro ao atualizar plano:', error)
    }
  }

  useEffect(() => {
    // Load user plan from Supabase - only once on mount
    if (isLoaded) return
    
    async function loadUserPlan() {
      try {
        // First check localStorage for quick initial state
        const savedPlan = localStorage.getItem("userPlan") as UserPlan
        if (savedPlan && ["basic", "pro", "premium"].includes(savedPlan)) {
          setCurrentPlan(savedPlan)
        }

        const { userApi } = await import('@/lib/api')
        const user = await userApi.getCurrentUser()
        if (user?.plan) {
          // Map database plan to context plan
          const planMapping: Record<string, UserPlan> = {
            'basic': 'basic',
            'professional': 'pro',
            'premium': 'premium'
          }
          const mappedPlan = planMapping[user.plan] || 'basic'
          setCurrentPlan(mappedPlan)
        }
      } catch (error) {
        logger.error('Erro ao carregar plano do usuário:', error)
      } finally {
        setIsLoaded(true)
      }
    }
    
    loadUserPlan()
  }, [isLoaded])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("userPlan", currentPlan)
    }
  }, [currentPlan, isLoaded])

  return (
    <UserPlanContext.Provider
      value={{
        currentPlan,
        features,
        isFeatureAvailable,
        upgradeToProfessional,
        downgradeToBasic,
      }}
    >
      {children}
    </UserPlanContext.Provider>
  )
}

export function useUserPlan() {
  const context = useContext(UserPlanContext)
  if (context === undefined) {
    throw new Error("useUserPlan must be used within a UserPlanProvider")
  }
  return context
}

export function useFeatureAccess(feature: keyof UserPlanFeatures) {
  const { isFeatureAvailable } = useUserPlan()
  return isFeatureAvailable(feature)
}

export function usePlanInfo() {
  const { currentPlan } = useUserPlan()

  const planInfo = {
    basic: {
      name: "Básico",
      price: "R$ 19,90/mês",
      color: "secondary" as const,
    },
    pro: {
      name: "Pro",
      price: "R$ 49,90/mês",
      color: "default" as const,
    },
    premium: {
      name: "Premium",
      price: "R$ 59,90/mês",
      color: "destructive" as const,
    },
  }

  return {
    ...planInfo[currentPlan],
    isPro: currentPlan === "pro",
    isPremium: currentPlan === "premium",
    isBasic: currentPlan === "basic",
  }
}
