import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is required. Please check your environment variables. ' +
      'See .env.example for required configuration.'
    )
  }

  if (!supabaseKey) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is required. Please check your environment variables. ' +
      'See .env.example for required configuration.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseKey)
}
