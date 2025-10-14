import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const url = request.nextUrl.clone()

  // Handle password reset redirection with tokens
  if (request.nextUrl.pathname === '/auth/callback') {
    const searchParams = request.nextUrl.searchParams
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

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession()

  // Proteger rotas admin
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    // Se não há sessão, redirecionar para login admin
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verificar se o usuário tem permissões de admin
    try {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)

      if (rolesError || !rolesData) {
        console.error('Error checking admin roles:', rolesError)
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      const roles = rolesData.map(r => r.role)
      const hasAdminRole = roles.includes('admin') || roles.includes('super_admin')

      if (!hasAdminRole) {
        // Usuário autenticado mas sem permissões admin
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      console.error('Error in admin middleware:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Proteger rotas de usuário autenticado
  const protectedRoutes = [
    '/profile',
    '/settings',
    '/transactions',
    '/goals',
    '/investments',
    '/reports',
    '/ai-advice',
    '/agenda'
  ]

  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
