import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || ''
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'

  if (!isProd) return NextResponse.next()

  // Para o app, só aplicamos se o domínio for www.app.moncoyfinance.com (pouco comum), mas fica genérico
  if (host.startsWith('www.')) {
    const url = new URL(req.url)
    url.hostname = host.replace(/^www\./, '')
    url.protocol = 'https:'
    return NextResponse.redirect(url, 308)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
