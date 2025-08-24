import type { NextRequest } from 'next/server'

export function getPublicBaseUrl(req?: NextRequest) {
  // Prefer explicit envs
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')

  // Try proxy headers (Vercel/Reverse proxy)
  if (req) {
    const proto = req.headers.get('x-forwarded-proto') || 'https'
    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
    if (host) return `${proto}://${host}`
  }

  // Development fallback only
  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000'
  }

  // Last resort
  return 'https://moncoyfinance.com'
}
