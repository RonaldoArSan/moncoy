import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL is required. Please check your environment variables. ' +
    'See .env.example for required configuration.'
  )
}

if (!serviceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is required. Please check your environment variables. ' +
    'See .env.example for required configuration. ' +
    'Note: This key should only be used on the server side and never exposed to the client.'
  )
}

// Cliente com privilégios de serviço (usar somente no servidor)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export default supabaseAdmin
