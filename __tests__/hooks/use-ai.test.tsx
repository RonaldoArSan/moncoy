import { renderHook, waitFor } from '@testing-library/react'
import { useAI } from '@/hooks/use-ai'
import { checkAILimit, incrementAIUsage } from '@/lib/ai-limits'
import { mockUser, mockTransaction } from '../utils/test-utils'

// Mock dependencies
jest.mock('@/contexts/user-plan-context', () => ({
  useUserPlan: () => ({
    currentPlan: 'basic',
    features: {
      aiQuestionsPerWeek: 5,
      aiEnabled: true
    }
  })
}))

jest.mock('@/contexts/settings-context', () => ({
  useSettingsContext: () => ({
    user: mockUser
  })
}))

jest.mock('@/hooks/use-toast', () => ({
  toast: jest.fn()
}))

// Type the mocked functions
const mockCheckAILimit = checkAILimit as jest.MockedFunction<typeof checkAILimit>
const mockIncrementAIUsage = incrementAIUsage as jest.MockedFunction<typeof incrementAIUsage>

describe('useAI Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Initial state', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useAI())

      expect(result.current.loading).toBe(false)
      expect(result.current.usageLoading).toBe(true)
      expect(result.current.usage).toBe(null)
      expect(result.current.isAvailable).toBe(true)
    })

    it('should load usage on mount', async () => {
      const mockUsage = {
        allowed: true,
        remaining: 5,
        limit: 5,
        used: 0,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      }

      mockCheckAILimit.mockResolvedValueOnce(mockUsage)

      const { result } = renderHook(() => useAI())

      await waitFor(() => {
        expect(result.current.usageLoading).toBe(false)
      })

      expect(result.current.usage).toEqual(mockUsage)
    })
  })

  describe('analyzeTransactions', () => {
    it('should block basic plan users before 22 days', async () => {
      const recentUser = {
        ...mockUser,
        registration_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
      }

      jest.spyOn(require('@/contexts/settings-context'), 'useSettingsContext').mockReturnValueOnce({
        user: recentUser
      })

      const { result } = renderHook(() => useAI())
      const transactions = [mockTransaction]

      await expect(
        result.current.analyzeTransactions(transactions, 'spending_analysis')
      ).rejects.toThrow(/22 dias/)
    })

    it('should allow basic plan users after 22 days', async () => {
      const oldUser = {
        ...mockUser,
        registration_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
      }

      jest.spyOn(require('@/contexts/settings-context'), 'useSettingsContext').mockReturnValueOnce({
        user: oldUser
      })

      const mockUsage = {
        allowed: true,
        remaining: 5,
        limit: 5,
        used: 0,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      }

      const mockAnalysis = {
        analysis: { summary: 'Test analysis' }
      }

      mockCheckAILimit.mockResolvedValueOnce(mockUsage)
      mockIncrementAIUsage.mockResolvedValueOnce({
        success: true,
        remaining: 4,
        used: 1,
        limit: 5
      })

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalysis
      })

      const { result } = renderHook(() => useAI())
      const transactions = [mockTransaction]

      const analysis = await result.current.analyzeTransactions(transactions, 'spending_analysis')

      expect(analysis).toEqual({ summary: 'Test analysis' })
      expect(mockIncrementAIUsage).toHaveBeenCalled()
    })

    it('should block when AI limit is reached', async () => {
      const mockUsage = {
        allowed: false,
        remaining: 0,
        limit: 5,
        used: 5,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      }

      // Mock for initial load on mount
      mockCheckAILimit.mockResolvedValueOnce({
        allowed: true,
        remaining: 5,
        limit: 5,
        used: 0,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      })
      // Mock for the check inside analyzeTransactions
      mockCheckAILimit.mockResolvedValueOnce(mockUsage)

      const { result } = renderHook(() => useAI())
      
      // Wait for initial load to complete
      await waitFor(() => {
        expect(result.current.usageLoading).toBe(false)
      })

      const transactions = [mockTransaction]

      await expect(
        result.current.analyzeTransactions(transactions, 'spending_analysis')
      ).rejects.toThrow(/Limite de perguntas atingido/)
    })

    it('should update usage counter after successful analysis', async () => {
      const mockUsage = {
        allowed: true,
        remaining: 5,
        limit: 5,
        used: 0,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      }

      const mockUpdatedUsage = {
        success: true,
        remaining: 4,
        used: 1,
        limit: 5
      }

      const mockAnalysis = {
        analysis: { summary: 'Test analysis' }
      }

      // Mock for initial load on mount
      mockCheckAILimit.mockResolvedValueOnce(mockUsage)
      // Mock for the check inside analyzeTransactions
      mockCheckAILimit.mockResolvedValueOnce(mockUsage)
      mockIncrementAIUsage.mockResolvedValueOnce(mockUpdatedUsage)

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalysis
      })

      const { result } = renderHook(() => useAI())
      
      // Wait for initial load to complete
      await waitFor(() => {
        expect(result.current.usageLoading).toBe(false)
      })

      const transactions = [mockTransaction]

      await result.current.analyzeTransactions(transactions, 'spending_analysis')

      await waitFor(() => {
        expect(result.current.usage?.remaining).toBe(4)
        expect(result.current.usage?.used).toBe(1)
      })
    })

    it('should show warning toast when near limit', async () => {
      const { toast } = require('@/hooks/use-toast')
      
      const mockUsage = {
        allowed: true,
        remaining: 3,
        limit: 5,
        used: 2,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      }

      const mockUpdatedUsage = {
        success: true,
        remaining: 2,
        used: 3,
        limit: 5
      }

      const mockAnalysis = {
        analysis: { summary: 'Test analysis' }
      }

      mockCheckAILimit.mockResolvedValueOnce(mockUsage)
      mockIncrementAIUsage.mockResolvedValueOnce(mockUpdatedUsage)

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalysis
      })

      const { result } = renderHook(() => useAI())
      const transactions = [mockTransaction]

      await result.current.analyzeTransactions(transactions, 'spending_analysis')

      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Atenção',
          description: expect.stringContaining('2 pergunta(s) restante(s)')
        })
      )
    })

    it('should handle API errors gracefully', async () => {
      const mockUsage = {
        allowed: true,
        remaining: 5,
        limit: 5,
        used: 0,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      }

      mockCheckAILimit.mockResolvedValueOnce(mockUsage)

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'API Error' })
      })

      const { result } = renderHook(() => useAI())
      const transactions = [mockTransaction]

      await expect(
        result.current.analyzeTransactions(transactions, 'spending_analysis')
      ).rejects.toThrow('API Error')
    })
  })

  describe('refreshUsage', () => {
    it('should reload usage data', async () => {
      const mockUsage1 = {
        allowed: true,
        remaining: 5,
        limit: 5,
        used: 0,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      }

      const mockUsage2 = {
        allowed: true,
        remaining: 3,
        limit: 5,
        used: 2,
        resetDate: '2025-10-31T00:00:00Z',
        plan: 'basic'
      }

      mockCheckAILimit
        .mockResolvedValueOnce(mockUsage1)
        .mockResolvedValueOnce(mockUsage2)

      const { result } = renderHook(() => useAI())

      await waitFor(() => {
        expect(result.current.usage?.remaining).toBe(5)
      })

      await result.current.refreshUsage()

      await waitFor(() => {
        expect(result.current.usage?.remaining).toBe(3)
      })
    })
  })

  describe('Plan-specific behavior', () => {
    it('should be available for all paid plans', () => {
      const plans = ['basic', 'pro', 'professional', 'premium']
      
      plans.forEach(plan => {
        jest.spyOn(require('@/contexts/user-plan-context'), 'useUserPlan').mockReturnValueOnce({
          currentPlan: plan,
          features: { aiEnabled: true }
        })

        const { result } = renderHook(() => useAI())
        expect(result.current.isAvailable).toBe(true)
      })
    })
  })
})
