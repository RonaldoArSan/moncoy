import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Target
} from "lucide-react"

interface AISummaryProps {
  advices: Array<{
    priority: 'high' | 'medium' | 'low'
    category: string
    savings?: string
  }>
}

export function AISummary({ advices }: AISummaryProps) {
  const highPriorityCount = advices.filter(a => a.priority === 'high').length
  const totalAdvices = advices.length
  const hasHighPriority = highPriorityCount > 0
  
  const totalSavings = advices
    .filter(a => a.savings)
    .reduce((acc, advice) => {
      const savings = advice.savings?.replace(/[^\d,]/g, '').replace(',', '.')
      return acc + (parseFloat(savings || '0') || 0)
    }, 0)

  const healthScore = Math.max(0, 100 - (highPriorityCount * 25))

  const getHealthMessage = () => {
    if (healthScore >= 80) return "Suas finanças estão em ótimo estado!"
    if (healthScore >= 60) return "Suas finanças estão razoavelmente bem, mas há melhorias possíveis."
    if (healthScore >= 40) return "Suas finanças precisam de atenção em algumas áreas."
    return "Suas finanças precisam de atenção urgente!"
  }

  const getHealthIcon = () => {
    if (healthScore >= 80) return <CheckCircle className="w-5 h-5 text-green-500" />
    if (healthScore >= 60) return <TrendingUp className="w-5 h-5 text-blue-500" />
    if (healthScore >= 40) return <TrendingDown className="w-5 h-5 text-yellow-500" />
    return <AlertTriangle className="w-5 h-5 text-red-500" />
  }

  const getHealthColor = () => {
    if (healthScore >= 80) return "text-green-600"
    if (healthScore >= 60) return "text-blue-600"
    if (healthScore >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  if (totalAdvices === 0) return null

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Resumo Executivo da IA
        </CardTitle>
        <CardDescription>
          Análise geral da sua situação financeira
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Health Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getHealthIcon()}
              <span className="font-medium">Score de Saúde Financeira</span>
            </div>
            <span className={`text-2xl font-bold ${getHealthColor()}`}>
              {healthScore}%
            </span>
          </div>
          <Progress value={healthScore} className="h-2" />
          <p className="text-sm text-muted-foreground">{getHealthMessage()}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalAdvices}</div>
            <div className="text-xs text-muted-foreground">Conselhos Gerados</div>
          </div>
          
          {hasHighPriority && (
            <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{highPriorityCount}</div>
              <div className="text-xs text-muted-foreground">Prioridade Alta</div>
            </div>
          )}
          
          {totalSavings > 0 && (
            <div className="text-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                R$ {totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground">Economia Potencial</div>
            </div>
          )}
        </div>

        {/* Priority Alert */}
        {hasHighPriority && (
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
                Atenção Necessária
              </h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                Você tem {highPriorityCount} conselho{highPriorityCount > 1 ? 's' : ''} de alta prioridade que 
                {highPriorityCount > 1 ? ' precisam' : ' precisa'} de atenção imediata para melhorar sua situação financeira.
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {!hasHighPriority && healthScore >= 80 && (
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                Parabéns! 🎉
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Suas finanças estão em excelente estado. Continue assim e considere 
                implementar as sugestões de otimização para maximizar seus resultados.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}