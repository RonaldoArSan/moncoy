"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserPlan = "basic" | "professional"

export interface UserPlanFeatures {
  maxTransactions: number | null // null = unlimited
  aiAdvice: boolean
  receiptAnalysis: boolean
  advancedReports: boolean
  prioritySupport: boolean
  customCategories: boolean
  bankConnections: number | null // null = unlimited
  exportFormats: string[]
  twoFactorAuth: boolean
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
    maxTransactions: null, // unlimited
    aiAdvice: false,
    receiptAnalysis: false,
    advancedReports: false,
    prioritySupport: false,
    customCategories: true,
    bankConnections: 0,
    exportFormats: [],
    twoFactorAuth: false,
  },
  professional: {
    maxTransactions: null, // unlimited
    aiAdvice: true,
    receiptAnalysis: true,
    advancedReports: true,
    prioritySupport: true,
    customCategories: true,
    bankConnections: null, // unlimited
    exportFormats: ["CSV", "Excel", "PDF"],
    twoFactorAuth: true,
  },
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

  const upgradeToProfessional = () => {
    setCurrentPlan("professional")
    // In real app, this would call API to upgrade plan
  }

  const downgradeToBasic = () => {
    setCurrentPlan("basic")
    // In real app, this would call API to downgrade plan
  }

  useEffect(() => {
    // Load user plan from localStorage only
    const savedPlan = localStorage.getItem("userPlan") as UserPlan
    if (savedPlan && (savedPlan === "basic" || savedPlan === "professional")) {
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
      name: "Plano Básico",
      price: "Gratuito",
      color: "secondary" as const,
    },
    professional: {
      name: "Plano Profissional",
      price: "R$ 29,90/mês",
      color: "default" as const,
    },
  }

  return {
    ...planInfo[currentPlan],
    isProfessional: currentPlan === "professional",
    isBasic: currentPlan === "basic",
  }
}
