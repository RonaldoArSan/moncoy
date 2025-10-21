import { NextResponse } from 'next/server'

/**
 * CORS configuration for production environment
 * Handles cross-origin requests for OAuth and API routes
 */

// Allowed origins based on environment
const getAllowedOrigins = (): string[] => {
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  
  if (isProd) {
    return [
      'https://moncoyfinance.com',
      'https://www.moncoyfinance.com',
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    ].filter(Boolean)
  }
  
  // Development origins
  return [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  ].filter(Boolean)
}

/**
 * Add CORS headers to a response
 */
export function addCorsHeaders(
  response: NextResponse,
  origin?: string | null
): NextResponse {
  const allowedOrigins = getAllowedOrigins()
  
  // Check if origin is allowed
  const isAllowedOrigin = origin && (
    allowedOrigins.includes(origin) || 
    origin.includes('.supabase.co')
  )
  
  // Set CORS headers
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (allowedOrigins.length > 0) {
    // Fallback to first allowed origin
    response.headers.set('Access-Control-Allow-Origin', allowedOrigins[0])
  }
  
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS'
  )
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, Origin'
  )
  response.headers.set('Access-Control-Max-Age', '86400')
  
  return response
}

/**
 * Handle OPTIONS preflight request
 */
export function handleCorsPreFlight(origin?: string | null): NextResponse {
  const response = new NextResponse(null, { status: 204 })
  return addCorsHeaders(response, origin)
}

/**
 * Create a JSON response with CORS headers
 */
export function corsJsonResponse(
  data: any,
  options: {
    status?: number
    origin?: string | null
  } = {}
): NextResponse {
  const { status = 200, origin } = options
  const response = NextResponse.json(data, { status })
  return addCorsHeaders(response, origin)
}
