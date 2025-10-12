import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          plan: string | null
          registration_date: string | null
          created_at: string
          updated_at: string
          phone: string | null
          country: string | null
          timezone: string | null
          currency: string | null
          date_format: string | null
          is_admin: boolean | null
          email_verified: boolean | null
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          plan?: string | null
          registration_date?: string | null
          created_at?: string
          updated_at?: string
          phone?: string | null
          country?: string | null
          timezone?: string | null
          currency?: string | null
          date_format?: string | null
          is_admin?: boolean | null
          email_verified?: boolean | null
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          plan?: string | null
          registration_date?: string | null
          created_at?: string
          updated_at?: string
          phone?: string | null
          country?: string | null
          timezone?: string | null
          currency?: string | null
          date_format?: string | null
          is_admin?: boolean | null
          email_verified?: boolean | null
          stripe_customer_id?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          description: string | null
          amount: number
          type: string
          category_id: string | null
          date: string
          status: string | null
          priority: string | null
          notes: string | null
          receipt_url: string | null
          merchant: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          description?: string | null
          amount: number
          type: string
          category_id?: string | null
          date: string
          status?: string | null
          priority?: string | null
          notes?: string | null
          receipt_url?: string | null
          merchant?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          description?: string | null
          amount?: number
          type?: string
          category_id?: string | null
          date?: string
          status?: string | null
          priority?: string | null
          notes?: string | null
          receipt_url?: string | null
          merchant?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          color: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          total_amount: number
          spent_amount: number
          period_type: string
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          total_amount: number
          spent_amount?: number
          period_type?: string
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          total_amount?: number
          spent_amount?: number
          period_type?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      financial_accounts: {
        Row: {
          id: string
          user_id: string
          name: string
          account_type: string
          institution: string | null
          currency: string
          current_balance: number
          credit_limit: number
          is_active: boolean
          account_number: string | null
          routing_number: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          account_type: string
          institution?: string | null
          currency?: string
          current_balance?: number
          credit_limit?: number
          is_active?: boolean
          account_number?: string | null
          routing_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          account_type?: string
          institution?: string | null
          currency?: string
          current_balance?: number
          credit_limit?: number
          is_active?: boolean
          account_number?: string | null
          routing_number?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_amount: number
          current_amount: number
          deadline: string | null
          category_id: string | null
          priority: string | null
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_amount: number
          current_amount?: number
          deadline?: string | null
          category_id?: string | null
          priority?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_amount?: number
          current_amount?: number
          deadline?: string | null
          category_id?: string | null
          priority?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      investments: {
        Row: {
          id: string
          user_id: string
          asset_name: string
          asset_type: string
          quantity: number
          avg_price: number
          current_price: number
          broker: string | null
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          asset_name: string
          asset_type: string
          quantity: number
          avg_price: number
          current_price: number
          broker?: string | null
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          asset_name?: string
          asset_type?: string
          quantity?: number
          avg_price?: number
          current_price?: number
          broker?: string | null
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      financial_alerts: {
        Row: {
          id: string
          user_id: string
          alert_type: string
          title: string
          message: string
          severity: string
          is_read: boolean
          is_dismissed: boolean
          related_entity_type: string | null
          related_entity_id: string | null
          action_url: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          alert_type: string
          title: string
          message: string
          severity?: string
          is_read?: boolean
          is_dismissed?: boolean
          related_entity_type?: string | null
          related_entity_id?: string | null
          action_url?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          alert_type?: string
          title?: string
          message?: string
          severity?: string
          is_read?: boolean
          is_dismissed?: boolean
          related_entity_type?: string | null
          related_entity_id?: string | null
          action_url?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      user_financial_summary: {
        Row: {
          user_id: string
          name: string | null
          email: string | null
          plan: string | null
          total_income: number | null
          total_expenses: number | null
          net_income: number | null
          total_balance: number | null
          total_debt: number | null
          total_investments: number | null
          completed_goals: number | null
          total_goals: number | null
        }
      }
    }
    Functions: {
      calculate_net_worth: {
        Args: { user_uuid: string }
        Returns: number
      }
      calculate_savings_rate: {
        Args: { user_uuid: string; months?: number }
        Returns: number
      }
      get_spending_by_category: {
        Args: { 
          user_uuid: string
          start_date?: string
          end_date?: string
        }
        Returns: Array<{
          category_name: string
          total_amount: number
          transaction_count: number
          percentage: number
        }>
      }
      detect_unusual_spending: {
        Args: { user_uuid: string }
        Returns: Array<{
          transaction_id: string
          amount: number
          description: string
          category_name: string
          date: string
          avg_amount: number
          deviation_percentage: number
        }>
      }
      generate_monthly_report: {
        Args: { user_uuid: string; report_month: string }
        Returns: string
      }
      create_financial_alerts: {
        Args: { user_uuid: string }
        Returns: number
      }
    }
  }
}

// Cliente com privilégios de serviço (usar somente no servidor)
export const supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export default supabaseAdmin
