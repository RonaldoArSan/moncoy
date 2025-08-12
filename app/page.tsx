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
            <h1 className="text-3xl font-bold text-white text-shadow-md">Bem-vindo de volta!</h1>
            <p className="text-white/80 mt-2 text-base">Aqui está um resumo das suas finanças hoje</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/70 font-medium">Saldo Total</p>
            <p className="text-3xl font-bold text-white text-shadow-md">R$ 12.450,00</p>
          </div>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-300">Receitas</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">R$ 8.500,00</div>
            <p className="text-xs text-green-600/80 dark:text-green-400/80 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-300">Despesas</CardTitle>
            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">R$ 3.200,00</div>
            <p className="text-xs text-red-600/80 dark:text-red-400/80 flex items-center mt-1 font-medium">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -5% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Investimentos</CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">R$ 25.800,00</div>
            <p className="text-xs text-blue-600/80 dark:text-blue-400/80 flex items-center mt-1 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +8.5% este mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">Economia</CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
              <PiggyBank className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">R$ 5.300,00</div>
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 flex items-center mt-1 font-medium">
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
            <CardTitle className="flex items-center gap-2 text-foreground font-semibold">
              <CreditCard className="h-5 w-5 text-primary" />
              Transações Recentes
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Suas últimas movimentações financeiras</CardDescription>
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
                    <p className="font-semibold text-foreground">{transacao.desc}</p>
                    <p className="text-sm text-muted-foreground font-medium">{transacao.data}</p>
                  </div>
                </div>
                <span
                  className={`font-bold text-base ${
                    transacao.tipo === "receita"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
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
            <CardTitle className="flex items-center gap-2 text-foreground font-semibold">
              <Target className="h-5 w-5 text-primary" />
              Orçamento Mensal
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Acompanhe seus gastos por categoria</CardDescription>
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
                  <span className="font-semibold text-foreground">{item.categoria}</span>
                  <span className="text-muted-foreground font-medium">
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
          <CardTitle className="flex items-center gap-2 text-foreground font-semibold">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Insights Personalizados
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">Recomendações baseadas em IA para otimizar suas finanças</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-green-700 dark:text-green-300">Parabéns!</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Você economizou 15% mais este mês comparado ao anterior.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-amber-700 dark:text-amber-300">Dica</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                Considere investir R$ 500 extras em renda fixa este mês.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-700 dark:text-blue-300">Oportunidade</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
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
