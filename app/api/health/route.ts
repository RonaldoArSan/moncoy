import { NextResponse } from 'next/server'

/**
 * Health check endpoint to verify environment configuration
 * Used for debugging authentication issues in production
 * 
 * GET /api/health
 */
export async function GET() {
  const now = new Date().toISOString()
  
  // Check environment variables (without exposing values)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const hasSupabaseUrl = !!supabaseUrl
  const hasSupabaseKey = !!supabaseKey
  
  const health = {
    status: hasSupabaseUrl && hasSupabaseKey ? 'healthy' : 'unhealthy',
    timestamp: now,
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    checks: {
      supabase: {
        hasUrl: hasSupabaseUrl,
        hasKey: hasSupabaseKey,
        urlLength: supabaseUrl?.length || 0,
        keyLength: supabaseKey?.length || 0,
        urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'missing',
        urlValid: supabaseUrl ? supabaseUrl.startsWith('https://') && supabaseUrl.includes('.supabase.co') : false
      }
    },
    issues: [] as string[]
  }
  
  // Identify issues
  if (!hasSupabaseUrl) {
    health.issues.push('NEXT_PUBLIC_SUPABASE_URL is not configured')
  }
  if (!hasSupabaseKey) {
    health.issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured')
  }
  if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
    health.issues.push('NEXT_PUBLIC_SUPABASE_URL should start with https://')
  }
  if (supabaseUrl && !supabaseUrl.includes('.supabase.co')) {
    health.issues.push('NEXT_PUBLIC_SUPABASE_URL should contain .supabase.co')
  }
  
  // Return appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : 503
  
  return NextResponse.json(health, { 
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Content-Type': 'application/json'
    }
  })
}
