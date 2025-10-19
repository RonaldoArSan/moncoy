
import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { supabase } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'
import type { UserSettings, User } from '@/lib/supabase/types'

export function useSettings() {
  const { userProfile: user, loading: authLoading, updateProfile } = useAuth()
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    try {
      if (!user) {
        setSettings(null)
        setLoading(false)
        return
      }

      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      
      setSettings(userSettings)
    } catch (error) {
      logger.error('Erro ao carregar configurações do usuário:', error)
      setSettings(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      loadSettings()
    }
  }, [user?.id, authLoading])

  const updateUser = async (updates: Partial<User> | null) => {
    try {
      if (!user || !updates) return
      
      // Se está atualizando email, atualizar no Supabase Auth também
      if (updates.email && updates.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: updates.email
        })
        if (authError) throw authError
      }
      
      const result = await updateProfile(updates)
      if (result.success) {
        return user
      }
      throw new Error(result.error || 'Erro ao atualizar usuário')
    } catch (error: any) {
      logger.error('Erro ao atualizar usuário:', error)
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
      logger.error('Erro ao atualizar configurações:', error)
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
      logger.error('Erro ao carregar contas bancárias:', error)
      return []
    }
  }

  return {
    user,
    settings,
    loading: authLoading || loading,
    updateUser,
    updateSettings,
    getBankAccounts,
    refreshData: loadSettings
  }
}
