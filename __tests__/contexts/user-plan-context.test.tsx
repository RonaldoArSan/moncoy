import React from 'react'
import { renderHook, waitFor, act } from '@testing-library/react'
import { UserPlanProvider, useUserPlan } from '@/contexts/user-plan-context'
import { mockUser, mockProUser, mockPremiumUser } from '../utils/test-utils'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
    removeItem: (key: string) => { delete store[key] }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock the userApi
jest.mock('@/lib/api', () => ({
  userApi: {
    getCurrentUser: jest.fn()
  }
}))

jest.mock('@/components/auth-provider', () => ({
  useAuth: jest.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn()
  }
}))

jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  }
}))

// Helper to render hook with provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <UserPlanProvider>{children}</UserPlanProvider>
)

describe('UserPlanContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
    localStorageMock.clear()
  })

  describe('Plan Features', () => {
    it('should return correct features for basic plan', async () => {
      const { userApi } = require('@/lib/api')
      userApi.getCurrentUser.mockResolvedValue(mockUser)

      const { result } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(result.current.currentPlan).toBe('basic')
      })

      expect(result.current.features).toMatchObject({
        aiModel: 'gpt-4o-mini',
        aiQuestionsLimit: 5,
        pdfReports: false,
        supportLevel: 'email'
      })
    })

    it('should return correct features for professional plan', async () => {
      const { userApi } = require('@/lib/api')
      userApi.getCurrentUser.mockResolvedValue(mockProUser)

      const { result } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(result.current.currentPlan).toBe('professional')
      })

      expect(result.current.features).toMatchObject({
        aiModel: 'gpt-4o-mini',
        aiQuestionsLimit: 7,
        pdfReports: true,
        supportLevel: 'email_whatsapp'
      })
    })

    it('should return correct features for premium plan', async () => {
      const { userApi } = require('@/lib/api')
      userApi.getCurrentUser.mockResolvedValue(mockPremiumUser)

      const { result } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(result.current.currentPlan).toBe('premium')
      })

      expect(result.current.features).toMatchObject({
        aiModel: 'gpt-4o',
        aiQuestionsLimit: 50,
        pdfReports: true,
        supportLevel: 'priority',
        advancedAnalysis: 5
      })
    })
  })

  describe('Plan Features Availability', () => {
    it('should have correct features for basic plan', async () => {
      const { userApi } = require('@/lib/api')
      userApi.getCurrentUser.mockResolvedValue(mockUser)

      const { result } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(result.current.currentPlan).toBe('basic')
      })

      expect(result.current.features.aiQuestionsLimit).toBe(5)
      expect(result.current.features.pdfReports).toBe(false)
      expect(result.current.features.supportLevel).toBe('email')
      expect(result.current.isFeatureAvailable('pdfReports')).toBe(false)
    })

    it('should have correct features for professional plan', async () => {
      const { userApi } = require('@/lib/api')
      userApi.getCurrentUser.mockResolvedValue(mockProUser)

      const { result } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(result.current.currentPlan).toBe('professional')
      })

      expect(result.current.features.aiQuestionsLimit).toBe(7)
      expect(result.current.features.pdfReports).toBe(true)
      expect(result.current.features.supportLevel).toBe('email_whatsapp')
      expect(result.current.isFeatureAvailable('pdfReports')).toBe(true)
    })

    it('should have correct features for premium plan', async () => {
      const { userApi } = require('@/lib/api')
      userApi.getCurrentUser.mockResolvedValue(mockPremiumUser)

      const { result } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(result.current.currentPlan).toBe('premium')
      })

      expect(result.current.features.aiQuestionsLimit).toBe(50)
      expect(result.current.features.pdfReports).toBe(true)
      expect(result.current.features.supportLevel).toBe('priority')
      expect(result.current.features.advancedAnalysis).toBeGreaterThan(0)
      expect(result.current.isFeatureAvailable('advancedAnalysis')).toBe(true)
    })
  })

  describe('Plan Upgrade', () => {
    it('should initiate Stripe checkout for professional plan', async () => {
      const { userApi } = require('@/lib/api')
      userApi.getCurrentUser.mockResolvedValue(mockUser)

      const mockCheckoutUrl = 'https://checkout.stripe.com/test'
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: mockCheckoutUrl })
      })

      // Mock window.location.href
      delete (window as any).location
      window.location = { href: '' } as any

      const { result } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(result.current.currentPlan).toBe('basic')
      })

      await act(async () => {
        await result.current.upgradeToProfessional()
      })

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/stripe/create-checkout-session',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('professional')
        })
      )
    })

    it('should handle upgrade errors gracefully', async () => {
      const { userApi } = require('@/lib/api')
      userApi.getCurrentUser.mockResolvedValue(mockUser)

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Payment failed' })
      })

      const { result } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(result.current.currentPlan).toBe('basic')
      })

      await expect(result.current.upgradeToProfessional()).rejects.toThrow()
    })
  })

  describe('Plan Comparison', () => {
    it('should have different AI models for basic vs premium', async () => {
      const { userApi } = require('@/lib/api')
      
      userApi.getCurrentUser.mockResolvedValue(mockUser)
      const { result: basicResult } = renderHook(() => useUserPlan(), { wrapper })
      
      await waitFor(() => {
        expect(basicResult.current.currentPlan).toBe('basic')
      })
      
      userApi.getCurrentUser.mockResolvedValue(mockPremiumUser)
      const { result: premiumResult } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(premiumResult.current.currentPlan).toBe('premium')
      })

      expect(basicResult.current.features.aiModel).toBe('gpt-4o-mini')
      expect(premiumResult.current.features.aiModel).toBe('gpt-4o')
    })

    it('should have increasing AI question limits by tier', async () => {
      const plans = [
        { user: mockUser, limit: 5 },
        { user: mockProUser, limit: 7 },
        { user: mockPremiumUser, limit: 50 }
      ]

      for (const { user, limit } of plans) {
        const { userApi } = require('@/lib/api')
        userApi.getCurrentUser.mockResolvedValue(user)

        const { result } = renderHook(() => useUserPlan(), { wrapper })
        
        await waitFor(() => {
          expect(result.current.features.aiQuestionsLimit).toBe(limit)
        })
      }
    })

    it('should have better support levels for higher tiers', async () => {
      const { userApi } = require('@/lib/api')
      
      userApi.getCurrentUser.mockResolvedValue(mockUser)
      const { result: basic } = renderHook(() => useUserPlan(), { wrapper })
      
      await waitFor(() => {
        expect(basic.current.currentPlan).toBe('basic')
      })
      
      userApi.getCurrentUser.mockResolvedValue(mockProUser)
      const { result: pro } = renderHook(() => useUserPlan(), { wrapper })
      
      await waitFor(() => {
        expect(pro.current.currentPlan).toBe('professional')
      })
      
      userApi.getCurrentUser.mockResolvedValue(mockPremiumUser)
      const { result: premium } = renderHook(() => useUserPlan(), { wrapper })

      await waitFor(() => {
        expect(premium.current.currentPlan).toBe('premium')
      })

      expect(basic.current.features.supportLevel).toBe('email')
      expect(pro.current.features.supportLevel).toBe('email_whatsapp')
      expect(premium.current.features.supportLevel).toBe('priority')
    })
  })
})
