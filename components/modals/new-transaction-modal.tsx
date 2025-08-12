"use client"

import type React from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Upload, Camera, FileText, Loader2, Crown, X, Settings } from "lucide-react"
import { ManageCategoriesModal } from "./manage-categories-modal"
import { useUserPlan, useFeatureAccess } from "@/contexts/user-plan-context"

interface NewTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewTransactionModal({ open, onOpenChange }: NewTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const { currentPlan } = useUserPlan()
  const hasReceiptAnalysis = useFeatureAccess("receiptAnalysis")

  const categories = {
    income: ["Salário", "Freelance", "Investimentos", "Outros"],
    expense: ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Educação", "Outros"],
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setIsProcessing(true)

    // Simulate AI processing delay
    setTimeout(() => {
      // Mock extracted data from AI
      const mockExtractedData = {
        description: file.name.includes("supermercado") ? "Compras Supermercado" : "Pagamento Restaurante",
        amount: Math.random() * 100 + 20,
        category: type === "expense" ? "alimentação" : "outros",
        date: new Date().toISOString().split("T")[0],
        merchant: file.name.includes("supermercado") ? "Supermercado ABC" : "Restaurante XYZ",
      }
      setExtractedData(mockExtractedData)
      setIsProcessing(false)
    }, 2000)
  }

  const removeFile = () => {
    setUploadedFile(null)
    setExtractedData(null)
    setIsProcessing(false)
  }

  const applyExtractedData = () => {
    if (extractedData) {
      // In a real app, this would populate the form fields
      console.log("Applying extracted data:", extractedData)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>Adicione uma nova receita ou despesa à sua conta.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={type === "income" ? "default" : "outline"}
              onClick={() => setType("income")}
              className={type === "income" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Receita
            </Button>
            <Button
              variant={type === "expense" ? "default" : "outline"}
              onClick={() => setType("expense")}
              className={type === "expense" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Despesa
            </Button>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Label>Comprovante</Label>
              {hasReceiptAnalysis && (
                <Badge variant="secondary" className="text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  PRO
                </Badge>
              )}
            </div>

            {hasReceiptAnalysis ? (
              <div className="space-y-3">
                {!uploadedFile ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">Faça upload de uma foto ou arquivo do comprovante</p>
                      <p className="text-xs text-muted-foreground">
                        A IA extrairá automaticamente os dados da transação
                      </p>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <Label htmlFor="receipt-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild>
                          <span>Selecionar Arquivo</span>
                        </Button>
                      </Label>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium">{uploadedFile.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removeFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {isProcessing && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processando com IA...
                      </div>
                    )}

                    {extractedData && (
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Dados Extraídos:</h4>
                          <Button variant="outline" size="sm" onClick={applyExtractedData}>
                            Aplicar Dados
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Descrição:</span>
                            <p className="font-medium">{extractedData.description}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Valor:</span>
                            <p className="font-medium">R$ {extractedData.amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Categoria:</span>
                            <p className="font-medium capitalize">{extractedData.category}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Estabelecimento:</span>
                            <p className="font-medium">{extractedData.merchant}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Crown className="h-6 w-6 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload de comprovantes disponível no plano Profissional
                  </p>
                  <Button variant="outline" size="sm">
                    Fazer Upgrade
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Ex: Supermercado, Salário..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Valor</Label>
            <Input id="amount" type="number" placeholder="0,00" step="0.01" />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="category">Categoria</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCategoryModalOpen(true)}
                className="h-6 px-2 text-xs"
              >
                <Settings className="w-3 h-3 mr-1" />
                Gerenciar
              </Button>
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories[type].map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <div className="relative">
              <Input id="date" type="date" />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea id="notes" placeholder="Adicione detalhes sobre esta transação..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className={type === "income" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            onClick={() => onOpenChange(false)}
          >
            Adicionar {type === "income" ? "Receita" : "Despesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ManageCategoriesModal open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen} type={type} />
    </Dialog>
  )
}
