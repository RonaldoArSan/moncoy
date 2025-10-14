import { useState, useEffect } from 'react'
import { userApi } from '@/lib/api'
import supabase from '@/lib/supabase'
import type { User, UserSettings } from '@/lib/supabase/types'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export function useSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setUser(null)
        setSettings(null)
        return
      }

      const userData = await userApi.getCurrentUser()

      setUser(userData)

      if (userData) {
        const { data: userSettings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userData.id)
          .single()
        
        setSettings(userSettings)
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error)
      setUser(null)
      setSettings(null)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) return
      
      // Se está atualizando email, atualizar no Supabase Auth também
      if (updates.email && updates.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        })
        if (authError) throw authError
      }
      
      const updatedUser = await userApi.updateUser(updates)
      setUser(updatedUser)
      return updatedUser
    } catch (error: any) {
      console.error('Erro ao atualizar usuário:', error)
      if (error.code === '23505') {
        throw new Error('Este email já está em uso por outro usuário')
      }
      throw new Error(error.message || 'Erro ao atualizar usuário')
    }
  }

  const updateSettings = async (updates: Partial<UserSettings>) => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...updates
        })
        .select()
        .single()

      if (error) throw error
      setSettings(data)
      return data
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      throw error
    }
  }

  const getBankAccounts = async () => {
    try {
      if (!user) return []
      
      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao carregar contas bancárias:', error)
      return []
    }
  }

  useEffect(() => {
    loadUserData()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        // Reload user data when signed in
        await loadUserData()
      } else if (event === 'SIGNED_OUT') {
        // Clear data when signed out
        setUser(null)
        setSettings(null)
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    user,
    settings,
    loading,
    updateUser,
    updateSettings,
    getBankAccounts,
    refreshData: loadUserData
  }
}
