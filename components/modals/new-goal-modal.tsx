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
import { Calendar, Target, Settings } from "lucide-react"
import { ManageCategoriesModal } from "./manage-categories-modal"

interface NewGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewGoalModal({ open, onOpenChange }: NewGoalModalProps) {
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium")
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)

  const categories = [
    "Emergência",
    "Viagem",
    "Imóvel",
    "Veículo",
    "Educação",
    "Investimento",
    "Aposentadoria",
    "Lazer",
    "Outros",
  ]

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "high":
        return "bg-red-600 hover:bg-red-700"
      case "medium":
        return "bg-yellow-600 hover:bg-yellow-700"
      case "low":
        return "bg-green-600 hover:bg-green-700"
      default:
        return "bg-blue-600 hover:bg-blue-700"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Nova Meta Financeira
          </DialogTitle>
          <DialogDescription>Defina um objetivo financeiro e acompanhe seu progresso.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título da Meta</Label>
            <Input id="title" placeholder="Ex: Reserva de emergência, Viagem..." />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" placeholder="Descreva sua meta em detalhes..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="target-amount">Valor Alvo</Label>
              <Input id="target-amount" type="number" placeholder="0,00" step="0.01" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="current-amount">Valor Atual</Label>
              <Input id="current-amount" type="number" placeholder="0,00" step="0.01" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="deadline">Data Limite</Label>
            <div className="relative">
              <Input id="deadline" type="date" />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
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
                {categories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Prioridade</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={priority === "high" ? "default" : "outline"}
                onClick={() => setPriority("high")}
                className={priority === "high" ? "bg-red-600 hover:bg-red-700" : ""}
                size="sm"
              >
                Alta
              </Button>
              <Button
                variant={priority === "medium" ? "default" : "outline"}
                onClick={() => setPriority("medium")}
                className={priority === "medium" ? "bg-yellow-600 hover:bg-yellow-700" : ""}
                size="sm"
              >
                Média
              </Button>
              <Button
                variant={priority === "low" ? "default" : "outline"}
                onClick={() => setPriority("low")}
                className={priority === "low" ? "bg-green-600 hover:bg-green-700" : ""}
                size="sm"
              >
                Baixa
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button className={getPriorityColor(priority)} onClick={() => onOpenChange(false)}>
            Criar Meta
          </Button>
        </DialogFooter>
      </DialogContent>
      <ManageCategoriesModal open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen} type="goal" />
    </Dialog>
  )
}
