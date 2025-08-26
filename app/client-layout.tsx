"use client"

import type React from "react"
import { useState } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { UserPlanProvider } from "@/contexts/user-plan-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { usePathname } from "next/navigation"
import "./globals.css"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/admin") ||
    pathname === "/landingpage" ||
    pathname === "/privacy" ||
    pathname === "/terms"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SettingsProvider>
        <UserPlanProvider>
          {isAuthPage ? (
            <main className="min-h-screen bg-background">{children}</main>
          ) : (
            <div className="flex h-screen bg-background">
              <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <div className="flex flex-1 flex-col">
                <Header onMenuClick={() => setIsSidebarOpen(prev => !prev)} />
                <main className="flex-1 overflow-auto p-6">{children}</main>
              </div>
            </div>
          )}
        </UserPlanProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
