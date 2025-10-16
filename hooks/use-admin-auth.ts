"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  last_login?: string
}

export function useAdminAuth() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    verifySession()
  }, [])

  const verifySession = async () => {
    try {
      const response = await fetch('/api/admin/auth/verify')
      const result = await response.json()

      if (result.success && result.user) {
        setAdminUser(result.user)
      } else {
        setAdminUser(null)
      }
    } catch (error) {
      console.error('Admin session verification error:', error)
      setAdminUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' })
      setAdminUser(null)
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Admin logout error:', error)
    }
  }

  return {
    adminUser,
    loading,
    isAuthenticated: !!adminUser,
    isSuperAdmin: adminUser?.role === 'super_admin',
    logout,
    refreshSession: verifySession
  }
}
