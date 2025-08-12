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
import { Plus, X, Edit2, Save, DeleteIcon as Cancel } from "lucide-react"

interface ManageCategoriesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "income" | "expense" | "goal" | "investment"
}

export function ManageCategoriesModal({ open, onOpenChange, type }: ManageCategoriesModalProps) {
  const [newCategory, setNewCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  // Mock categories data - in real app this would come from state/API
  const [categories, setCategories] = useState(() => {
    switch (type) {
      case "income":
        return [
          { id: "1", name: "Salário", color: "green" },
          { id: "2", name: "Freelance", color: "blue" },
          { id: "3", name: "Investimentos", color: "purple" },
          { id: "4", name: "Outros", color: "gray" },
        ]
      case "expense":
        return [
          { id: "1", name: "Alimentação", color: "orange" },
          { id: "2", name: "Transporte", color: "blue" },
          { id: "3", name: "Moradia", color: "green" },
          { id: "4", name: "Lazer", color: "purple" },
          { id: "5", name: "Saúde", color: "red" },
          { id: "6", name: "Educação", color: "indigo" },
          { id: "7", name: "Outros", color: "gray" },
        ]
      case "goal":
        return [
          { id: "1", name: "Emergência", color: "red" },
          { id: "2", name: "Viagem", color: "blue" },
          { id: "3", name: "Imóvel", color: "green" },
          { id: "4", name: "Veículo", color: "orange" },
          { id: "5", name: "Educação", color: "indigo" },
          { id: "6", name: "Investimento", color: "purple" },
          { id: "7", name: "Aposentadoria", color: "gray" },
          { id: "8", name: "Lazer", color: "pink" },
          { id: "9", name: "Outros", color: "gray" },
        ]
      case "investment":
        return [
          { id: "1", name: "Ações", color: "green" },
          { id: "2", name: "FII", color: "blue" },
          { id: "3", name: "ETF", color: "purple" },
          { id: "4", name: "Renda Fixa", color: "orange" },
          { id: "5", name: "Criptomoedas", color: "yellow" },
          { id: "6", name: "Fundos", color: "indigo" },
          { id: "7", name: "Outros", color: "gray" },
        ]
      default:
        return []
    }
  })

  const colorOptions = [
    { value: "red", label: "Vermelho", class: "bg-red-500" },
    { value: "orange", label: "Laranja", class: "bg-orange-500" },
    { value: "yellow", label: "Amarelo", class: "bg-yellow-500" },
    { value: "green", label: "Verde", class: "bg-green-500" },
    { value: "blue", label: "Azul", class: "bg-blue-500" },
    { value: "indigo", label: "Índigo", class: "bg-indigo-500" },
    { value: "purple", label: "Roxo", class: "bg-purple-500" },
    { value: "pink", label: "Rosa", class: "bg-pink-500" },
    { value: "gray", label: "Cinza", class: "bg-gray-500" },
  ]

  const [selectedColor, setSelectedColor] = useState("blue")

  const getTypeTitle = () => {
    switch (type) {
      case "income":
        return "Categorias de Receita"
      case "expense":
        return "Categorias de Despesa"
      case "goal":
        return "Categorias de Metas"
      case "investment":
        return "Tipos de Investimento"
      default:
        return "Categorias"
    }
  }

  const addCategory = () => {
    if (newCategory.trim()) {
      const newCat = {
        id: Date.now().toString(),
        name: newCategory.trim(),
        color: selectedColor,
      }
      setCategories([...categories, newCat])
      setNewCategory("")
      setSelectedColor("blue")
    }
  }

  const removeCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const startEditing = (category: any) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const saveEdit = () => {
    if (editingName.trim()) {
      setCategories(categories.map((cat) => (cat.id === editingId ? { ...cat, name: editingName.trim() } : cat)))
    }
    setEditingId(null)
    setEditingName("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName("")
  }

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: "bg-red-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      indigo: "bg-indigo-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      gray: "bg-gray-500",
    }
    return colorMap[color] || "bg-gray-500"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTypeTitle()}</DialogTitle>
          <DialogDescription>Gerencie suas categorias personalizadas</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Category */}
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <h4 className="font-medium">Adicionar Nova Categoria</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="category-name">Nome da Categoria</Label>
                <Input
                  id="category-name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Digite o nome da categoria"
                  onKeyPress={(e) => e.key === "Enter" && addCategory()}
                />
              </div>
              <div>
                <Label>Cor</Label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${color.class}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addCategory} className="w-full" disabled={!newCategory.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Categoria
              </Button>
            </div>
          </div>

          {/* Existing Categories */}
          <div className="space-y-3">
            <h4 className="font-medium">Categorias Existentes ({categories.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getColorClass(category.color)}`} />
                    {editingId === category.id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-8 w-40"
                        onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{category.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {editingId === category.id ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={saveEdit}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={cancelEdit}>
                          <Cancel className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => startEditing(category)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCategory(category.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
