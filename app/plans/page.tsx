"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useUserPlan } from "@/contexts/user-plan-context"
import { useSettingsContext } from "@/contexts/settings-context"
import { redirectToStripeCheckout, STRIPE_CONFIG } from "@/lib/stripe-config"

export default function PlansPage() {
  const { currentPlan, upgradeToProfessional, downgradeToBasic } = useUserPlan()
  const { user } = useSettingsContext()

  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 'R$ 19,90/mês',
      description: 'Funcionalidades essenciais',
      features: [
        'GPT-4o-mini',
        '5 perguntas/semana',
        'Resumo mensal simplificado',
        'Somente Web'
      ],
      current: currentPlan === 'basic'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 49,90/mês',
      description: 'IA e recursos avançados',
      features: [
        'GPT-4o-mini + GPT-4o limitado',
        '1 pergunta/dia',
        'Resumo mensal detalhado em PDF',
        'Histórico de conversas',
        'Alertas de gastos',
        'Web + Mobile'
      ],
      current: currentPlan === 'pro',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 59,90/mês',
      description: 'Recursos completos',
      features: [
        'GPT-4o-mini + GPT-4o completo',
        'Uso diário sem limite rígido',
        'Resumo mensal + análise financeira completa',
        'Relatórios PDF avançados com gráficos',
        'Histórico de conversas',
        'Suporte prioritário',
        'Web + Mobile'
      ],
      current: currentPlan === 'premium'
    }
  ]

  const handlePlanChange = async (planId: string) => {
    try {
      if (planId === 'pro' && currentPlan === 'basic') {
        await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: STRIPE_CONFIG.prices.PRO, plan: 'professional' })
        }).then(async (res) => {
          if (!res.ok) throw new Error('Falha ao criar sessão')
          const { sessionId } = await res.json()
          const { loadStripe } = await import('@stripe/stripe-js')
          const stripe = await loadStripe(STRIPE_CONFIG.publishableKey)
          if (!stripe) throw new Error('Stripe não carregou')
          await stripe.redirectToCheckout({ sessionId })
        })
      } else if (planId === 'premium') {
        await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ priceId: STRIPE_CONFIG.prices.PREMIUM, plan: 'premium' })
        }).then(async (res) => {
          if (!res.ok) throw new Error('Falha ao criar sessão')
          const { sessionId } = await res.json()
          const { loadStripe } = await import('@stripe/stripe-js')
          const stripe = await loadStripe(STRIPE_CONFIG.publishableKey)
          if (!stripe) throw new Error('Stripe não carregou')
          await stripe.redirectToCheckout({ sessionId })
        })
      } else if (planId === 'basic' && (currentPlan === 'pro' || currentPlan === 'premium')) {
        await downgradeToBasic()
      }
    } catch (error) {
      console.error('Erro ao processar plano:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
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
                {currentPlan === 'premium' ? 'Premium' : currentPlan === 'pro' ? 'Profissional' : 'Básico'}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
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
                    variant={plan.id !== 'basic' ? 'default' : 'outline'}
                    onClick={() => handlePlanChange(plan.id)}
                  >
                    {plan.id === 'basic' ? 'Fazer Downgrade' : 'Fazer Upgrade'}
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