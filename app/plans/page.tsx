"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useUserPlan } from "@/contexts/user-plan-context"
import { useSettingsContext } from "@/contexts/settings-context"

export default function PlansPage() {
  const { currentPlan, upgradeToProfessional, downgradeToBasic } = useUserPlan()
  const { user } = useSettingsContext()

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'Gratuito',
      description: 'Funcionalidades essenciais',
      features: [
        'Controle de receitas e despesas',
        'Categorização manual',
        'Relatórios básicos',
        'Até 3 metas financeiras'
      ],
      current: currentPlan === 'basic'
    },
    {
      id: 'professional',
      name: 'Profissional',
      price: 'R$ 29,99/mês',
      description: 'IA e recursos avançados',
      features: [
        'Tudo do plano Básico',
        'IA financeira personalizada',
        'Análise de comprovantes',
        'Categorização automática',
        'Relatórios avançados em PDF',
        'Metas ilimitadas',
        'Suporte prioritário'
      ],
      current: currentPlan === 'pro',
      popular: true
    }
  ]

  const handlePlanChange = async (planId: string) => {
    if (planId === 'professional' && currentPlan === 'basic') {
      // Redirecionar para Stripe
      window.open('http://localhost:3001', '_blank')
    } else if (planId === 'basic' && currentPlan === 'pro') {
      await downgradeToBasic()
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Planos e Assinaturas</h1>
            <p className="text-muted-foreground">Gerencie seu plano atual</p>
          </div>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Plano Atual
              <Badge variant="default">
                {currentPlan === 'pro' ? 'Profissional' : 'Básico'}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.current ? 'border-primary bg-primary/5' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="default">Mais Popular</Badge>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  {plan.current && <Badge variant="outline">Atual</Badge>}
                </div>
                <div className="text-2xl font-bold text-primary">{plan.price}</div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {!plan.current && (
                  <Button 
                    className="w-full" 
                    variant={plan.id === 'professional' ? 'default' : 'outline'}
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    {plan.id === 'professional' ? 'Fazer Upgrade' : 'Fazer Downgrade'}
                  </Button>
                )}
                
                {plan.current && (
                  <Button className="w-full" variant="outline" disabled>
                    Plano Atual
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}