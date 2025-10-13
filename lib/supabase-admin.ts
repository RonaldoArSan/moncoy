import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL é obrigatório')
}

if (!serviceRoleKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatório')
}

// Cliente com privilégios de serviço (usar somente no servidor)
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export default supabaseAdmin
