import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
  // Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    const errorInfo = {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      urlLength: supabaseUrl?.length || 0,
      keyLength: supabaseKey?.length || 0,
      env: process.env.NODE_ENV,
      // Don't log actual values, just indicators
      urlPrefix: supabaseUrl?.substring(0, 30) || 'undefined'
    }
    
    // During build time, environment variables might not be set
    // This is acceptable for static generation
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
      console.warn('⚠️ Supabase environment variables not configured during build')
    } else {
      console.error('🚨 CRITICAL: Supabase environment variables not configured', errorInfo)
    }
    
    throw new Error('Supabase configuration missing. Please check environment variables.')
  }
  
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn('⚠️ Cookie set failed:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn('⚠️ Cookie remove failed:', error)
          }
        },
      },
    }
  )
}
