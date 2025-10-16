import { useAuth } from '@/components/auth-provider'

/**
 * @deprecated Use useAuth() from @/components/auth-provider instead
 * This hook is kept for backward compatibility only
 */
export function useUser() {
  const { userProfile: user, loading } = useAuth()

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
    setUser: () => {
      console.warn('setUser is deprecated, use updateProfile from useAuth instead')
    },
    loading,
    getDaysSinceRegistration,
    canUseAI
  }
}