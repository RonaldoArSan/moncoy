"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredMode?: 'user' | 'admin' | 'public'
  redirectTo?: string
}

export function AuthGuard({ 
  children, 
  requiredMode = 'user',
  redirectTo 
}: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true)
  const { user, userProfile, loading, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return

    const checkAccess = () => {
      // Páginas públicas - não precisam de autenticação
      if (requiredMode === 'public') {
        setIsChecking(false)
        return
      }

      // Páginas de usuário - precisam estar logados
      if (requiredMode === 'user') {
        if (!user) {
          router.push(redirectTo || '/login')
          return
        }
        if (!userProfile) {
          // Ainda carregando perfil
          return
        }
        setIsChecking(false)
        return
      }

      // Páginas de admin - precisam ser admin
      if (requiredMode === 'admin') {
        if (!user) {
          router.push('/admin/login')
          return
        }
        if (!isAdmin) {
          router.push('/admin/login?error=unauthorized')
          return
        }
        setIsChecking(false)
        return
      }

      setIsChecking(false)
    }

    checkAccess()
  }, [user, userProfile, loading, isAdmin, requiredMode, router, redirectTo])

  // Loading state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {loading ? 'Verificando autenticação...' : 'Carregando...'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Guard específico para usuários
export function UserGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredMode="user">
      {children}
    </AuthGuard>
  )
}

// Guard específico para admin
export function AdminGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredMode="admin">
      {children}
    </AuthGuard>
  )
}

// Guard específico para páginas públicas
export function PublicGuard({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredMode="public">
      {children}
    </AuthGuard>
  )
}