"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { NewInvestmentModal } from "@/components/modals/new-investment-modal"
import { ExportModal } from "@/components/modals/export-modal"
import { TrendingUp, PlusCircle, DollarSign, BarChart3, Calculator, FileText, Eye, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { useInvestments } from "@/hooks/use-investments"

export default function InvestmentsPage() {
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  
  const { investments, loading, calculatePortfolioSummary, getAssetTypeDistribution } = useInvestments()
  
  const portfolio = calculatePortfolioSummary()
  const assetDistribution = getAssetTypeDistribution()
  
  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'stocks': 'Ações',
      'fii': 'FIIs',
      'etf': 'ETFs',
      'fixed_income': 'Renda Fixa',
      'crypto': 'Crypto',
      'funds': 'Fundos',
      'others': 'Outros'
    }
    return labels[type] || type
  }
  
  const getAssetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'stocks': 'bg-purple-500',
      'fii': 'bg-green-500',
      'etf': 'bg-blue-500',
      'fixed_income': 'bg-yellow-500',
      'crypto': 'bg-orange-500',
      'funds': 'bg-indigo-500',
      'others': 'bg-gray-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center ml-12 md:ml-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Investimentos</h1>
            <p className="text-muted-foreground">Acompanhe sua carteira de investimentos</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calculator className="w-4 h-4 mr-2" />
              Calcular IR
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => setIsInvestmentModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Novo Investimento
            </Button>
          </div>
        </div>

        {/* Resumo da Carteira */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {portfolio.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Investido: R$ {portfolio.totalInvested.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ganho Total</CardTitle>
                  <TrendingUp className={`h-4 w-4 ${portfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${portfolio.totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolio.totalGain >= 0 ? '+' : ''}R$ {portfolio.totalGain.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {portfolio.gainPercentage >= 0 ? '+' : ''}{portfolio.gainPercentage.toFixed(2)}% total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Ativos</CardTitle>
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {investments.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Investimentos ativos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diversificação</CardTitle>
                  <CardDescription>Categorias de ativos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assetDistribution.map((item) => (
                      <div key={item.type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${getAssetTypeColor(item.type)}`} />
                          <span className="font-medium">{getAssetTypeLabel(item.type)}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-muted-foreground">{item.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Alocação por Categoria */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Posições</CardTitle>
                <CardDescription>Detalhes dos seus investimentos</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsExportModalOpen(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="space-y-2 text-right">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : investments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum investimento encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Ativo</th>
                      <th className="text-right py-2">Qtd</th>
                      <th className="text-right py-2">Preço Médio</th>
                      <th className="text-right py-2">Preço Atual</th>
                      <th className="text-right py-2">Valor Total</th>
                      <th className="text-right py-2">Ganho/Perda</th>
                      <th className="text-right py-2">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {investments.map((investment) => {
                      const currentPrice = investment.current_price || investment.avg_price
                      const totalValue = investment.quantity * currentPrice
                      const totalInvested = investment.quantity * investment.avg_price
                      const gain = totalValue - totalInvested
                      const gainPercentage = totalInvested > 0 ? (gain / totalInvested) * 100 : 0
                      
                      return (
                        <tr key={investment.id} className="border-b hover:bg-muted/50">
                          <td className="py-3">
                            <div>
                              <div className="font-medium">{investment.asset_name}</div>
                              <Badge variant="secondary" className="text-xs">
                                {getAssetTypeLabel(investment.asset_type)}
                              </Badge>
                            </div>
                          </td>
                          <td className="text-right py-3">{investment.quantity}</td>
                          <td className="text-right py-3">R$ {investment.avg_price.toFixed(2)}</td>
                          <td className="text-right py-3">R$ {currentPrice.toFixed(2)}</td>
                          <td className="text-right py-3 font-medium">
                            R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </td>
                          <td
                            className={`text-right py-3 font-medium ${
                              gain >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {gain >= 0 ? "+" : ""}R$ {gain.toFixed(2)}
                          </td>
                          <td
                            className={`text-right py-3 font-medium ${
                              gainPercentage >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {gainPercentage >= 0 ? "+" : ""}
                            {gainPercentage.toFixed(2)}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <NewInvestmentModal 
        open={isInvestmentModalOpen} 
        onOpenChange={setIsInvestmentModalOpen}
      />
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title="Exportar Investimentos"
        description="Exporte dados da sua carteira de investimentos."
      />
    </div>
  )
}
