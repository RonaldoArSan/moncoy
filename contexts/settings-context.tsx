"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useSettings } from "@/hooks/use-settings"

type SettingsContextType = ReturnType<typeof useSettings>

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = useSettings()
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider")
  }
  return context
}
