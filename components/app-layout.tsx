"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

interface AppLayoutProps {
  children: React.ReactNode
}

const authPages = ['/login', '/register', '/forgot-password']

export function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}