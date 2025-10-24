import { renderHook, waitFor } from '@testing-library/react'
import { useUserPlan } from '@/contexts/user-plan-context'
import { mockUser, mockProUser, mockPremiumUser } from '../utils/test-utils'

// Mock dependencies
jest.mock('@/components/auth-provider', () => ({
  useAuth: jest.fn()
}))

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn()
  }
}))

describe('UserPlanContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  describe('Plan Features', () => {
    it('should return correct features for basic plan', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })

      const { result } = renderHook(() => useUserPlan())

      expect(result.current.currentPlan).toBe('basic')
      expect(result.current.features).toMatchObject({
        aiEnabled: true,
        aiQuestionsPerWeek: 5,
        exportReports: false,
        prioritySupport: false
      })
    })

    it('should return correct features for professional plan', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockProUser,
        loading: false
      })

      const { result } = renderHook(() => useUserPlan())

      expect(result.current.currentPlan).toBe('professional')
      expect(result.current.features).toMatchObject({
        aiEnabled: true,
        aiQuestionsPerWeek: 7,
        exportReports: true,
        prioritySupport: false
      })
    })

    it('should return correct features for premium plan', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockPremiumUser,
        loading: false
      })

      const { result } = renderHook(() => useUserPlan())

      expect(result.current.currentPlan).toBe('premium')
      expect(result.current.features).toMatchObject({
        aiEnabled: true,
        aiQuestionsPerMonth: 50,
        exportReports: true,
        prioritySupport: true,
        advancedAnalytics: true
      })
    })
  })

  describe('Plan Features Availability', () => {
    it('should have correct features for basic plan', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })

      const { result } = renderHook(() => useUserPlan())

      expect(result.current.features.aiQuestionsLimit).toBe(5)
      expect(result.current.features.pdfReports).toBe(false)
      expect(result.current.features.supportLevel).toBe('email')
      expect(result.current.isFeatureAvailable('pdfReports')).toBe(false)
    })

    it('should have correct features for professional plan', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockProUser,
        loading: false
      })

      const { result } = renderHook(() => useUserPlan())

      expect(result.current.features.aiQuestionsLimit).toBe(7)
      expect(result.current.features.pdfReports).toBe(true)
      expect(result.current.features.supportLevel).toBe('email_whatsapp')
      expect(result.current.isFeatureAvailable('pdfReports')).toBe(true)
    })

    it('should have correct features for premium plan', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockPremiumUser,
        loading: false
      })

      const { result } = renderHook(() => useUserPlan())

      expect(result.current.features.aiQuestionsLimit).toBe(50)
      expect(result.current.features.pdfReports).toBe(true)
      expect(result.current.features.supportLevel).toBe('priority')
      expect(result.current.features.advancedAnalysis).toBeGreaterThan(0)
      expect(result.current.isFeatureAvailable('advancedAnalysis')).toBe(true)
    })
  })

  describe('Plan Upgrade', () => {
    it('should initiate Stripe checkout for professional plan', async () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })

      const mockCheckoutUrl = 'https://checkout.stripe.com/test'
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: mockCheckoutUrl })
      })

      // Mock window.location.href
      delete (window as any).location
      window.location = { href: '' } as any

      const { result } = renderHook(() => useUserPlan())

      await result.current.upgradeToProfessional()

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/stripe/create-checkout-session',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('professional')
        })
      )
    })

    it('should handle upgrade errors gracefully', async () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Payment failed' })
      })

      const { result } = renderHook(() => useUserPlan())

      await expect(result.current.upgradeToProfessional()).rejects.toThrow()
    })
  })

  describe('Plan Comparison', () => {
    it('should have different AI models for basic vs premium', () => {
      const { useAuth } = require('@/components/auth-provider')
      
      useAuth.mockReturnValue({
        user: mockUser,
        loading: false
      })
      const { result: basicResult } = renderHook(() => useUserPlan())
      
      useAuth.mockReturnValue({
        user: mockPremiumUser,
        loading: false
      })
      const { result: premiumResult } = renderHook(() => useUserPlan())

      expect(basicResult.current.features.aiModel).toBe('gpt-4o-mini')
      expect(premiumResult.current.features.aiModel).toBe('gpt-4o')
    })

    it('should have increasing AI question limits by tier', () => {
      const plans = [
        { user: mockUser, limit: 5 },
        { user: mockProUser, limit: 7 },
        { user: mockPremiumUser, limit: 50 }
      ]

      plans.forEach(({ user, limit }) => {
        const { useAuth } = require('@/components/auth-provider')
        useAuth.mockReturnValue({
          user,
          loading: false
        })

        const { result } = renderHook(() => useUserPlan())
        expect(result.current.features.aiQuestionsLimit).toBe(limit)
      })
    })

    it('should have better support levels for higher tiers', () => {
      const { useAuth } = require('@/components/auth-provider')
      
      useAuth.mockReturnValue({ user: mockUser, loading: false })
      const { result: basic } = renderHook(() => useUserPlan())
      
      useAuth.mockReturnValue({ user: mockProUser, loading: false })
      const { result: pro } = renderHook(() => useUserPlan())
      
      useAuth.mockReturnValue({ user: mockPremiumUser, loading: false })
      const { result: premium } = renderHook(() => useUserPlan())

      expect(basic.current.features.supportLevel).toBe('email')
      expect(pro.current.features.supportLevel).toBe('email_whatsapp')
      expect(premium.current.features.supportLevel).toBe('priority')
    })
  })
})
