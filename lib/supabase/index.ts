// Re-export types and client from parent supabase.ts file
export type {
  User,
  UserSettings,
  Category,
  Transaction,
  Goal,
  Investment,
  InvestmentTransaction,
  BankAccount,
  AIInsight,
  RecurringTransaction,
  SupportSettings,
  SupportTicket
} from '../supabase'

export { default, supabase } from '../supabase'

// Also export the client and server utilities
export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
