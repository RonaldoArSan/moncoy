import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()
  const host = req.headers.get('host') || ''
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const url = req.nextUrl.clone()

  // Production WWW redirect (fazer antes de qualquer lógica de auth)
  if (isProd && host.startsWith('www.')) {
    url.hostname = host.replace(/^www\./, '')
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  // Criar cliente Supabase com middleware para TODAS as rotas
  // Isso garante que os cookies de sessão sejam sempre atualizados
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options,
            sameSite: 'lax',
            secure: isProd
          })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0
          })
        },
      },
    }
  )

  // Refresh session em todas as rotas para garantir que cookies estejam atualizados
  // Isso é especialmente importante após login/logout
  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('🔍 [Middleware] Session check:', {
    path: req.nextUrl.pathname,
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email
  })

  // Handle password reset redirection with tokens
  if (req.nextUrl.pathname === '/auth/callback') {
    const searchParams = req.nextUrl.searchParams
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const type = searchParams.get('type')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log('🔐 /auth/callback hit:', {
      type,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      error,
      errorDescription,
      allParams: Object.fromEntries(searchParams.entries())
    })

    // Handle password recovery flow
    if (type === 'recovery' || (accessToken && refreshToken && !error)) {
      console.log('🔄 Password recovery detected, redirecting to /reset-password')
      url.pathname = '/reset-password'
      url.searchParams.set('access_token', accessToken!)
      url.searchParams.set('refresh_token', refreshToken!)
      return NextResponse.redirect(url)
    }

    // Handle errors
    if (error) {
      console.error('❌ OAuth error in callback:', error, errorDescription)
      url.pathname = '/login'
      url.searchParams.set('error', errorDescription || error)
      return NextResponse.redirect(url)
    }
  }

  // Production WWW redirect
  if (isProd && host.startsWith('www.')) {
    url.hostname = host.replace(/^www\./, '')
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}

