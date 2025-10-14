"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { userApi } from '@/lib/api'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import type { 
  AuthContextType, 
  AuthUser, 
  User, 
  UserSettings, 
  RegisterData, 
  AppMode 
} from '@/types/auth'

const supabase = createClient()

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Admin emails - isso deveria vir de uma configuração mais segura
const ADMIN_EMAILS = [
  'admin@financeira.com',
  'ronald@financeira.com',
  process.env.NEXT_PUBLIC_ADMIN_EMAIL
].filter(Boolean)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<AppMode>('public')
  
  const router = useRouter()
  const pathname = usePathname()

  // Determinar o modo da aplicação baseado na URL
  useEffect(() => {
    if (pathname?.startsWith('/admin')) {
      setMode('admin')
    } else if (pathname?.startsWith('/landingpage') || pathname === '/privacy' || pathname === '/terms') {
      setMode('public')
    } else {
      setMode('user')
    }
  }, [pathname])

  // Verificar se é admin
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false

  // Inicializar sessão
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          if (session?.user) {
            await handleAuthUser(session.user)
          } else {
            setUser(null)
            setUserProfile(null)
            setUserSettings(null)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return

        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null)
          setUserProfile(null)
          setUserSettings(null)
          
          // Redirect based on mode
          if (mode === 'admin') {
            router.push('/admin/login')
          } else if (mode === 'user') {
            router.push('/login')
          }
        } else if (event === 'SIGNED_IN' && session?.user) {
          await handleAuthUser(session.user)
        }
        
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [mode, router])

  // Processar usuário autenticado
  const handleAuthUser = async (authUser: any) => {
    try {
      console.log('handleAuthUser called for:', authUser.email)
      
      // Evitar processamento duplo do mesmo usuário
      if (user?.id === authUser.id) {
        console.log('User already processed, skipping')
        return
      }

      const formattedUser: AuthUser = {
        id: authUser.id,
        email: authUser.email || '',
        user_metadata: authUser.user_metadata || {},
        role: authUser.role,
        aud: authUser.aud,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at
      }

      setUser(formattedUser)

      // Carregar perfil do usuário (exceto para modo público)
      if (mode !== 'public') {
        try {
          const profile = await userApi.getCurrentUser()
          setUserProfile(profile)

          // Carregar configurações do usuário
          if (profile) {
            await loadUserSettings(profile.id)
          }
        } catch (error) {
          console.error('Error loading user profile:', error)
          // Se não conseguir carregar o perfil, criar um
          try {
            const newProfile = await userApi.createUserProfile(authUser)
            setUserProfile(newProfile)
            await loadUserSettings(newProfile.id)
          } catch (createError) {
            console.error('Error creating user profile:', createError)
          }
        }
      }
    } catch (error) {
      console.error('Error handling auth user:', error)
    }
  }

  // Carregar configurações do usuário
  const loadUserSettings = async (userId?: string) => {
    try {
      const id = userId || user?.id || userProfile?.id
      
      if (!id) {
        console.warn('No user ID available for loading settings')
        return
      }

      console.log('Loading user settings for ID:', id)

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setUserSettings(data || null)
    } catch (error) {
      console.error('Error loading user settings:', error)
    }
  }

  // Métodos de autenticação
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: RegisterData) => {
    try {
      setLoading(true)
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            full_name: data.name,
            plan: data.plan,
            openai_key: data.openaiKey,
            phone: data.phone,
            account_type: data.accountType
          }
        }
      })

      if (authError) throw authError

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      
      const redirectUrl = mode === 'admin' 
        ? `${window.location.origin}/admin`
        : `${window.location.origin}/`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            ...(process.env.NEXT_PUBLIC_GOOGLE_HD && { hd: process.env.NEXT_PUBLIC_GOOGLE_HD })
          },
          scopes: 'openid profile email'
        }
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signInAsAdmin = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Verificar se o email é de admin
      if (!ADMIN_EMAILS.includes(email)) {
        throw new Error('Email não autorizado para acesso administrativo')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Verificar novamente após login
      if (!ADMIN_EMAILS.includes(data.user.email || '')) {
        await supabase.auth.signOut()
        throw new Error('Usuário não possui permissões administrativas')
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      
      const redirectUrl = mode === 'admin'
        ? `${window.location.origin}/admin/reset-password`
        : `${window.location.origin}/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Métodos de perfil
  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      const updatedProfile = await userApi.updateUser(updates)
      setUserProfile(updatedProfile)

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const getUserSettings = async (): Promise<UserSettings | null> => {
    if (!userSettings && (user || userProfile)) {
      await loadUserSettings(user?.id || userProfile?.id)
    }
    return userSettings
  }

  const updateUserSettings = async (updates: Partial<UserSettings>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado')

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: user.id,
          ...updates 
        }, { 
          onConflict: 'user_id' 
        })
        .select()
        .single()

      if (error) throw error

      setUserSettings(data)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    isAdmin,
    signIn,
    signUp,
    signInWithGoogle,
    signInAsAdmin,
    signOut,
    resetPassword,
    updateProfile,
    getUserSettings,
    updateUserSettings
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}