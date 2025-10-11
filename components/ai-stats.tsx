import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertTriangle, PiggyBank, BarChart3 } from "lucide-react"

interface AIStatsProps {
  advices: Array<{
    id: string
    category: string
    priority: 'high' | 'medium' | 'low'
    savings?: string
  }>
}

export function AIStats({ advices }: AIStatsProps) {
  const stats = {
    total: advices.length,
    high: advices.filter(a => a.priority === 'high').length,
    medium: advices.filter(a => a.priority === 'medium').length,
    low: advices.filter(a => a.priority === 'low').length,
    withSavings: advices.filter(a => a.savings).length,
    categories: [...new Set(advices.map(a => a.category))].length
  }

  const totalSavings = advices
    .filter(a => a.savings)
    .reduce((acc, advice) => {
      const savings = advice.savings?.replace(/[^\d,]/g, '').replace(',', '.')
      return acc + (parseFloat(savings || '0') || 0)
    }, 0)

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4 text-primary" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Conselhos Totais</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{stats.high}</p>
              <p className="text-xs text-muted-foreground">Alta Prioridade</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <PiggyBank className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats.withSavings}</p>
              <p className="text-xs text-muted-foreground">Com Economia</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{stats.categories}</p>
              <p className="text-xs text-muted-foreground">Categorias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {totalSavings > 0 && (
        <Card className="col-span-2 md:col-span-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div className="text-center">
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  R$ {totalSavings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Economia Potencial Total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}