"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

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
  upgradeToProfessional: () => void
  downgradeToBasic: () => void
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

  const upgradeToPro = () => {
    setCurrentPlan("pro")
  }

  const upgradeToPremium = () => {
    setCurrentPlan("premium")
  }

  const downgradeTo = (plan: UserPlan) => {
    setCurrentPlan(plan)
  }

  useEffect(() => {
    // Load user plan from localStorage only
    const savedPlan = localStorage.getItem("userPlan") as UserPlan
    if (savedPlan && ["basic", "pro", "premium"].includes(savedPlan)) {
      setCurrentPlan(savedPlan)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("userPlan", currentPlan)
  }, [currentPlan])

  return (
    <UserPlanContext.Provider
      value={{
        currentPlan,
        features,
        isFeatureAvailable,
        upgradeToPro,
        upgradeToPremium,
        downgradeTo,
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
