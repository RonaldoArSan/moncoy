import { createBrowserClient } from '@supabase/ssr'
import { checkSupabaseEnv, getEnvErrorMessage } from '@/lib/env-check'

// Create a singleton instance of the Supabase client
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null
let validationError: string | null = null

/**
 * Validate required Supabase environment variables
 * @throws Error if environment variables are missing or invalid
 */
function validateEnvVars() {
  const result = checkSupabaseEnv()
  
  if (!result.isValid) {
    throw new Error(getEnvErrorMessage(result))
  }
  
  // Log warnings in development
  if (process.env.NODE_ENV === 'development' && result.warnings.length > 0) {
    console.warn('⚠️ Supabase configuration warnings:', result.warnings)
  }
}

export const createClient = () => {
  // Return cached client if available
  if (supabaseClient) {
    return supabaseClient
  }

  // If we're in build mode (SSR/SSG), create a dummy client
  if (typeof window === 'undefined') {
    // During build, env vars might not be available
    // Create a dummy client that won't actually be used
    const dummyUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
    const dummyKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    
    return createBrowserClient(dummyUrl, dummyKey)
  }

  try {
    // Validate environment variables before creating client
    validateEnvVars()
    
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    return supabaseClient
  } catch (error: any) {
    validationError = error.message
    console.error('Failed to initialize Supabase client:', error.message)
    
    // Create a dummy client to prevent crashes
    // Real calls will fail with appropriate error messages
    const dummyClient = createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
    
    return dummyClient
  }
}

/**
 * Get the validation error if initialization failed
 */
export const getInitError = () => validationError

// Export the singleton instance directly
export const supabase = createClient()
