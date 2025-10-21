"use client"

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { logger } from '@/lib/logger'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Verificar se há erro nos parâmetros
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        if (error) {
          logger.error('OAuth error:', { error, errorDescription })
          router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`)
          return
        }

        const code = searchParams.get('code')
        const type = searchParams.get('type')
        const next = searchParams.get('next')

        if (code) {
          // Exchange code for session using singleton client
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            logger.error('Error exchanging code for session:', exchangeError)
            router.push('/login?error=auth-callback-error')
            return
          }

          logger.dev('Session exchanged successfully:', data.session?.user?.email)

          // Check the type of authentication callback
          if (type === 'recovery') {
            // Password reset - redirect to reset password page
            router.push('/reset-password')
          } else if (next) {
            // Redirect to next URL if provided
            router.push(next)
          } else {
            // Regular login - redirect to dashboard
            router.push('/')
          }
        } else {
          // No code present, redirect to login
          logger.warn('No code in callback, redirecting to login')
          router.push('/login')
        }
      } catch (error) {
        logger.error('Auth callback error:', error)
        router.push('/login?error=callback-error')
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Autenticando...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}