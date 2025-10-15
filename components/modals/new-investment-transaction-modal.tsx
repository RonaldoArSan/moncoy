"use client"

import { useState, useEffect } from "react"
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
import { Calendar, TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { useInvestments } from "@/hooks/use-investments"

interface NewInvestmentTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewInvestmentTransactionModal({ open, onOpenChange }: NewInvestmentTransactionModalProps) {
  const [investmentId, setInvestmentId] = useState('')
  const [operationType, setOperationType] = useState<'buy' | 'sell'>('buy')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [broker, setBroker] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { investments, createInvestmentTransaction } = useInvestments()

  const totalValue = quantity && price ? (parseInt(quantity) * parseFloat(price)) : 0

  const handleSubmit = async () => {
    if (!investmentId || !quantity || !price || !date) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    setIsSubmitting(true)
    try {
      await createInvestmentTransaction({
        investment_id: investmentId,
        operation_type: operationType,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        total_value: totalValue,
        date,
        broker: broker || undefined,
        notes: notes || undefined
      })
      
      // Reset form
      setInvestmentId('')
      setOperationType('buy')
      setQuantity('')
      setPrice('')
      setDate(new Date().toISOString().split('T')[0])
      setBroker('')
      setNotes('')
      
      onOpenChange(false)
    } catch (error) {
      alert('Erro ao criar transação de investimento')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setInvestmentId('')
      setOperationType('buy')
      setQuantity('')
      setPrice('')
      setDate(new Date().toISOString().split('T')[0])
      setBroker('')
      setNotes('')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            {operationType === 'buy' ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            Nova Transação de Investimento
          </DialogTitle>
          <DialogDescription>
            {operationType === 'buy' ? 'Registre uma compra' : 'Registre uma venda'} de ativos na sua carteira.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <div className="grid gap-4 py-4">

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={operationType === "buy" ? "default" : "outline"}
                onClick={() => setOperationType("buy")}
                className={operationType === "buy" ? "bg-green-600 hover:bg-green-700" : ""}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Compra
              </Button>
              <Button
                variant={operationType === "sell" ? "default" : "outline"}
                onClick={() => setOperationType("sell")}
                className={operationType === "sell" ? "bg-red-600 hover:bg-red-700" : ""}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Venda
              </Button>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="investment">Ativo</Label>
              <Select value={investmentId} onValueChange={setInvestmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ativo" />
                </SelectTrigger>
                <SelectContent>
                  {investments.map((investment) => (
                    <SelectItem key={investment.id} value={investment.id}>
                      {investment.asset_name} ({investment.asset_type.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  placeholder="0" 
                  step="1" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Preço Unitário</Label>
                <Input 
                  id="price" 
                  type="number" 
                  placeholder="0,00" 
                  step="0.01" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="total-value">Valor Total</Label>
              <Input 
                id="total-value" 
                type="number" 
                placeholder="0,00" 
                step="0.01" 
                value={totalValue.toFixed(2)}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <div className="relative">
                <Input 
                  id="date" 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="broker">Corretora</Label>
              <Input 
                id="broker" 
                placeholder="Ex: XP, Rico, Clear..." 
                value={broker}
                onChange={(e) => setBroker(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea 
                id="notes" 
                placeholder="Adicione detalhes sobre esta transação..." 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className={operationType === 'buy' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              `Registrar ${operationType === 'buy' ? 'Compra' : 'Venda'}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}