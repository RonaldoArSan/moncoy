import { useState, useEffect } from 'react'
import { userApi } from '@/lib/api'
import supabase from '@/lib/supabase'
import type { User } from '@/lib/supabase/types'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      try {
        const userData = await userApi.getCurrentUser()
        setUser(userData)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const userData = await userApi.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Error fetching user on auth change:', error)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const getDaysSinceRegistration = () => {
    if (!user?.registration_date) return 0
    const registrationDate = new Date(user.registration_date)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - registrationDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const canUseAI = () => {
    if (!user?.plan) return false
    if (user.plan === 'basic') return false
    if (user.plan === 'professional') {
      return getDaysSinceRegistration() > 22
    }
    return false
  }

  return {
    user,
    setUser,
    loading,
    getDaysSinceRegistration,
    canUseAI
  }
}