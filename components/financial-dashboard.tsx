"use client"

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFinancialSummary } from '@/hooks/use-financial-summary'
import { useFinancialAlerts } from '@/hooks/use-financial-alerts'
import { useBudgets } from '@/hooks/use-budgets'
import { useDebts } from '@/hooks/use-debts'
import { useFinancialAccounts } from '@/hooks/use-financial-accounts'
import { AlertTriangle, TrendingUp, TrendingDown, DollarSign, CreditCard, Target, Calendar, PiggyBank } from 'lucide-react'

export function FinancialDashboard() {
  const { 
    summary, 
    loading: summaryLoading, 
    error: summaryError,
    getFinancialHealth,
    getSpendingTrend,
    hasUnusualSpending,
    fetchSummary 
  } = useFinancialSummary()

  const { 
    alerts, 
    loading: alertsLoading,
    getUnreadCount,
    getCriticalAlerts,
    markAsRead,
    dismiss,
    createAlerts
  } = useFinancialAlerts()

  const { 
    budgets, 
    loading: budgetsLoading,
    getBudgetProgress,
    getBudgetStatus 
  } = useBudgets()

  const { 
    debts, 
    loading: debtsLoading,
    getTotalDebt,
    getDebtProgress 
  } = useDebts()

  const { 
    accounts, 
    loading: accountsLoading,
    getTotalBalance,
    getCreditUtilization 
  } = useFinancialAccounts()

  // Atualizar alertas automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      createAlerts().catch(console.error)
    }, 30000) // A cada 30 segundos

    return () => clearInterval(interval)
  }, [])

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
      default: return 'Desconhecida'
    }
  }

  if (summaryLoading || alertsLoading || budgetsLoading || debtsLoading || accountsLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (summaryError) {
    return (
      <Alert className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erro ao carregar dados</AlertTitle>
        <AlertDescription>{summaryError}</AlertDescription>
      </Alert>
    )
  }

  const financialHealth = getFinancialHealth()
  const spendingTrend = getSpendingTrend()
  const criticalAlerts = getCriticalAlerts()
  const unreadAlertsCount = getUnreadCount()

  return (
    <div className="p-6 space-y-6">
      {/* Alertas Críticos */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Alertas Críticos</AlertTitle>
          <AlertDescription className="text-red-700">
            Você tem {criticalAlerts.length} alerta(s) crítico(s) que precisam de atenção.
            <div className="mt-2 space-y-1">
              {criticalAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="flex items-center justify-between">
                  <span className="text-sm">{alert.title}</span>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => markAsRead(alert.id)}
                    >
                      Marcar como lido
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => dismiss(alert.id)}
                    >
                      Dispensar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.net_worth || 0)}
            </div>
            <p className={`text-xs ${getHealthColor(financialHealth)}`}>
              Saúde financeira: {getHealthText(financialHealth)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTotalBalance())}
            </div>
            <p className="text-xs text-muted-foreground">
              {accounts.length} conta(s) ativa(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dívidas Totais</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(getTotalDebt())}
            </div>
            <p className="text-xs text-muted-foreground">
              {debts.length} dívida(s) ativa(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Poupança</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(summary?.savings_rate || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos 6 meses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes seções */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="budgets">Orçamentos</TabsTrigger>
          <TabsTrigger value="debts">Dívidas</TabsTrigger>
          <TabsTrigger value="alerts">
            Alertas {unreadAlertsCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {unreadAlertsCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gastos por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Gastos por Categoria</CardTitle>
                <CardDescription>Últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {spendingTrend.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">{category.category_name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {formatCurrency(category.total_amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {category.percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Gastos Incomuns */}
            {hasUnusualSpending() && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span>Gastos Incomuns Detectados</span>
                  </CardTitle>
                  <CardDescription>
                    Transações que fogem do padrão normal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary?.unusual_spending?.slice(0, 3).map((spending, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <div>
                          <div className="text-sm font-medium">{spending.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {spending.category_name} • {new Date(spending.date).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
                            {formatCurrency(spending.amount)}
                          </div>
                          <div className="text-xs text-yellow-600">
                            +{spending.deviation_percentage.toFixed(0)}% do normal
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgets.map(budget => {
              const progress = getBudgetProgress(budget)
              const status = getBudgetStatus(budget)
              
              return (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{budget.name}</CardTitle>
                      <Badge variant={status === 'exceeded' ? 'destructive' : status === 'warning' ? 'secondary' : 'default'}>
                        {status === 'exceeded' ? 'Excedido' : status === 'warning' ? 'Atenção' : 'Normal'}
                      </Badge>
                    </div>
                    <CardDescription>{budget.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Gasto: {formatCurrency(budget.spent_amount)}</span>
                        <span>Limite: {formatCurrency(budget.total_amount)}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {progress.toFixed(1)}% utilizado
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="debts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {debts.map(debt => {
              const progress = getDebtProgress(debt)
              
              return (
                <Card key={debt.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{debt.name}</CardTitle>
                      <Badge variant={debt.is_active ? 'destructive' : 'secondary'}>
                        {debt.is_active ? 'Ativa' : 'Quitada'}
                      </Badge>
                    </div>
                    <CardDescription>{debt.creditor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Saldo atual: {formatCurrency(debt.current_balance)}</span>
                        <span>Original: {formatCurrency(debt.original_amount)}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progress.toFixed(1)}% quitado</span>
                        <span>Pagamento mínimo: {formatCurrency(debt.minimum_payment)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="space-y-3">
            {alerts.map(alert => (
              <Card key={alert.id} className={`${alert.severity === 'critical' ? 'border-red-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{alert.alert_type === 'budget_exceeded' ? '⚠️' : '🔔'}</span>
                      <CardTitle className="text-base">{alert.title}</CardTitle>
                      {!alert.is_read && (
                        <Badge variant="secondary" className="h-5">Novo</Badge>
                      )}
                    </div>
                    <div className="space-x-2">
                      {!alert.is_read && (
                        <Button size="sm" variant="outline" onClick={() => markAsRead(alert.id)}>
                          Marcar como lido
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => dismiss(alert.id)}>
                        Dispensar
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleString('pt-BR')}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {alerts.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum alerta encontrado</p>
                    <p className="text-sm">Seus alertas financeiros aparecerão aqui</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}