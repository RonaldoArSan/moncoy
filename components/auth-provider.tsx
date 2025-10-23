"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { userApi } from '@/lib/api'
import { logger } from '@/lib/logger'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
import type { 
  AuthContextType, 
  AuthUser, 
  User, 
  UserSettings, 
  RegisterData, 
  AppMode 
} from '@/types/auth'

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
    } else if (
      pathname?.startsWith('/landingpage') || 
      pathname === '/privacy' || 
      pathname === '/terms' ||
      pathname === '/forgot-password' ||
      pathname === '/reset-password' ||
      pathname?.startsWith('/auth/callback')
    ) {
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
    let isProcessing = false

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted && !isProcessing) {
          if (session?.user) {
            console.log('✅ Session found:', session.user.email)
            isProcessing = true
            await handleAuthUser(session.user)
            isProcessing = false
          } else {
            console.log('❌ No session found')
            setUser(null)
            setUserProfile(null)
            setUserSettings(null)
          }
          setLoading(false)
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
        logger.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
          isProcessing = false
        }
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted || isProcessing) {
          console.log('⏭️ Skipping auth change (not mounted or processing):', event)
          return
        }

        console.log('🔔 Auth state change:', event, session?.user?.email)
        logger.dev('Auth state change:', event)

        if (event === 'SIGNED_OUT' || !session?.user) {
          console.log('👋 User signed out')
          console.log('📍 Current pathname:', pathname)
          console.log('🔧 Current mode:', mode)
          setUser(null)
          setUserProfile(null)
          setUserSettings(null)
          
          // Redirect based on mode APENAS se não estiver em página pública
          const publicRoutes = [
            '/landingpage', 
            '/privacy', 
            '/terms', 
            '/login', 
            '/register', 
            '/admin/login',
            '/forgot-password',
            '/reset-password',
            '/auth/callback'
          ]
          const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route))
          console.log('🔍 isPublicRoute check:', { pathname, isPublicRoute, publicRoutes })
          
          if (!isPublicRoute) {
            console.log('⚠️ Not a public route, redirecting based on mode:', mode)
            if (mode === 'admin') {
              console.log('↪️ Redirecting to admin login')
              router.push('/admin/login')
            } else if (mode === 'user') {
              console.log('↪️ Redirecting to user login')
              router.push('/login')
            }
          } else {
            console.log('✅ Public route detected, no redirect needed')
          }
        } else if (event === 'SIGNED_IN' && session?.user) {
          console.log('✨ User signed in:', session.user.email)
          isProcessing = true
          await handleAuthUser(session.user)
          isProcessing = false
        }
        
        setLoading(false)
      }
    )

    return () => {
      console.log('🧹 Cleaning up auth subscription')
      mounted = false
      subscription.unsubscribe()
    }
  }, [mode, router, pathname])

  // Processar usuário autenticado
  const handleAuthUser = async (authUser: any) => {
    try {
      // Evitar processamento duplo do mesmo usuário
      if (user?.id === authUser.id && userProfile) {
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
          logger.error('Error loading user profile:', error)
          // Se não conseguir carregar o perfil, criar um
          try {
            const newProfile = await userApi.createUserProfile(authUser)
            setUserProfile(newProfile)
            await loadUserSettings(newProfile.id)
          } catch (createError) {
            logger.error('Error creating user profile:', createError)
          }
        }
      }
    } catch (error) {
      logger.error('Error handling auth user:', error)
    }
  }

  // Carregar configurações do usuário
  const loadUserSettings = async (userId?: string) => {
    try {
      const id = userId || user?.id || userProfile?.id
      
      if (!id) {
        logger.warn('No user ID available for loading settings')
        return
      }

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
      logger.error('Error loading user settings:', error)
    }
  }  // Métodos de autenticação
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Validar campos antes de enviar
      if (!email || !email.trim()) {
        throw new Error('Email é obrigatório')
      }
      if (!password || !password.trim()) {
        throw new Error('Senha é obrigatória')
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })

      if (error) {
        // Melhorar mensagens de erro
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos')
        }
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Email não confirmado. Verifique sua caixa de entrada.')
        }
        throw error
      }

      return { success: true }
    } catch (error: any) {
      logger.error('Sign in error:', error)
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
      
      // Use a URL correta do site em produção
      const baseUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : process.env.NEXT_PUBLIC_SITE_URL || 'https://moncoyfinance.com'
      
      const redirectUrl = mode === 'admin' 
        ? `${baseUrl}/auth/callback?next=/admin`
        : `${baseUrl}/auth/callback`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            ...(process.env.NEXT_PUBLIC_GOOGLE_HD && { hd: process.env.NEXT_PUBLIC_GOOGLE_HD })
          },
          scopes: 'openid profile email',
          skipBrowserRedirect: false
        }
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      logger.error('Google sign in error:', error)
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
    if (!userSettings && user) {
      await loadUserSettings()
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