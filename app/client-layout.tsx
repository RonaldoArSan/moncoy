"use client"

import type React from "react"
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
  const pathname = usePathname()

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname?.startsWith("/admin/login")

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SettingsProvider>
        <UserPlanProvider>
          {isAuthPage ? (
            <main className="min-h-screen bg-background">{children}</main>
        ) : (
          <div className="flex h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <Header />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        )}
        </UserPlanProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
