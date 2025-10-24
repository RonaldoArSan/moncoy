import React from 'react'
import { render, screen } from '@testing-library/react'
import { AIStatusCard } from '@/components/ai-status-card'
import { mockUser, mockProUser, mockPremiumUser } from '../utils/test-utils'

// Mock the useUser hook
jest.mock('@/hooks/use-user', () => ({
  useUser: jest.fn()
}))

describe('AIStatusCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Plan', () => {
    it('should show locked state for basic plan users', () => {
      const { useUser } = require('@/hooks/use-user')
      useUser.mockReturnValue({
        user: mockUser,
        loading: false,
        canUseAI: () => false,
        getDaysSinceRegistration: () => 10
      })

      render(<AIStatusCard />)

      expect(screen.getByText(/bloqueado/i)).toBeInTheDocument()
      expect(screen.getByText(/disponível no plano profissional/i)).toBeInTheDocument()
      expect(screen.getByText(/fazer upgrade/i)).toBeInTheDocument()
    })
  })

  describe('Professional Plan', () => {
    it('should show countdown during 22-day waiting period', () => {
      const { useUser } = require('@/hooks/use-user')
      useUser.mockReturnValue({
        user: mockProUser,
        loading: false,
        canUseAI: () => false,
        getDaysSinceRegistration: () => 10
      })

      render(<AIStatusCard />)

      expect(screen.getByText(/12 dias/i)).toBeInTheDocument() // 22 - 10 = 12
      expect(screen.getByText(/restantes para desbloquear/i)).toBeInTheDocument()
      expect(screen.getByText(/período de carência/i)).toBeInTheDocument()
    })

    it('should show active state after 22 days', () => {
      const { useUser } = require('@/hooks/use-user')
      useUser.mockReturnValue({
        user: mockProUser,
        loading: false,
        canUseAI: () => true,
        getDaysSinceRegistration: () => 30
      })

      render(<AIStatusCard />)

      expect(screen.getByText(/ativo/i)).toBeInTheDocument()
      expect(screen.getByText(/IA disponível para uso/i)).toBeInTheDocument()
      expect(screen.getByText(/acessar IA/i)).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading skeleton when loading', () => {
      const { useUser } = require('@/hooks/use-user')
      useUser.mockReturnValue({
        user: null,
        loading: true,
        canUseAI: () => false,
        getDaysSinceRegistration: () => 0
      })

      render(<AIStatusCard />)

      // Check for pulse animation
      const pulseElement = screen.getByText((content, element) => {
        return element?.className?.includes('animate-pulse') ?? false
      })
      expect(pulseElement).toBeInTheDocument()
    })

    it('should show loading skeleton when user is null', () => {
      const { useUser } = require('@/hooks/use-user')
      useUser.mockReturnValue({
        user: null,
        loading: false,
        canUseAI: () => false,
        getDaysSinceRegistration: () => 0
      })

      render(<AIStatusCard />)

      // Check for pulse animation
      const pulseElement = screen.getByText((content, element) => {
        return element?.className?.includes('animate-pulse') ?? false
      })
      expect(pulseElement).toBeInTheDocument()
    })
  })


})
