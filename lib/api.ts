import { supabase } from './supabase'
import type { Transaction, Goal, Investment, InvestmentTransaction, Category, User } from './supabase'

// User API functions
export const userApi = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      // If user doesn't exist in public.users, create profile
      if (error.code === 'PGRST116') {
        return await userApi.createUserProfile(user)
      }
      throw error
    }
    return data
  },

  async createUserProfile(authUser: any): Promise<User> {
    const userData = {
      id: authUser.id,
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
      email: authUser.email,
      plan: 'basic' as const,
      registration_date: authUser.created_at
    }

    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) throw error

    // Create default categories and settings
    await userApi.createDefaultData(authUser.id)
    
    return data
  },

  async createDefaultData(userId: string): Promise<void> {
    // Create default categories
    const defaultCategories = [
      { name: 'Salário', type: 'income', color: 'green' },
      { name: 'Freelance', type: 'income', color: 'blue' },
      { name: 'Alimentação', type: 'expense', color: 'orange' },
      { name: 'Transporte', type: 'expense', color: 'blue' },
      { name: 'Emergência', type: 'goal', color: 'red' },
      { name: 'Ações', type: 'investment', color: 'green' }
    ]

    await supabase
      .from('categories')
      .insert(defaultCategories.map(cat => ({ ...cat, user_id: userId })))

    // Create default user settings
    await supabase
      .from('user_settings')
      .insert({ user_id: userId })
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// Categories API functions
export const categoriesApi = {
  async getCategories(type?: string): Promise<Category[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async createCategory(category: Omit<Category, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Transactions API functions
export const transactionsApi = {
  async getTransactions(limit?: number): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    let query = supabase
      .from('transactions')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: user.id })
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Goals API functions
export const goalsApi = {
  async getGoals(): Promise<Goal[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('goals')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createGoal(goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Goal> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goal, user_id: user.id })
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Investments API functions
export const investmentsApi = {
  async getInvestments(): Promise<Investment[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('investments')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createInvestment(investment: Omit<Investment, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Investment> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('investments')
      .insert({ ...investment, user_id: user.id })
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  async getInvestmentTransactions(): Promise<InvestmentTransaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('investment_transactions')
      .select(`
        *,
        investment:investments(*)
      `)
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createInvestmentTransaction(transaction: Omit<InvestmentTransaction, 'id' | 'user_id' | 'created_at'>): Promise<InvestmentTransaction> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('investment_transactions')
      .insert({ ...transaction, user_id: user.id })
      .select(`
        *,
        investment:investments(*)
      `)
      .single()

    if (error) throw error
    return data
  }
}

// Dashboard API functions
export const dashboardApi = {
  async getFinancialSummary() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_financial_summary')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  }
}