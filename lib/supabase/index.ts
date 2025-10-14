// Barrel export for Supabase - Client only (for browser/client components)
export { createClient, supabase } from './client'
export * from './types'

// Default export for backward compatibility
import { supabase } from './client'
export default supabase

// Note: For server components, import directly from './server'