import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Types based on our database schema
export interface User {
  id: string
  name: string
  email: string
  plan: 'basic' | 'professional' | 'premium'
  registration_date: string
  created_at: string
  updated_at: string
  stripe_customer_id?: string | null
  photo_url?: string | null // URL da foto do usuário
}

export interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense' | 'goal' | 'investment'
  color: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id?: string
  date: string
  status: 'pending' | 'completed' | 'cancelled' | 'overdue' | 'due_soon'
  priority: 'low' | 'medium' | 'high'
  notes?: string
  receipt_url?: string
  merchant?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  target_amount: number
  current_amount: number
  deadline?: string
  category_id?: string
  priority: 'low' | 'medium' | 'high'
  is_completed: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface Investment {
  id: string
  user_id: string
  asset_name: string
  asset_type: 'stocks' | 'fii' | 'etf' | 'fixed_income' | 'crypto' | 'funds' | 'others'
  quantity: number
  avg_price: number
  current_price?: number
  broker?: string
  category_id?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface InvestmentTransaction {
  id: string
  user_id: string
  investment_id?: string
  operation_type: 'buy' | 'sell'
  quantity: number
  price: number
  total_value: number
  date: string
  broker?: string
  notes?: string
  created_at: string
  investment?: Investment
}

export interface BankAccount {
  id: string
  user_id: string
  bank_name: string
  account_type: string
  account_number?: string
  balance: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIInsight {
  id: string
  user_id: string
  category: string
  title: string
  content: string
  priority: string
  potential_savings?: number
  is_dismissed: boolean
  created_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  ai_frequency: string
  ai_detail_level: string
  openai_api_key?: string
  notifications_enabled: boolean
  theme: string
  created_at: string
  updated_at: string
}

export interface RecurringTransaction {
  id: string
  user_id: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category_id?: string
  frequency: 'monthly' | 'weekly' | 'yearly'
  start_date: string
  end_date?: string
  day_of_month?: number
  day_of_week?: number
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
  category?: Category
}

export interface SupportSettings {
  id: string
  support_email?: string | null
  phones: string[]
  whatsapp?: string | null
  business_hours?: string | null
  chat_url?: string | null
  knowledge_base_url?: string | null
  updated_at: string
}

export interface SupportTicket {
  id: string
  user_id: string
  subject: string
  description?: string | null
  priority: 'Baixa' | 'Média' | 'Alta' | 'Urgente'
  status: 'Aberto' | 'Em andamento' | 'Resolvido' | 'Fechado'
  created_at: string
  updated_at: string
}

export { supabase }
export default supabase