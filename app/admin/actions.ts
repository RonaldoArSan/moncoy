"use server"

import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from "next/cache"
import { User } from "@supabase/supabase-js"
import Stripe from 'stripe'

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-07-30.basil',
  })
}

export const getAdminDashboardData = async () => {
  noStore()
  
  try {
    const supabase = await createClient()
    
    // Verificar se o usuário atual é admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    const roles = rolesData?.map(r => r.role) || []
    const isAdmin = roles.includes('admin') || roles.includes('super_admin')

    if (!isAdmin) {
      throw new Error('Acesso negado: permissões de administrador necessárias')
    }

    // Usar a view otimizada do dashboard
    const { data: dashboardStats, error: statsError } = await supabase
      .rpc('admin_dashboard_stats_security')

    if (statsError) {
      console.error('Erro ao buscar estatísticas do dashboard:', statsError)
    }

    const stats = dashboardStats?.[0] || {
      total_active_users: 0,
      new_users_this_month: 0,
      active_users_this_week: 0,
      open_support_tickets: 0,
      transactions_this_month: 0
    }

    // Buscar usuários recentes
    const { data: recentUsersData, error: recentUsersError } = await supabase
      .from('users')
      .select('id, name, email, plan, created_at, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentUsersError) {
      console.error('Erro ao buscar usuários recentes:', recentUsersError)
    }

    const recentUsers = recentUsersData?.map(user => ({
      id: user.id,
      name: user.name || user.email,
      email: user.email,
      plan: user.plan === 'basic' ? 'Básico' : user.plan === 'professional' ? 'Profissional' : 'Premium',
      status: user.is_active ? 'Ativo' : 'Inativo',
      joinDate: new Date(user.created_at).toISOString().split('T')[0],
    })) || []

    // Dados do Stripe (se configurado)
    let premiumUsers = 0
    let totalRevenue = 0

    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = getStripe()
        const subscriptions = await stripe.subscriptions.list({
          limit: 100,
          status: 'all',
        })

        premiumUsers = subscriptions.data.filter(
          s => s.status === 'active' || s.status === 'trialing'
        ).length

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const charges = await stripe.charges.list({
          limit: 100,
          created: {
            gte: Math.floor(thirtyDaysAgo.getTime() / 1000),
          },
        })

        totalRevenue = charges.data.reduce(
          (sum, charge) => sum + (charge.amount_captured / 100),
          0
        )
      } catch (stripeError) {
        console.error('Erro ao buscar dados do Stripe:', stripeError)
      }
    }

    return {
      totalUsers: stats.total_active_users,
      activeUsers: stats.active_users_this_week,
      premiumUsers,
      totalRevenue,
      monthlyGrowth: stats.new_users_this_month,
      supportTickets: stats.open_support_tickets,
      systemHealth: 99.9,
      recentUsers,
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard admin:', error)
    return {
      totalUsers: 0,
      activeUsers: 0,
      premiumUsers: 0,
      totalRevenue: 0,
      monthlyGrowth: 0,
      supportTickets: 0,
      systemHealth: 99.9,
      recentUsers: [],
    }
  }
}
