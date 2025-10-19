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
    apiVersion: '2025-08-27.basil',
  })
}

export const getAdminDashboardData = async () => {
  noStore()
  
  try {
    const supabase = await createClient()
    
    // Verificar se as variáveis de ambiente estão disponíveis
    if (!process.env.STRIPE_SECRET_KEY) {
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
    
    const stripe = getStripe()

    const {
      data: { users },
      error: usersError,
    } = await supabase.auth.admin.listUsers()
    
    if (usersError || !users) {
      console.error('Erro ao buscar usuários:', usersError)
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

  const totalUsers = users.length
  const activeUsers = users.filter(
    (u: User) => (u.user_metadata.status || "active") === "active"
  ).length

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthlyGrowth = users.filter(
    (u: User) => new Date(u.created_at) > thirtyDaysAgo
  ).length

  const subscriptions = await stripe.subscriptions.list({
    limit: 100,
    status: "all",
  })

  const premiumUsers = subscriptions.data.filter(
    (s) => s.status === "active" || s.status === "trialing"
  ).length

  const charges = await stripe.charges.list({
    limit: 100,
    created: {
      gte: Math.floor(thirtyDaysAgo.getTime() / 1000),
    },
  })

  const totalRevenue = charges.data.reduce(
    (sum, charge) => sum + (charge.amount_captured / 100),
    0
  )

  const { count: supportTickets, error: ticketsError } = await supabase
    .from("support_tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "open")
  if (ticketsError)
    throw new Error(`Erro ao buscar tickets: ${ticketsError.message}`)

  const recentUsersRaw = users
    .sort((a: User, b: User) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  const recentUsers = recentUsersRaw.map((user: User) => ({
    id: user.id,
    name: user.user_metadata.full_name || user.email,
    email: user.email,
    plan: user.user_metadata.plan || "Básico",
    status: user.user_metadata.status || "Ativo",
    joinDate: new Date(user.created_at).toISOString().split("T")[0],
  }))

  return {
    totalUsers,
    activeUsers,
    premiumUsers,
    totalRevenue,
    monthlyGrowth,
    supportTickets: supportTickets || 0,
    systemHealth: 99.9, // Placeholder
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
