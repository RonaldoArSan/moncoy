"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { NewGoalModal } from "@/components/modals/new-goal-modal"
import { Target, PlusCircle, Calendar, DollarSign, TrendingUp } from "lucide-react"
import { useState } from "react"

export default function GoalsPage() {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)

  const goals = [
    {
      id: 1,
      title: "Reserva de Emergência",
      description: "6 meses de despesas guardadas",
      targetAmount: 50000,
      currentAmount: 32500,
      deadline: "2024-12-31",
      category: "Emergência",
      priority: "high",
    },
    {
      id: 2,
      title: "Viagem para Europa",
      description: "Férias dos sonhos em família",
      targetAmount: 25000,
      currentAmount: 8750,
      deadline: "2024-07-15",
      category: "Lazer",
      priority: "medium",
    },
    {
      id: 3,
      title: "Entrada do Apartamento",
      description: "20% do valor do imóvel",
      targetAmount: 80000,
      currentAmount: 15600,
      deadline: "2025-06-30",
      category: "Imóvel",
      priority: "high",
    },
    {
      id: 4,
      title: "Curso de Especialização",
      description: "MBA em Gestão Financeira",
      targetAmount: 12000,
      currentAmount: 9800,
      deadline: "2024-03-01",
      category: "Educação",
      priority: "medium",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return "Normal"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center ml-12 md:ml-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Metas Financeiras</h1>
            <p className="text-muted-foreground">Acompanhe o progresso dos seus objetivos</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => setIsGoalModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </div>
        </div>

        {/* Resumo das Metas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Metas</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">
                {goals.filter((g) => (g.currentAmount / g.targetAmount) * 100 >= 100).length} concluídas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R${" "}
                {goals
                  .reduce((sum, goal) => sum + goal.targetAmount, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                R${" "}
                {goals
                  .reduce((sum, goal) => sum + goal.currentAmount, 0)
                  .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}{" "}
                economizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(
                  goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount) * 100, 0) / goals.length
                ).toFixed(1)}
                %
              </div>
              <p className="text-xs text-muted-foreground">Média de todas as metas</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Metas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100
            const remaining = goal.targetAmount - goal.currentAmount
            const daysUntilDeadline = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
            )

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className={`${getPriorityColor(goal.priority)} text-white`}>
                      {getPriorityText(goal.priority)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progresso: {progress.toFixed(1)}%</span>
                      <span>
                        R$ {goal.currentAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / R${" "}
                        {goal.targetAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Faltam</p>
                      <p className="font-semibold">
                        R$ {remaining.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Prazo</p>
                      <p className="font-semibold flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {daysUntilDeadline > 0 ? `${daysUntilDeadline} dias` : "Vencido"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <Badge variant="secondary">{goal.category}</Badge>
                    <Button size="sm" variant="outline">
                      Adicionar Valor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <NewGoalModal open={isGoalModalOpen} onOpenChange={setIsGoalModalOpen} />
    </div>
  )
}
