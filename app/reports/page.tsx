"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExportModal } from "@/components/modals/export-modal"
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  DollarSign,
  CreditCard,
  Target,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useState } from "react"

export default function ReportsPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const monthlyData = [
    { month: "Jan", receitas: 8500, despesas: 6200, saldo: 2300 },
    { month: "Fev", receitas: 9200, despesas: 6800, saldo: 2400 },
    { month: "Mar", receitas: 8800, despesas: 7100, saldo: 1700 },
    { month: "Abr", receitas: 9500, despesas: 6900, saldo: 2600 },
    { month: "Mai", receitas: 9800, despesas: 7300, saldo: 2500 },
    { month: "Jun", receitas: 10200, despesas: 7800, saldo: 2400 },
  ]

  const categoryExpenses = [
    { category: "Alimentação", amount: 2850, percentage: 36.5, color: "bg-red-500" },
    { category: "Transporte", amount: 1200, percentage: 15.4, color: "bg-blue-500" },
    { category: "Moradia", amount: 2400, percentage: 30.8, color: "bg-green-500" },
    { category: "Lazer", amount: 680, percentage: 8.7, color: "bg-yellow-500" },
    { category: "Saúde", amount: 420, percentage: 5.4, color: "bg-purple-500" },
    { category: "Outros", amount: 250, percentage: 3.2, color: "bg-gray-500" },
  ]

  const topExpenses = [
    { description: "Supermercado Extra", category: "Alimentação", amount: 485.9, date: "15/06" },
    { description: "Posto Shell", category: "Transporte", amount: 320.0, date: "14/06" },
    { description: "Restaurante Italiano", category: "Alimentação", amount: 280.5, date: "12/06" },
    { description: "Farmácia São Paulo", category: "Saúde", amount: 156.8, date: "10/06" },
    { description: "Cinema Shopping", category: "Lazer", amount: 145.0, date: "08/06" },
  ]

  const kpis = {
    totalReceitas: 10200,
    totalDespesas: 7800,
    saldoMensal: 2400,
    economiaMedia: 2383,
    gastoMedioDiario: 260,
    maiorGasto: 485.9,
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center ml-12 md:ml-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">Análise detalhada das suas finanças</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Período
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => setIsExportModalOpen(true)}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">R$ {kpis.totalReceitas.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">R$ {kpis.totalDespesas.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">R$ {kpis.saldoMensal.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">Mensal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Economia Média</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {kpis.economiaMedia.toLocaleString("pt-BR")}</div>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gasto Diário</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {kpis.gastoMedioDiario}</div>
              <p className="text-xs text-muted-foreground">Média mensal</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maior Gasto</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {kpis.maiorGasto.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Este mês</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evolução Mensal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Evolução Mensal
              </CardTitle>
              <CardDescription>Receitas, despesas e saldo dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data) => (
                  <div key={data.month} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{data.month}</span>
                      <div className="text-right">
                        <div className="text-sm text-green-600">+R$ {data.receitas.toLocaleString("pt-BR")}</div>
                        <div className="text-sm text-red-600">-R$ {data.despesas.toLocaleString("pt-BR")}</div>
                        <div className="text-sm font-medium">R$ {data.saldo.toLocaleString("pt-BR")}</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(data.saldo / Math.max(...monthlyData.map((d) => d.saldo))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gastos por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Gastos por Categoria
              </CardTitle>
              <CardDescription>Distribuição das despesas deste mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryExpenses.map((category) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">R$ {category.amount.toLocaleString("pt-BR")}</div>
                      <div className="text-sm text-muted-foreground">{category.percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Maiores Gastos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Maiores Gastos do Mês
            </CardTitle>
            <CardDescription>Top 5 transações com maior valor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topExpenses.map((expense, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">{expense.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-red-600">-R$ {expense.amount.toFixed(2)}</div>
                    <Badge variant="secondary" className="text-xs">
                      {expense.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Modal */}
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title="Exportar Relatórios"
        description="Exporte relatórios financeiros detalhados."
      />
    </div>
  )
}
