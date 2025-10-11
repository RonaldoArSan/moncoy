// Hook de autenticação - agora apenas uma interface para o AuthProvider
// Este hook mantém compatibilidade com código existente

import { useAuth as useAuthContext } from '@/components/auth-provider'

// Re-exportar tudo do contexto principal
export const useAuth = useAuthContext

// Manter interface de RegisterData para compatibilidade
export interface RegisterData {
  name: string
  email: string
  password: string
  plan: 'basic' | 'professional'
  openaiKey?: string
  phone?: string
  accountType?: 'personal' | 'business'
}

// Funções auxiliares para backwards compatibility se necessário
export function useAuthState() {
  const { user, userProfile, loading } = useAuthContext()
  return {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user
  }
}

export function useAuthActions() {
  const { signIn, signUp, signOut, resetPassword, signInWithGoogle } = useAuthContext()
  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle
  }
}