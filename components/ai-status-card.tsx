"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Clock, CheckCircle, Lock } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import Link from "next/link"

export function AIStatusCard() {
  const { user, canUseAI, getDaysSinceRegistration, loading } = useUser()
  
  if (loading || !user) {
    return (
      <Card className="gradient-card card-hover">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-300 rounded mb-2"></div>
            <div className="h-8 bg-slate-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  const canUseAIFeatures = canUseAI()
  const daysRemaining = Math.max(0, 22 - getDaysSinceRegistration())

  if (user.plan === "basic") {
    return (
      <Card className="gradient-card card-hover border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200 dark:text-slate-100">
            Conselhos de IA
          </CardTitle>
          <Lock className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-300 mb-2">Bloqueado</div>
          <p className="text-xs text-slate-400 mb-3">
            Disponível no plano Profissional
          </p>
          <Button size="sm" variant="outline" className="w-full">
            Fazer Upgrade
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (user.plan === "professional" && !canUseAIFeatures) {
    return (
      <Card className="gradient-card card-hover border-amber-200 dark:border-amber-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-200 dark:text-slate-100">
            Conselhos de IA
          </CardTitle>
          <Clock className="h-4 w-4 text-amber-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-300 mb-2">
            {daysRemaining} dias
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Restantes para desbloquear
          </p>
          <Badge variant="secondary" className="text-xs">
            Período de carência
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="gradient-card card-hover border-green-200 dark:border-green-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-200 dark:text-slate-100">
          Conselhos de IA
        </CardTitle>
        <Brain className="h-4 w-4 text-green-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-300 mb-2">Ativo</div>
        <p className="text-xs text-slate-400 mb-3">
          IA disponível para uso
        </p>
        <Link href="/ai-advice">
          <Button size="sm" variant="outline" className="w-full">
            Acessar IA
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}