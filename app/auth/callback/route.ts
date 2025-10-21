import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const errorCode = requestUrl.searchParams.get('error_code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  logger.dev('Auth callback received:', { 
    hasCode: !!code, 
    error, 
    errorDescription,
    errorCode,
    next 
  })

  // Se houver erro no OAuth, redirecionar para login com mensagem
  if (error) {
    logger.error('OAuth error:', { error, errorDescription, errorCode })
    
    const errorMessage = errorDescription || error
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(errorMessage)}`,
        requestUrl.origin
      )
    )
  }

  if (code) {
    const supabase = await createClient()
    
    try {
      logger.dev('Exchanging code for session...')
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        logger.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(
          new URL(
            `/login?error=${encodeURIComponent('Erro ao autenticar. Tente novamente.')}`,
            requestUrl.origin
          )
        )
      }

      logger.dev('Session created successfully for user:', data?.user?.email)

      // Redirecionar para a página de destino
      const redirectUrl = new URL(next, requestUrl.origin)
      logger.dev('Redirecting to:', redirectUrl.toString())
      
      return NextResponse.redirect(redirectUrl)
    } catch (err) {
      logger.error('Unexpected error in auth callback:', err)
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Erro inesperado durante autenticação.')}`,
          requestUrl.origin
        )
      )
    }
  }

  // Se não houver código nem erro, redirecionar para login
  logger.warn('No code or error in auth callback, redirecting to login')
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
