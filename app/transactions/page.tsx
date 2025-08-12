"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NewTransactionModal } from "@/components/modals/new-transaction-modal"
import { ExportModal } from "@/components/modals/export-modal"
import { Search, Download, PlusCircle } from "lucide-react"
import { useState } from "react"

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const transactions = [
    {
      id: 1,
      date: "2024-01-15",
      description: "Salário",
      category: "Receita",
      amount: 8500.0,
      type: "income",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-14",
      description: "Supermercado Extra",
      category: "Alimentação",
      amount: -320.5,
      type: "expense",
      status: "completed",
    },
    {
      id: 3,
      date: "2024-01-13",
      description: "Posto Shell",
      category: "Transporte",
      amount: -180.0,
      type: "expense",
      status: "completed",
    },
    {
      id: 4,
      date: "2024-01-12",
      description: "Freelance Design",
      category: "Receita Extra",
      amount: 1200.0,
      type: "income",
      status: "completed",
    },
    {
      id: 5,
      date: "2024-01-11",
      description: "Netflix",
      category: "Entretenimento",
      amount: -29.9,
      type: "expense",
      status: "completed",
    },
    {
      id: 6,
      date: "2024-01-10",
      description: "Farmácia",
      category: "Saúde",
      amount: -85.3,
      type: "expense",
      status: "completed",
    },
    {
      id: 7,
      date: "2024-01-09",
      description: "Restaurante",
      category: "Alimentação",
      amount: -120.0,
      type: "expense",
      status: "completed",
    },
    {
      id: 8,
      date: "2024-01-08",
      description: "Uber",
      category: "Transporte",
      amount: -25.5,
      type: "expense",
      status: "completed",
    },
  ]

  const categories = ["all", "Receita", "Alimentação", "Transporte", "Entretenimento", "Saúde", "Receita Extra"]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center ml-12 md:ml-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Transações</h1>
            <p className="text-muted-foreground">Gerencie todas as suas movimentações financeiras</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => setIsTransactionModalOpen(true)}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Encontre transações específicas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar transações..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas as categorias" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setIsExportModalOpen(true)}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Transações */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>{filteredTransactions.length} transação(ões) encontrada(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${transaction.type === "income" ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold text-lg ${transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                    >
                      {transaction.type === "income" ? "+" : ""}R${" "}
                      {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {transaction.status === "completed" ? "Concluída" : "Pendente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <NewTransactionModal open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen} />
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        title="Exportar Transações"
        description="Exporte suas transações em diferentes formatos."
      />
    </div>
  )
}
