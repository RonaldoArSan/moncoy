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
  
  // Capturar todos os parâmetros para debug
  const allParams: Record<string, string> = {}
  requestUrl.searchParams.forEach((value, key) => {
    allParams[key] = value
  })

  // Log detalhado para produção
  logger.dev('🔐 Auth callback received:', { 
    hasCode: !!code,
    codeLength: code?.length || 0,
    error, 
    errorDescription,
    errorCode,
    next,
    origin: requestUrl.origin,
    pathname: requestUrl.pathname,
    fullUrl: requestUrl.toString(),
    allParams,
    headers: {
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
      host: request.headers.get('host'),
    }
  })

  // Se houver erro no OAuth, redirecionar para login com mensagem
  if (error) {
    logger.error('❌ OAuth error detected:', { 
      error, 
      errorDescription, 
      errorCode,
      fullUrl: requestUrl.toString(),
      referer: request.headers.get('referer'),
      // Log específico para state missing
      isStateMissing: errorCode === 'bad_oauth_callback' || error === 'invalid_request',
      allParams
    })
    
    // Se for erro de state missing, log adicional
    if (errorCode === 'bad_oauth_callback' || errorDescription?.includes('state parameter')) {
      logger.error('⚠️ OAuth STATE PARAMETER MISSING - Possíveis causas:', {
        causa1: 'Cookies bloqueados ou desabilitados no navegador',
        causa2: 'Redirect URL não configurada corretamente no Supabase Dashboard',
        causa3: 'PKCE flow interrompido (sessão expirou durante OAuth)',
        causa4: 'Site URL incorreta no Supabase Dashboard',
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
        requestOrigin: requestUrl.origin
      })
    }
    
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
      logger.dev('🔄 Exchanging code for session...', {
        codePrefix: code.substring(0, 10) + '...',
        origin: requestUrl.origin
      })
      
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        logger.error('❌ Error exchanging code for session:', {
          error: exchangeError.message,
          status: exchangeError.status,
          name: exchangeError.name,
          code: code.substring(0, 10) + '...',
          // Log detalhes específicos de erro
          isPKCEError: exchangeError.message?.includes('PKCE'),
          isExpiredCode: exchangeError.message?.includes('expired'),
          isInvalidCode: exchangeError.message?.includes('invalid'),
        })
        
        return NextResponse.redirect(
          new URL(
            `/login?error=${encodeURIComponent('Erro ao autenticar. Tente novamente.')}`,
            requestUrl.origin
          )
        )
      }

      logger.dev('✅ Session created successfully:', {
        userId: data?.user?.id,
        email: data?.user?.email,
        provider: data?.user?.app_metadata?.provider,
        sessionExpiresAt: data?.session?.expires_at,
      })

      // Redirecionar para a página de destino
      const redirectUrl = new URL(next, requestUrl.origin)
      logger.dev('↪️ Redirecting to:', {
        path: redirectUrl.pathname,
        fullUrl: redirectUrl.toString()
      })
      
      return NextResponse.redirect(redirectUrl)
    } catch (err) {
      logger.error('💥 Unexpected error in auth callback:', {
        error: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
        code: code.substring(0, 10) + '...'
      })
      
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('Erro inesperado durante autenticação.')}`,
          requestUrl.origin
        )
      )
    }
  }

  // Se não houver código nem erro, redirecionar para login
  logger.warn('⚠️ No code or error in auth callback', {
    message: 'Callback acessado sem code ou error - possível acesso direto ou URL malformada',
    allParams,
    referer: request.headers.get('referer'),
    expectedParams: 'code ou error',
  })
  
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}
