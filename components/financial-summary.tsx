"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useFinancialSummary } from "@/hooks/use-financial-summary"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  AlertTriangle,
} from "lucide-react"

export function FinancialSummary() {
  const { 
    summary, 
    loading, 
    error,
    getFinancialHealth,
    getActiveAlertsCount,
    getCriticalAlertsCount,
    // Legacy compatibility
    totalBalance,
    totalIncome, 
    totalExpenses, 
    totalInvestments, 
    totalSavings 
  } = useFinancialSummary()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="flex items-center space-x-2 p-4">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-600">Erro ao carregar resumo financeiro</span>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600'
      case 'good': return 'text-blue-600'
      case 'fair': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getHealthText = (health: string) => {
    switch (health) {
      case 'excellent': return 'Excelente'
      case 'good': return 'Boa'
      case 'fair': return 'Regular'
      case 'poor': return 'Ruim'
      default: return 'Avaliando...'
    }
  }

  const financialHealth = getFinancialHealth()
  const activeAlerts = getActiveAlertsCount()
  const criticalAlerts = getCriticalAlertsCount()

  return (
    <div className="space-y-6">
      {/* Resumo de Saúde Financeira */}
      {summary && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Saúde Financeira</span>
              <div className="flex space-x-2">
                {activeAlerts > 0 && (
                  <Badge variant="destructive">
                    {activeAlerts} alerta{activeAlerts > 1 ? 's' : ''}
                  </Badge>
                )}
                <Badge variant={financialHealth === 'excellent' || financialHealth === 'good' ? 'default' : 'secondary'}>
                  {getHealthText(financialHealth)}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Patrimônio Líquido</span>
                <div className="font-semibold">{formatCurrency(summary.net_worth)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Taxa de Poupança</span>
                <div className="font-semibold">{(summary.savings_rate || 0).toFixed(1)}%</div>
              </div>
              <div>
                <span className="text-muted-foreground">Dívida Total</span>
                <div className="font-semibold text-red-600">{formatCurrency(summary.total_debt || 0)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Renda Líquida</span>
                <div className="font-semibold">{formatCurrency(summary.net_income || 0)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <a href="/transactions?filter=receitas&periodo=todos_os_periodos" className="block">
          <Card className="border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">
                Receitas
              </CardTitle>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(summary?.total_income || totalIncome)}
              </div>
              <p className="text-xs text-green-600/80 dark:text-green-400/80 flex items-center mt-1 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Total do período
              </p>
            </CardContent>
          </Card>
        </a>

        <a href="/transactions?filter=despesas&periodo=todos_os_periodos" className="block">
          <Card className="border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300">
                Despesas
              </CardTitle>
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(summary?.total_expenses || totalExpenses)}
              </div>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 flex items-center mt-1 font-medium">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                Total do período
              </p>
            </CardContent>
          </Card>
        </a>

        <a href="/investments" className="block">
          <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Investimentos
              </CardTitle>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(summary?.total_investments || totalInvestments)}
              </div>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/80 flex items-center mt-1 font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                Valor atual
              </p>
            </CardContent>
          </Card>
        </a>

        <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Saldo Total
            </CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <PiggyBank className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(summary?.total_balance || totalBalance)}
            </div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 flex items-center mt-1 font-medium">
              <PiggyBank className="h-3 w-3 mr-1" />
              Todas as contas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Críticos */}
      {criticalAlerts > 0 && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="flex items-center space-x-2 p-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-semibold text-red-800 dark:text-red-200">
                {criticalAlerts} alerta{criticalAlerts > 1 ? 's' : ''} crítico{criticalAlerts > 1 ? 's' : ''}
              </div>
              <div className="text-sm text-red-600 dark:text-red-300">
                Requer sua atenção imediata
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}