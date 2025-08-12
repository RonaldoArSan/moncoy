"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { NewTransactionModal } from "@/components/modals/new-transaction-modal"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  CreditCard,
  PiggyBank,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Lightbulb,
  Zap,
} from "lucide-react"

export default function Dashboard() {
  const [showNewTransaction, setShowNewTransaction] = useState(false)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header com gradiente */}
      <div className="gradient-hero rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-shadow-md">Bem-vindo de volta!</h1>
            <p className="text-blue-100 mt-2">Aqui está um resumo das suas finanças hoje</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Saldo Total</p>
            <p className="text-3xl font-bold text-shadow-md">R$ 12.450,00</p>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-success-200 dark:border-success-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-success-700 dark:text-success-300">Receitas</CardTitle>
            <div className="p-2 bg-success-100 dark:bg-success-900 rounded-lg">
              <TrendingUp className="h-4 w-4 text-success-600 dark:text-success-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success-600 dark:text-success-400">R$ 8.500,00</div>
            <p className="text-xs text-success-600 dark:text-success-400 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-danger-200 dark:border-danger-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-danger-700 dark:text-danger-300">Despesas</CardTitle>
            <div className="p-2 bg-danger-100 dark:bg-danger-900 rounded-lg">
              <TrendingDown className="h-4 w-4 text-danger-600 dark:text-danger-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger-600 dark:text-danger-400">R$ 3.200,00</div>
            <p className="text-xs text-danger-600 dark:text-danger-400 flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary-200 dark:border-primary-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary-700 dark:text-primary-300">Investimentos</CardTitle>
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">R$ 25.800,00</div>
            <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.5% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-warning-200 dark:border-warning-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-warning-700 dark:text-warning-300">Economia</CardTitle>
            <div className="p-2 bg-warning-100 dark:bg-warning-900 rounded-lg">
              <PiggyBank className="h-4 w-4 text-warning-600 dark:text-warning-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">R$ 5.300,00</div>
            <p className="text-xs text-warning-600 dark:text-warning-400 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Meta: 62% atingida
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transações Recentes */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Transações Recentes
            </CardTitle>
            <CardDescription>Suas últimas movimentações financeiras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { desc: "Salário - Empresa XYZ", valor: "+R$ 5.500,00", tipo: "receita", data: "Hoje" },
              { desc: "Supermercado ABC", valor: "-R$ 280,50", tipo: "despesa", data: "Ontem" },
              { desc: "Dividendos ITUB4", valor: "+R$ 45,20", tipo: "receita", data: "2 dias" },
              { desc: "Conta de Luz", valor: "-R$ 120,00", tipo: "despesa", data: "3 dias" },
            ].map((transacao, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      transacao.tipo === "receita"
                        ? "bg-success-100 dark:bg-success-900"
                        : "bg-danger-100 dark:bg-danger-900"
                    }`}
                  >
                    {transacao.tipo === "receita" ? (
                      <ArrowUpRight className="h-4 w-4 text-success-600 dark:text-success-400" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-danger-600 dark:text-danger-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transacao.desc}</p>
                    <p className="text-sm text-muted-foreground">{transacao.data}</p>
                  </div>
                </div>
                <span
                  className={`font-semibold ${
                    transacao.tipo === "receita"
                      ? "text-success-600 dark:text-success-400"
                      : "text-danger-600 dark:text-danger-400"
                  }`}
                >
                  {transacao.valor}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Orçamento Mensal */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Orçamento Mensal
            </CardTitle>
            <CardDescription>Acompanhe seus gastos por categoria</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { categoria: "Alimentação", gasto: 850, limite: 1200, cor: "bg-primary-500" },
              { categoria: "Transporte", gasto: 420, limite: 600, cor: "bg-secondary-500" },
              { categoria: "Lazer", gasto: 280, limite: 400, cor: "bg-warning-500" },
              { categoria: "Saúde", gasto: 150, limite: 300, cor: "bg-success-500" },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.categoria}</span>
                  <span className="text-muted-foreground">
                    R$ {item.gasto} / R$ {item.limite}
                  </span>
                </div>
                <Progress value={(item.gasto / item.limite) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round((item.gasto / item.limite) * 100)}% usado</span>
                  <span>R$ {item.limite - item.gasto} restante</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Insights de IA */}
      <Card className="border-secondary-200 dark:border-secondary-800 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
            Insights Personalizados
          </CardTitle>
          <CardDescription>Recomendações baseadas em IA para otimizar suas finanças</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-success-50 dark:bg-success-950 border border-success-200 dark:border-success-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
                <span className="font-medium text-success-700 dark:text-success-300">Parabéns!</span>
              </div>
              <p className="text-sm text-success-600 dark:text-success-400">
                Você economizou 15% mais este mês comparado ao anterior.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-warning-50 dark:bg-warning-950 border border-warning-200 dark:border-warning-800">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                <span className="font-medium text-warning-700 dark:text-warning-300">Dica</span>
              </div>
              <p className="text-sm text-warning-600 dark:text-warning-400">
                Considere investir R$ 500 extras em renda fixa este mês.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-950 border border-primary-200 dark:border-primary-800">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <span className="font-medium text-primary-700 dark:text-primary-300">Oportunidade</span>
              </div>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Seus investimentos estão performando 12% acima da média.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <NewTransactionModal open={showNewTransaction} onOpenChange={setShowNewTransaction} />
    </div>
  )
}
