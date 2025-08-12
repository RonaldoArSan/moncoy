"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, Database, CreditCard, Target, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"

interface ExportDataModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportDataModal({ open, onOpenChange }: ExportDataModalProps) {
  const [selectedData, setSelectedData] = useState<string[]>([])
  const [format, setFormat] = useState("json")
  const [dateRange, setDateRange] = useState("all")
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)

  const dataTypes = [
    { id: "transactions", label: "Transações", icon: CreditCard, description: "Todas as receitas e despesas" },
    { id: "goals", label: "Metas", icon: Target, description: "Metas financeiras e progresso" },
    {
      id: "investments",
      label: "Investimentos",
      icon: TrendingUp,
      description: "Carteira e histórico de investimentos",
    },
    { id: "categories", label: "Categorias", icon: Database, description: "Categorias personalizadas" },
    { id: "accounts", label: "Contas", icon: Database, description: "Contas bancárias conectadas" },
    { id: "reports", label: "Relatórios", icon: FileText, description: "Histórico de relatórios gerados" },
  ]

  const handleDataTypeChange = (dataType: string, checked: boolean) => {
    if (checked) {
      setSelectedData([...selectedData, dataType])
    } else {
      setSelectedData(selectedData.filter((item) => item !== dataType))
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setIsExporting(false)
          setExportComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 200)

    // Simulate data export
    setTimeout(() => {
      const exportData = {
        exportDate: new Date().toISOString(),
        dataTypes: selectedData,
        format,
        dateRange,
        data: {
          transactions: selectedData.includes("transactions")
            ? [
                { id: 1, date: "2024-01-15", description: "Supermercado", amount: -150.0, category: "Alimentação" },
                { id: 2, date: "2024-01-16", description: "Salário", amount: 5000.0, category: "Receita" },
              ]
            : [],
          goals: selectedData.includes("goals")
            ? [{ id: 1, name: "Viagem Europa", target: 15000, current: 8500, deadline: "2024-12-31" }]
            : [],
          investments: selectedData.includes("investments")
            ? [{ id: 1, symbol: "PETR4", quantity: 100, avgPrice: 32.5, currentPrice: 35.2 }]
            : [],
        },
      }

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `financeiro-export-${new Date().toISOString().split("T")[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 2000)
  }

  const resetModal = () => {
    setSelectedData([])
    setFormat("json")
    setDateRange("all")
    setIsExporting(false)
    setExportProgress(0)
    setExportComplete(false)
  }

  const handleClose = () => {
    resetModal()
    onOpenChange(false)
  }

  if (exportComplete) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Exportação Concluída
            </DialogTitle>
            <DialogDescription>Seus dados foram exportados com sucesso!</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <p className="font-medium">Download iniciado</p>
                <p className="text-sm text-muted-foreground">O arquivo foi baixado para sua pasta de downloads</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleClose} className="flex-1">
                Fechar
              </Button>
              <Button variant="outline" onClick={resetModal} className="flex-1 bg-transparent">
                Exportar Novamente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Dados
          </DialogTitle>
          <DialogDescription>
            Selecione os dados que deseja exportar e configure as opções de exportação
          </DialogDescription>
        </DialogHeader>

        {isExporting ? (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <Download className="w-6 h-6 text-blue-600 animate-bounce" />
              </div>
              <h3 className="font-medium">Exportando seus dados...</h3>
              <p className="text-sm text-muted-foreground">
                Isso pode levar alguns momentos dependendo da quantidade de dados
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Data Types Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Tipos de Dados</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dataTypes.map((dataType) => {
                  const Icon = dataType.icon
                  return (
                    <div
                      key={dataType.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <Checkbox
                        id={dataType.id}
                        checked={selectedData.includes(dataType.id)}
                        onCheckedChange={(checked) => handleDataTypeChange(dataType.id, checked as boolean)}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <Label htmlFor={dataType.id} className="font-medium cursor-pointer">
                            {dataType.label}
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">{dataType.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Formato do Arquivo</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON - Formato estruturado</SelectItem>
                  <SelectItem value="csv">CSV - Planilha</SelectItem>
                  <SelectItem value="xlsx">Excel - Planilha avançada</SelectItem>
                  <SelectItem value="pdf">PDF - Relatório</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os dados</SelectItem>
                  <SelectItem value="last-month">Último mês</SelectItem>
                  <SelectItem value="last-3-months">Últimos 3 meses</SelectItem>
                  <SelectItem value="last-6-months">Últimos 6 meses</SelectItem>
                  <SelectItem value="last-year">Último ano</SelectItem>
                  <SelectItem value="current-year">Ano atual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            {selectedData.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Resumo da Exportação</span>
                </div>
                <div className="text-sm space-y-1">
                  <p>• {selectedData.length} tipo(s) de dados selecionados</p>
                  <p>• Formato: {format.toUpperCase()}</p>
                  <p>• Período: {dateRange === "all" ? "Todos os dados" : dateRange}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleExport}
                disabled={selectedData.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Dados
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
