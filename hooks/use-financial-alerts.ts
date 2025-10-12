import { useState, useEffect } from 'react'
import { useAuth } from './use-auth'

export interface FinancialAlert {
  id: string
  user_id: string
  alert_type: string
  title: string
  message: string
  severity: string
  is_read: boolean
  is_dismissed: boolean
  related_entity_type?: string
  related_entity_id?: string
  action_url?: string
  expires_at?: string
  created_at: string
}

export function useFinancialAlerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<FinancialAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = async (includeRead = false, includeDismissed = false) => {
    if (!user?.id) return

    try {
      setLoading(true)
      const params = new URLSearchParams({
        user_id: user.id,
        include_read: includeRead.toString(),
        include_dismissed: includeDismissed.toString()
      })

      const response = await fetch(`/api/financial/alerts?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar alertas')
      }

      setAlerts(data.alerts)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao buscar alertas:', err)
    } finally {
      setLoading(false)
    }
  }

  const createAlerts = async () => {
    if (!user?.id) throw new Error('Usuário não autenticado')

    try {
      const response = await fetch('/api/financial/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar alertas')
      }

      await fetchAlerts() // Recarregar lista
      return data.alerts_created
    } catch (err: any) {
      console.error('Erro ao criar alertas:', err)
      throw err
    }
  }

  const markAsRead = async (alertId: string) => {
    try {
      const response = await fetch('/api/financial/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alertId, is_read: true })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao marcar alerta como lido')
      }

      // Atualizar localmente
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ))

      return data.alert
    } catch (err: any) {
      console.error('Erro ao marcar alerta como lido:', err)
      throw err
    }
  }

  const dismiss = async (alertId: string) => {
    try {
      const response = await fetch('/api/financial/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alertId, is_dismissed: true })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao dispensar alerta')
      }

      // Remover localmente
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))

      return data.alert
    } catch (err: any) {
      console.error('Erro ao dispensar alerta:', err)
      throw err
    }
  }

  const deleteAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/financial/alerts?id=${alertId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar alerta')
      }

      // Remover localmente
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    } catch (err: any) {
      console.error('Erro ao deletar alerta:', err)
      throw err
    }
  }

  const getUnreadCount = () => {
    return alerts.filter(alert => !alert.is_read && !alert.is_dismissed).length
  }

  const getCriticalAlerts = () => {
    return alerts.filter(alert => 
      alert.severity === 'critical' && !alert.is_dismissed
    )
  }

  const getAlertsByType = (type: string) => {
    return alerts.filter(alert => alert.alert_type === type)
  }

  const getAlertsBySeverity = (severity: string) => {
    return alerts.filter(alert => alert.severity === severity)
  }

  const markAllAsRead = async () => {
    const unreadAlerts = alerts.filter(alert => !alert.is_read)
    
    try {
      await Promise.all(
        unreadAlerts.map(alert => markAsRead(alert.id))
      )
    } catch (err) {
      console.error('Erro ao marcar todos como lidos:', err)
      throw err
    }
  }

  const dismissAll = async () => {
    const activealerts = alerts.filter(alert => !alert.is_dismissed)
    
    try {
      await Promise.all(
        activealerts.map(alert => dismiss(alert.id))
      )
    } catch (err) {
      console.error('Erro ao dispensar todos:', err)
      throw err
    }
  }

  const getAlertIcon = (alertType: string) => {
    const icons: { [key: string]: string } = {
      budget_exceeded: '⚠️',
      unusual_spending: '🚨',
      low_balance: '💰',
      payment_due: '📅',
      goal_achieved: '🎯',
      debt_payoff: '💳',
      investment_change: '📈',
      subscription_renewal: '🔄'
    }
    return icons[alertType] || '🔔'
  }

  const getAlertColor = (severity: string) => {
    const colors: { [key: string]: string } = {
      low: 'blue',
      medium: 'yellow',
      high: 'orange',
      critical: 'red'
    }
    return colors[severity] || 'gray'
  }

  useEffect(() => {
    fetchAlerts()
  }, [user?.id])

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlerts,
    markAsRead,
    dismiss,
    deleteAlert,
    getUnreadCount,
    getCriticalAlerts,
    getAlertsByType,
    getAlertsBySeverity,
    markAllAsRead,
    dismissAll,
    getAlertIcon,
    getAlertColor
  }
}