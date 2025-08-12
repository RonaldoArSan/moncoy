"use client"

import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

interface AppLayoutProps {
  children: React.ReactNode
}

const authPages = ['/login', '/register', '/forgot-password']

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isAuthPage = authPages.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}