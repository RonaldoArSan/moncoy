import { useState } from 'react'
import supabase from '@/lib/supabase'
import { userApi } from '@/lib/api'

interface RegisterData {
  name: string
  email: string
  password: string
  plan: 'basic' | 'professional'
  openaiKey?: string
}

export function useAuth() {
  const [loading, setLoading] = useState(false)

  const signUp = async (data: RegisterData) => {
    try {
      setLoading(true)
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            plan: data.plan,
            openai_key: data.openaiKey
          }
        }
      })

      if (authError) throw authError

      return { success: true, user: authData.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { success: true, user: data.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
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
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword
  }
}