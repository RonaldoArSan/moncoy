"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Brain, Sparkles, TrendingUp, AlertCircle } from "lucide-react"
import { useUserPlan, useFeatureAccess } from "@/contexts/user-plan-context"
import { PlanUpgradeCard } from "@/components/plan-upgrade-card"

const mockAdvices = [
  {
    id: 1,
    category: "Economia",
    title: "Oportunidade de Economia Detectada",
    content:
      "Seus gastos com alimentação aumentaram 23% este mês. Considere preparar mais refeições em casa para economizar até R$ 450/mês.",
    priority: "high",
    savings: "R$ 450",
  },
  {
    id: 2,
    category: "Investimentos",
    title: "Diversificação de Portfólio",
    content:
      "Sua carteira está 80% concentrada em renda fixa. Considere diversificar com 20% em ações para potencializar ganhos a longo prazo.",
    priority: "medium",
    savings: null,
  },
  {
    id: 3,
    category: "Planejamento",
    title: "Meta de Emergência",
    content:
      "Você está próximo de atingir sua reserva de emergência! Faltam apenas R$ 2.500 para completar 6 meses de gastos essenciais.",
    priority: "low",
    savings: null,
  },
]

export default function AIAdvicePage() {
  const [question, setQuestion] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const { currentPlan } = useUserPlan()
  const hasAIAdvice = useFeatureAccess("aiAdvice")

  const handleAskAI = async () => {
    if (!question.trim()) return

    setIsLoading(true)
    // Simulate AI response
    setTimeout(() => {
      setAiResponse(
        `Com base na sua pergunta sobre "${question}", recomendo que você analise seus padrões de gastos dos últimos 3 meses. Considere criar um orçamento específico para essa categoria e estabeleça metas mensais realistas. Lembre-se de sempre manter sua reserva de emergência intacta.`,
      )
      setIsLoading(false)
    }, 2000)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta Prioridade"
      case "medium":
        return "Média Prioridade"
      case "low":
        return "Baixa Prioridade"
      default:
        return "Normal"
    }
  }

  if (!hasAIAdvice) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Conselhos de IA</h1>
          <p className="text-muted-foreground">Receba orientações personalizadas baseadas em inteligência artificial</p>
        </div>

        <PlanUpgradeCard
          feature="Conselhos de IA Personalizados"
          description="Os conselhos personalizados de IA estão disponíveis apenas para usuários do plano Profissional. Upgrade sua conta para receber insights inteligentes sobre suas finanças."
        />

        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">Prévia dos Recursos Premium</h3>
          <div className="grid gap-4 opacity-50 pointer-events-none">
            {mockAdvices.slice(0, 2).map((advice) => (
              <Card key={advice.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{advice.category}</Badge>
                    <Badge variant={getPriorityColor(advice.priority)}>{getPriorityText(advice.priority)}</Badge>
                  </div>
                  <CardTitle className="text-lg">{advice.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">{advice.content}</p>
                  {advice.savings && (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      <span className="font-medium">Economia potencial: {advice.savings}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conselhos de IA</h1>
        <p className="text-muted-foreground">Receba orientações personalizadas baseadas em inteligência artificial</p>
      </div>

      {/* AI Chat Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="mr-2 h-5 w-5" />
            Pergunte ao Assistente IA
          </CardTitle>
          <CardDescription>
            Faça perguntas específicas sobre suas finanças e receba conselhos personalizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ex: Como posso economizar mais dinheiro este mês? Devo investir em ações agora?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
          />
          <Button onClick={handleAskAI} disabled={isLoading || !question.trim()}>
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Perguntar à IA
              </>
            )}
          </Button>

          {aiResponse && (
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <Brain className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium mb-2">Resposta da IA:</p>
                    <p className="text-sm text-muted-foreground">{aiResponse}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Insights Personalizados</h2>
          <Badge variant="outline" className="text-xs">
            <Sparkles className="mr-1 h-3 w-3" />
            Atualizado hoje
          </Badge>
        </div>

        <div className="grid gap-4">
          {mockAdvices.map((advice) => (
            <Card key={advice.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{advice.category}</Badge>
                  <Badge variant={getPriorityColor(advice.priority)}>{getPriorityText(advice.priority)}</Badge>
                </div>
                <CardTitle className="text-lg">{advice.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">{advice.content}</p>
                {advice.savings && (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span className="font-medium">Economia potencial: {advice.savings}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    Aplicar Sugestão
                  </Button>
                  <Button size="sm" variant="ghost">
                    Dispensar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5" />
            Configurações da IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Frequência de Insights</p>
              <p className="text-sm text-muted-foreground">Com que frequência você quer receber novos conselhos</p>
            </div>
            <Badge variant="secondary">Diário</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nível de Detalhamento</p>
              <p className="text-sm text-muted-foreground">Quão detalhados devem ser os conselhos</p>
            </div>
            <Badge variant="secondary">Avançado</Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Chave API OpenAI</p>
              <p className="text-sm text-muted-foreground">Sua chave pessoal para análises avançadas</p>
            </div>
            <Button variant="outline" size="sm">
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
