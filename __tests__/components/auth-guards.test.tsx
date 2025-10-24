import { render, screen, waitFor } from '@testing-library/react'
import { UserGuard, AdminGuard, PublicGuard } from '@/components/auth-guards'
import { mockUser, mockAdminUser } from '../utils/test-utils'
import { useRouter } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
  redirect: jest.fn()
}))

// Mock auth context
jest.mock('@/components/auth-provider', () => ({
  useAuth: jest.fn()
}))

const mockPush = jest.fn()
const mockReplace = jest.fn()

describe('Auth Guards', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
      prefetch: jest.fn(),
      back: jest.fn()
    })
  })

  describe('UserGuard', () => {
    it('should render children when user is authenticated', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockUser,
        userProfile: mockUser,
        loading: false,
        isAdmin: false
      })

      render(
        <UserGuard>
          <div>Protected Content</div>
        </UserGuard>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should show loading when checking authentication', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: true,
        isAdmin: false
      })

      render(
        <UserGuard>
          <div>Protected Content</div>
        </UserGuard>
      )

      expect(screen.getByText(/verificando autenticação/i)).toBeInTheDocument()
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should redirect to login when not authenticated', async () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        isAdmin: false
      })

      render(
        <UserGuard>
          <div>Protected Content</div>
        </UserGuard>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login')
      })
    })
  })

  describe('AdminGuard', () => {
    it('should render children when user is admin', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockAdminUser,
        userProfile: mockAdminUser,
        loading: false,
        isAdmin: true
      })

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      )

      expect(screen.getByText('Admin Content')).toBeInTheDocument()
    })

    it('should redirect to admin login with unauthorized error when user is not admin', async () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockUser,
        userProfile: mockUser,
        loading: false,
        isAdmin: false
      })

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin/login?error=unauthorized')
      })
    })

    it('should redirect to admin login when not authenticated', async () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        isAdmin: false
      })

      render(
        <AdminGuard>
          <div>Admin Content</div>
        </AdminGuard>
      )

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/admin/login')
      })
    })
  })

  describe('PublicGuard', () => {
    it('should render children when not authenticated', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: false,
        isAdmin: false
      })

      render(
        <PublicGuard>
          <div>Public Content</div>
        </PublicGuard>
      )

      expect(screen.getByText('Public Content')).toBeInTheDocument()
    })

    it('should render public content when authenticated (no redirect in actual implementation)', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockUser,
        userProfile: mockUser,
        loading: false,
        isAdmin: false
      })

      render(
        <PublicGuard>
          <div>Public Content</div>
        </PublicGuard>
      )

      // PublicGuard with requiredMode='public' doesn't redirect authenticated users
      expect(screen.getByText('Public Content')).toBeInTheDocument()
    })

    it('should render public content when authenticated as admin (no redirect in actual implementation)', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: mockAdminUser,
        userProfile: mockAdminUser,
        loading: false,
        isAdmin: true
      })

      render(
        <PublicGuard>
          <div>Public Content</div>
        </PublicGuard>
      )

      // PublicGuard with requiredMode='public' doesn't redirect authenticated users
      expect(screen.getByText('Public Content')).toBeInTheDocument()
    })

    it('should show loading state', () => {
      const { useAuth } = require('@/components/auth-provider')
      useAuth.mockReturnValue({
        user: null,
        userProfile: null,
        loading: true,
        isAdmin: false
      })

      render(
        <PublicGuard>
          <div>Public Content</div>
        </PublicGuard>
      )

      expect(screen.getByText(/verificando autenticação/i)).toBeInTheDocument()
      expect(screen.queryByText('Public Content')).not.toBeInTheDocument()
    })
  })
})
