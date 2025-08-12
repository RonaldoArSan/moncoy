"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NewInvestmentModal } from "@/components/modals/new-investment-modal"
import { ExportModal } from "@/components/modals/export-modal"
import { TrendingUp, PlusCircle, DollarSign, BarChart3, Calculator, FileText, Eye, MoreHorizontal } from "lucide-react"
import { useState } from "react"

export default function InvestmentsPage() {
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const portfolio = {
    totalValue: 125750.8,
    totalInvested: 118500.0,
    totalGain: 7250.8,
    gainPercentage: 6.12,
    monthlyGain: 1850.3,
    monthlyGainPercentage: 1.49,
  }

  const investments = [
    {
      id: 1,
      name: "Tesouro Selic 2029",
      type: "Renda Fixa",
      quantity: 50,
      avgPrice: 105.5,
      currentPrice: 108.2,
      totalValue: 5410.0,
      gain: 135.0,
      gainPercentage: 2.56,
      allocation: 4.3,
    },
    {
      id: 2,
      name: "ITSA4",
      type: "Ações",
      quantity: 200,
      avgPrice: 9.85,
      currentPrice: 11.2,
      totalValue: 2240.0,
      gain: 270.0,
      gainPercentage: 13.71,
      allocation: 1.8,
    },
    {
      id: 3,
      name: "PETR4",
      type: "Ações",
      quantity: 100,
      avgPrice: 28.5,
      currentPrice: 32.1,
      totalValue: 3210.0,
      gain: 360.0,
      gainPercentage: 12.63,
      allocation: 2.6,
    },
    {
      id: 4,
      name: "HASH11",
      type: "FII",
      quantity: 150,
      avgPrice: 95.2,
      currentPrice: 98.5,
      totalValue: 14775.0,
      gain: 495.0,
      gainPercentage: 3.47,
      allocation: 11.7,
    },
    {
      id: 5,
      name: "IVVB11",
      type: "ETF",
      quantity: 300,
      avgPrice: 285.0,
      currentPrice: 295.8,
      totalValue: 88740.0,
      gain: 3240.0,
      gainPercentage: 3.79,
      allocation: 70.6,
    },
  ]

  const categories = [
    { name: "ETFs", value: 88740.0, percentage: 70.6, color: "bg-blue-500" },
    { name: "FIIs", value: 14775.0, percentage: 11.7, color: "bg-green-500" },
    { name: "Renda Fixa", value: 5410.0, percentage: 4.3, color: "bg-yellow-500" },
    { name: "Ações", value: 5450.0, percentage: 4.4, color: "bg-purple-500" },
    { name: "Reserva", value: 11375.8, percentage: 9.0, color: "bg-gray-500" },
  ]

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
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R$ {portfolio.totalGain.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">+{portfolio.gainPercentage.toFixed(2)}% total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ganho Mensal</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                R$ {portfolio.monthlyGain.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">+{portfolio.monthlyGainPercentage.toFixed(2)}% este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diversificação</CardTitle>
              <CardDescription>Categorias de ativos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        R$ {category.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                    <th className="text-right py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment.id} className="border-b hover:bg-muted/50">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{investment.name}</div>
                          <Badge variant="secondary" className="text-xs">
                            {investment.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="text-right py-3">{investment.quantity}</td>
                      <td className="text-right py-3">R$ {investment.avgPrice.toFixed(2)}</td>
                      <td className="text-right py-3">R$ {investment.currentPrice.toFixed(2)}</td>
                      <td className="text-right py-3 font-medium">
                        R$ {investment.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td
                        className={`text-right py-3 font-medium ${
                          investment.gain >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {investment.gain >= 0 ? "+" : ""}R$ {investment.gain.toFixed(2)}
                      </td>
                      <td
                        className={`text-right py-3 font-medium ${
                          investment.gainPercentage >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {investment.gainPercentage >= 0 ? "+" : ""}
                        {investment.gainPercentage.toFixed(2)}%
                      </td>
                      <td className="text-right py-3">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <NewInvestmentModal open={isInvestmentModalOpen} onOpenChange={setIsInvestmentModalOpen} />
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title="Exportar Investimentos"
        description="Exporte dados da sua carteira de investimentos."
      />
    </div>
  )
}
