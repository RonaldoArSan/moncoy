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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, TrendingUp, Settings } from "lucide-react"
import { ManageCategoriesModal } from "./manage-categories-modal"

interface NewInvestmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewInvestmentModal({ open, onOpenChange }: NewInvestmentModalProps) {
  const [type, setType] = useState<"buy" | "sell">("buy")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const investmentTypes = ["Ações", "FII", "ETF", "Renda Fixa", "Criptomoedas", "Fundos", "Outros"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Novo Investimento
          </DialogTitle>
          <DialogDescription>Registre uma nova operação de compra ou venda.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={type === "buy" ? "default" : "outline"}
                onClick={() => setType("buy")}
                className={type === "buy" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                Compra
              </Button>
              <Button
                variant={type === "sell" ? "default" : "outline"}
                onClick={() => setType("sell")}
                className={type === "sell" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                Venda
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="asset-name">Nome do Ativo</Label>
              <Input id="asset-name" placeholder="Ex: PETR4, HASH11, IVVB11..." />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="asset-type">Tipo</Label>
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
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {investmentTypes.map((investmentType) => (
                    <SelectItem key={investmentType} value={investmentType.toLowerCase()}>
                      {investmentType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input id="quantity" type="number" placeholder="0" step="1" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Preço Unitário</Label>
                <Input id="price" type="number" placeholder="0,00" step="0.01" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="total-value">Valor Total</Label>
              <Input id="total-value" type="number" placeholder="0,00" step="0.01" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Data da Operação</Label>
              <div className="relative">
                <Input id="date" type="date" />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="broker">Corretora</Label>
              <Input id="broker" placeholder="Ex: XP, Rico, Clear..." />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea id="notes" placeholder="Adicione detalhes sobre esta operação..." className="min-h-[60px]" />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className={type === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            onClick={() => onOpenChange(false)}
          >
            Registrar {type === "buy" ? "Compra" : "Venda"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ManageCategoriesModal open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen} type="investment" />
    </Dialog>
  )
}
