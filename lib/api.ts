import supabase from './supabase'
import type { Transaction, Goal, Investment, InvestmentTransaction, Category, User, RecurringTransaction } from './supabase'

// User API functions
export const userApi = {
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (error) {
      throw error
    }
    
    if (!data) {
      // If user doesn't exist in public.users, create profile
      return await userApi.createUserProfile(user)
    }
    
    return data
  },

  async createUserProfile(authUser: any): Promise<User> {
    const userData = {
      id: authUser.id,
      name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
      email: authUser.email,
      plan: authUser.user_metadata?.plan || 'basic' as const,
      registration_date: authUser.created_at,
      photo_url: authUser.user_metadata?.avatar_url || null // Foto do Google
    }

    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'id' })
      .select()
      .single()

    if (error) throw error

    // Create default categories and settings (only if they don't exist)
    try {
      await userApi.createDefaultData(authUser.id)
    } catch (err) {
      // Ignore conflicts - data might already exist
      console.log('Default data already exists or error creating:', err)
    }
    
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

    // Use upsert to avoid conflicts
    await supabase
      .from('categories')
      .upsert(defaultCategories.map(cat => ({ ...cat, user_id: userId })), { onConflict: 'user_id,name' })

    // Create default user settings with upsert
    await supabase
      .from('user_settings')
      .upsert({ user_id: userId }, { onConflict: 'user_id' })
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
    if (!user) return []

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

    if (error) {
      if (error.code === '23505') {
        throw new Error('Já existe uma categoria com este nome')
      }
      throw new Error(error.message || 'Erro ao criar categoria')
    }
    return data
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('Já existe uma categoria com este nome')
      }
      throw new Error(error.message || 'Erro ao atualizar categoria')
    }
    return data
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message || 'Erro ao excluir categoria')
    }
  }
}

// Transactions API functions
export const transactionsApi = {
  async getTransactions(limit?: number): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

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

  async updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'category'>>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      throw new Error(error.message || 'Erro ao atualizar transação')
    }
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
    if (!user) return []

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
    if (!user) return []

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

  async deleteInvestment(id: string): Promise<void> {
    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id)

    if (error) throw error
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

// Recurring Transactions API functions
export const recurringTransactionsApi = {
  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('recurring_transactions')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createRecurringTransaction(transaction: Omit<RecurringTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<RecurringTransaction> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('recurring_transactions')
      .insert({ ...transaction, user_id: user.id })
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  async updateRecurringTransaction(id: string, updates: Partial<RecurringTransaction>): Promise<RecurringTransaction> {
    const { data, error } = await supabase
      .from('recurring_transactions')
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

  async deleteRecurringTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('recurring_transactions')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error
  },

  async generateRecurringTransactions(month: number, year: number): Promise<Transaction[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Get active recurring transactions
    const { data: recurring, error } = await supabase
      .from('recurring_transactions')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)

    if (error) throw error
    if (!recurring) return []

    const generatedTransactions: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = []
    const currentDate = new Date(year, month - 1, 1)
    const endOfMonth = new Date(year, month, 0)

    for (const rec of recurring) {
      const startDate = new Date(rec.start_date)
      const endDate = rec.end_date ? new Date(rec.end_date) : null

      // Skip if recurring transaction hasn't started yet or has ended
      if (startDate > endOfMonth || (endDate && endDate < currentDate)) {
        continue
      }

      let transactionDate: Date | null = null

      if (rec.frequency === 'monthly' && rec.day_of_month) {
        const day = Math.min(rec.day_of_month, endOfMonth.getDate())
        transactionDate = new Date(year, month - 1, day)
      } else if (rec.frequency === 'weekly' && rec.day_of_week !== null) {
        // Find all occurrences of the day in the month
        const firstDay = new Date(year, month - 1, 1)
        const firstDayOfWeek = firstDay.getDay()
        const targetDay = rec.day_of_week
        
        let dayDiff = targetDay - firstDayOfWeek
        if (dayDiff < 0) dayDiff += 7
        
        const firstOccurrence = new Date(year, month - 1, 1 + dayDiff)
        if (firstOccurrence <= endOfMonth) {
          transactionDate = firstOccurrence
        }
      } else if (rec.frequency === 'yearly') {
        const recurringMonth = startDate.getMonth()
        const recurringDay = startDate.getDate()
        
        if (recurringMonth === month - 1) {
          transactionDate = new Date(year, month - 1, recurringDay)
        }
      }

      if (transactionDate && transactionDate >= startDate && (!endDate || transactionDate <= endDate)) {
        generatedTransactions.push({
          description: rec.description,
          amount: rec.amount,
          type: rec.type,
          category_id: rec.category_id,
          date: transactionDate.toISOString().split('T')[0],
          status: 'pending',
          priority: rec.priority || 'medium',
          notes: `Transação recorrente: ${rec.notes || ''}`.trim()
        })
      }
    }

    // Create the transactions
    const createdTransactions: Transaction[] = []
    for (const transaction of generatedTransactions) {
      try {
        const created = await transactionsApi.createTransaction(transaction)
        createdTransactions.push(created)
      } catch (error) {
        console.error('Erro ao criar transação recorrente:', error)
      }
    }

    return createdTransactions
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