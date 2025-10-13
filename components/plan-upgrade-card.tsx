"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap, Lock } from "lucide-react"
import { useUserPlan } from "@/contexts/user-plan-context"

interface PlanUpgradeCardProps {
  feature: string
  description: string
  className?: string
}

export function PlanUpgradeCard({ feature, description, className }: PlanUpgradeCardProps) {
  const { upgradeToProfessional } = useUserPlan()

  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Lock className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Funcionalidade Premium</h3>
        <p className="text-muted-foreground mb-2 font-medium">{feature}</p>
        <p className="text-muted-foreground mb-6 max-w-md text-sm">{description}</p>
        <div className="flex gap-4">
          <Button onClick={upgradeToProfessional}>
            <Zap className="mr-2 h-4 w-4" />
            Fazer Upgrade
          </Button>
          <Button variant="outline">Saiba Mais</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PlanBadge({ className }: { className?: string }) {
  const { currentPlan } = useUserPlan()

  return (
    <Badge variant={currentPlan === "pro" || currentPlan === "premium" ? "default" : "secondary"} className={className}>
      {(currentPlan === "pro" || currentPlan === "premium") && <Crown className="w-3 h-3 mr-1" />}
      {currentPlan === "premium" ? "PREMIUM" : currentPlan === "pro" ? "PRO" : "BÁSICO"}
    </Badge>
  )
}
