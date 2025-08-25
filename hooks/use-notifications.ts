import { useState, useEffect } from 'react'
import { useTransactions } from './use-transactions'
import supabase from '@/lib/supabase'
import { useReports } from './use-reports'
import { useGoals } from './use-goals'

interface Notification {
  id: string
  user_id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  read: boolean
  created_at: string
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { getKPIs, getCategoryExpenses } = useReports()
  const { goals } = useGoals()
  const { transactions } = useTransactions()

  const loadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNotification = async (notification: Omit<Notification, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error
      setNotifications(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error('Erro ao criar notificação:', error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error('Erro ao marcar como lida:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (error) {
      console.error('Erro ao marcar todas como lidas:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    }
  }

  const generateSmartNotifications = async () => {
    try {
      const kpis = getKPIs()
      const categoryExpenses = getCategoryExpenses()

      // Notificação de saldo negativo
      if (kpis.saldoMensal < 0) {
        await createNotification({
          type: 'warning',
          title: 'Saldo Negativo',
          message: `Suas despesas estão R$ ${Math.abs(kpis.saldoMensal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} acima das receitas este mês.`,
          read: false
        })
      }

      // Notificação de categoria com gasto alto
      if (categoryExpenses.length > 0) {
        const topCategory = categoryExpenses[0]
        if (topCategory.percentage > 50) {
          await createNotification({
            type: 'warning',
            title: 'Gasto Elevado Detectado',
            message: `Você está gastando ${topCategory.percentage.toFixed(1)}% do orçamento com ${topCategory.category}.`,
            read: false
          })
        }
      }

      // Notificação de transações próximas do vencimento
      if (transactions && transactions.length > 0) {
        const now = new Date()
  transactions.forEach(async (tx: import('@/lib/supabase').Transaction) => {
          if (tx.status === 'due_soon') {
            await createNotification({
              type: 'warning',
              title: 'Transação próxima do vencimento',
              message: `A transação "${tx.description}" vence em breve (data: ${new Date(tx.date).toLocaleDateString('pt-BR')}).`,
              read: false
            })
          }
          if (tx.status === 'overdue') {
            await createNotification({
              type: 'error',
              title: 'Transação atrasada',
              message: `A transação "${tx.description}" está atrasada (data: ${new Date(tx.date).toLocaleDateString('pt-BR')}).`,
              read: false
            })
          }
        })
      }

      // Notificação de metas próximas de serem atingidas
      goals.forEach(async (goal) => {
        const progress = (goal.current_amount / goal.target_amount) * 100
        if (progress >= 90 && progress < 100) {
          await createNotification({
            type: 'success',
            title: 'Meta Quase Atingida!',
            message: `Você está a ${(100 - progress).toFixed(1)}% de completar a meta "${goal.title}".`,
            read: false
          })
        }
      })

    } catch (error) {
      console.error('Erro ao gerar notificações inteligentes:', error)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    generateSmartNotifications,
    refreshNotifications: loadNotifications
  }
}