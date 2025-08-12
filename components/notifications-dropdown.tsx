"use client"

import type React from "react"

import { Bell, Check, X, AlertCircle, TrendingUp, CreditCard, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

interface Notification {
  id: string
  type: "info" | "warning" | "success" | "error"
  title: string
  message: string
  time: string
  read: boolean
  icon: React.ReactNode
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Orçamento Excedido",
      message: "Você excedeu 90% do orçamento de Alimentação este mês",
      time: "2 min atrás",
      read: false,
      icon: <AlertCircle className="h-4 w-4 text-warning-500" />,
    },
    {
      id: "2",
      type: "success",
      title: "Meta Atingida",
      message: "Parabéns! Você atingiu sua meta de economia mensal",
      time: "1 hora atrás",
      read: false,
      icon: <Target className="h-4 w-4 text-success-500" />,
    },
    {
      id: "3",
      type: "info",
      title: "Investimento Valorizado",
      message: "Suas ações da PETR4 subiram 5% hoje",
      time: "3 horas atrás",
      read: false,
      icon: <TrendingUp className="h-4 w-4 text-primary-500" />,
    },
    {
      id: "4",
      type: "info",
      title: "Fatura do Cartão",
      message: "Fatura do cartão Nubank vence em 3 dias",
      time: "1 dia atrás",
      read: true,
      icon: <CreditCard className="h-4 w-4 text-primary-500" />,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">Nenhuma notificação</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-muted/50 transition-colors ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {notification.title}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Marcar como lida
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
