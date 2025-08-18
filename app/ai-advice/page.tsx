"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Loader2, TrendingUp, DollarSign, Target } from "lucide-react"
import { useState } from "react"
import { useAI } from "@/hooks/use-ai"
import { useTransactions } from "@/hooks/use-transactions"
import { useUserPlan } from "@/contexts/user-plan-context"

export default function AIAdvicePage() {
  const [analysis, setAnalysis] = useState<string>("")
  const { analyzeTransactions, loading, usage, isAvailable } = useAI()
  const { transactions } = useTransactions()
  const { currentPlan, upgradeToProfessional } = useUserPlan()

  const handleAnalysis = async (type: string) => {
    try {
      const result = await analyzeTransactions(transactions, type)
      setAnalysis(result)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro na análise')
    }
  }

  if (!isAvailable) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">IA Financeira</h1>
            <p className="text-muted-foreground">Análises inteligentes para suas finanças</p>
          </div>
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">IA Financeira Profissional</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Obtenha insights inteligentes, sugestões de orçamento e análises preditivas com nossa IA especializada em finanças.
              </p>
              <div className="flex gap-2">
                <Button onClick={upgradeToPro}>
                  Upgrade para Pro
                </Button>
                <Button onClick={upgradeToPremium} variant="outline">
                  Upgrade para Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">IA Financeira</h1>
            <p className="text-muted-foreground">Análises inteligentes para suas finanças</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {usage.remaining} perguntas restantes
            </Badge>
            <Badge variant={currentPlan === 'premium' ? 'destructive' : currentPlan === 'pro' ? 'default' : 'secondary'}>
              <Brain className="w-3 h-3 mr-1" />
              {currentPlan.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-24 flex-col"
            onClick={() => handleAnalysis('spending_analysis')}
            disabled={loading}
          >
            <TrendingUp className="w-6 h-6 mb-2" />
            Análise de Gastos
          </Button>
          
          <Button
            variant="outline"
            className="h-24 flex-col"
            onClick={() => handleAnalysis('budget_suggestions')}
            disabled={loading}
          >
            <DollarSign className="w-6 h-6 mb-2" />
            Sugestões de Orçamento
          </Button>
          
          <Button
            variant="outline"
            className="h-24 flex-col"
            onClick={() => handleAnalysis('category_prediction')}
            disabled={loading}
          >
            <Target className="w-6 h-6 mb-2" />
            Categorização IA
          </Button>
        </div>

        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Analisando com IA...
            </CardContent>
          </Card>
        )}

        {analysis && !loading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Análise da IA
              </CardTitle>
              <CardDescription>Insights baseados em suas transações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{analysis}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}