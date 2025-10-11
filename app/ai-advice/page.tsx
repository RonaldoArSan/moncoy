"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Brain, 
  Loader2, 
  TrendingUp, 
  DollarSign, 
  Target,
  AlertTriangle,
  PiggyBank,
  BarChart3,
  RefreshCw,
  Lightbulb,
  TrendingDown
} from "lucide-react"
import { useAIAdvice } from "@/hooks/use-ai-advice"
import { useUserPlan } from "@/contexts/user-plan-context"
import { AIStats } from "@/components/ai-stats"
import { AIFilters } from "@/components/ai-filters"
import { AISummary } from "@/components/ai-summary"

const priorityConfig = {
  high: {
    color: "destructive",
    icon: AlertTriangle,
    label: "Alta Prioridade"
  },
  medium: {
    color: "default",
    icon: TrendingDown,
    label: "Média Prioridade"
  },
  low: {
    color: "secondary",
    icon: Lightbulb,
    label: "Baixa Prioridade"
  }
} as const

const categoryConfig = {
  "Alerta": {
    icon: AlertTriangle,
    color: "text-red-500"
  },
  "Economia": {
    icon: PiggyBank,
    color: "text-green-500"
  },
  "Investimentos": {
    icon: TrendingUp,
    color: "text-blue-500"
  },
  "Planejamento": {
    icon: BarChart3,
    color: "text-purple-500"
  }
} as const

export default function AIAdvicePage() {
  const { advices, loading, refreshAdvices } = useAIAdvice()
  const { currentPlan, upgradeToProfessional } = useUserPlan()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)

  const handleRefresh = () => {
    refreshAdvices()
  }

  // Filter advices based on selected filters
  const filteredAdvices = advices.filter(advice => {
    const categoryMatch = !selectedCategory || advice.category === selectedCategory
    const priorityMatch = !selectedPriority || advice.priority === selectedPriority
    return categoryMatch && priorityMatch
  })

  // Get unique categories for filter options
  const categories = [...new Set(advices.map(advice => advice.category))]

  // Mostrar upgrade se for plano básico
  if (currentPlan === 'basic') {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">IA Financeira</h1>
            <p className="text-muted-foreground">Conselhos inteligentes para suas finanças</p>
          </div>
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">IA Financeira Profissional</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Obtenha insights inteligentes, sugestões de orçamento e análises preditivas com nossa IA especializada em finanças.
              </p>
              <div className="flex gap-2">
                <Button onClick={upgradeToProfessional}>
                  Upgrade para Pro
                </Button>
                <Button onClick={upgradeToProfessional} variant="outline">
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
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-8 h-8 text-primary" />
              IA Financeira
            </h1>
            <p className="text-muted-foreground">Conselhos personalizados baseados em suas transações</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Badge variant={currentPlan === 'premium' ? 'destructive' : 'default'}>
              <Brain className="w-3 h-3 mr-1" />
              {currentPlan.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Analisando suas transações para gerar conselhos personalizados...
              </AlertDescription>
            </Alert>
            
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Summary Overview */}
        {!loading && advices.length > 0 && (
          <AISummary advices={advices} />
        )}

        {/* Stats Overview */}
        {!loading && advices.length > 0 && (
          <AIStats advices={filteredAdvices} />
        )}

        {/* Filters */}
        {!loading && advices.length > 0 && categories.length > 1 && (
          <AIFilters
            selectedCategory={selectedCategory}
            selectedPriority={selectedPriority}
            onCategoryChange={setSelectedCategory}
            onPriorityChange={setSelectedPriority}
            categories={categories}
          />
        )}

        {/* Advices Grid */}
        {!loading && filteredAdvices.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredAdvices.map((advice) => {
              const priorityInfo = priorityConfig[advice.priority]
              const categoryInfo = categoryConfig[advice.category as keyof typeof categoryConfig]
              const PriorityIcon = priorityInfo.icon
              const CategoryIcon = categoryInfo?.icon || Target

              return (
                <Card key={advice.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className={`w-5 h-5 ${categoryInfo?.color || 'text-muted-foreground'}`} />
                        <Badge variant="outline" className="text-xs">
                          {advice.category}
                        </Badge>
                      </div>
                      <Badge variant={priorityInfo.color as any} className="text-xs">
                        <PriorityIcon className="w-3 h-3 mr-1" />
                        {priorityInfo.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{advice.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed mb-3">
                      {advice.content}
                    </CardDescription>
                    
                    {advice.savings && (
                      <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                          Economia potencial: {advice.savings}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State - No advices after filtering */}
        {!loading && advices.length > 0 && filteredAdvices.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum Conselho Encontrado</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Não encontramos conselhos com os filtros selecionados. Tente ajustar os filtros ou limpar a seleção.
              </p>
              <Button 
                onClick={() => {
                  setSelectedCategory(null)
                  setSelectedPriority(null)
                }} 
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State - No data */}
        {!loading && advices.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Brain className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Sem Dados Suficientes</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Continue registrando suas transações para que eu possa fornecer conselhos mais personalizados.
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Como funciona nossa IA?
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Analisamos seus padrões de gastos, categorias de despesas e tendências mensais para 
                  gerar conselhos personalizados que podem ajudar você a economizar e organizar melhor suas finanças.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}