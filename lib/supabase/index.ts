// Supabase configuration and types
export * from './types'
export { default as supabase, createClient } from './client'

// Server-side client - must be imported explicitly to avoid client-side issues
// Use: import { createClient as createServerClient } from '@/lib/supabase/server'