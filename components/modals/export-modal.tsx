"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Download, FileText } from "lucide-react"
import { exportTransactions } from "@/lib/export-utils"
import type { Transaction } from "@/lib/supabase"

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  transactions?: Transaction[]
}

export function ExportModal({
  open,
  onOpenChange,
  title = "Exportar Dados",
  description = "Escolha o formato e período para exportar seus dados.",
  transactions = [],
}: ExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>("pdf")
  const [period, setPeriod] = useState("current-month")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (period === 'custom' && (!startDate || !endDate)) {
      alert('Por favor, selecione as datas inicial e final para o período personalizado.')
      return
    }

    setIsExporting(true)
    try {
      exportTransactions(transactions, {
        format,
        period,
        startDate,
        endDate,
        includeCharts
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao exportar:', error)
      alert('Erro ao exportar transações. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  const formats = [
    { value: "pdf", label: "PDF", icon: FileText },
    { value: "excel", label: "Excel (.xlsx)", icon: FileText },
    { value: "csv", label: "CSV", icon: FileText },
  ]

  const periods = [
    { value: "current-month", label: "Mês Atual" },
    { value: "last-month", label: "Mês Anterior" },
    { value: "last-3-months", label: "Últimos 3 Meses" },
    { value: "last-6-months", label: "Últimos 6 Meses" },
    { value: "current-year", label: "Ano Atual" },
    { value: "custom", label: "Período Personalizado" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="format">Formato</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formats.map((fmt) => (
                  <SelectItem key={fmt.value} value={fmt.value}>
                    <div className="flex items-center gap-2">
                      <fmt.icon className="w-4 h-4" />
                      {fmt.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="period">Período</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {period === "custom" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Data Inicial</Label>
                <div className="relative">
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">Data Final</Label>
                <div className="relative">
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-charts"
              checked={includeCharts}
              onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
            />
            <Label htmlFor="include-charts" className="text-sm font-normal">
              Incluir gráficos e visualizações
            </Label>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              <strong>Prévia:</strong> Relatório em {formats.find((f) => f.value === format)?.label}
              para {periods.find((p) => p.value === period)?.label.toLowerCase()}
              {includeCharts ? " com gráficos" : " sem gráficos"}.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
