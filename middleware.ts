import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const url = req.nextUrl.clone()

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

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
