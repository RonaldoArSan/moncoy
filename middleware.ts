import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const host = req.headers.get('host') || ''
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const url = req.nextUrl.clone()

  // Production WWW redirect (fazer antes de qualquer lógica de auth)
  if (isProd && host.startsWith('www.')) {
    url.hostname = host.replace(/^www\./, '')
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  // Criar cliente Supabase com middleware APENAS para rotas de auth
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth/')
  
  if (isAuthRoute) {
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

    // Refresh session APENAS em rotas de auth
    await supabase.auth.getSession()
  }

  // Handle password reset redirection with tokens
  if (req.nextUrl.pathname === '/auth/callback') {
    const searchParams = req.nextUrl.searchParams
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const type = searchParams.get('type')

    if (type === 'recovery' && accessToken && refreshToken) {
      // Redirect to reset password page with tokens
      url.pathname = '/reset-password'
      url.searchParams.set('access_token', accessToken)
      url.searchParams.set('refresh_token', refreshToken)
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

