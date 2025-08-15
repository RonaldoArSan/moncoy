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
import { Plus, X, Edit2, Save, DeleteIcon as Cancel, Loader2 } from "lucide-react"
import { categoriesApi } from "@/lib/api"
import type { Category } from "@/lib/supabase"

interface ManageCategoriesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "income" | "expense" | "goal" | "investment"
}

export function ManageCategoriesModal({ open, onOpenChange, type }: ManageCategoriesModalProps) {
  const [newCategory, setNewCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

  useEffect(() => {
    if (open) {
      loadCategories()
    }
  }, [open, type])

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

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await categoriesApi.getCategories(type)
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async () => {
    if (!newCategory.trim()) return
    
    try {
      setSubmitting(true)
      const newCat = await categoriesApi.createCategory({
        name: newCategory.trim(),
        type,
        color: selectedColor
      })
      setCategories([...categories, newCat])
      setNewCategory("")
      setSelectedColor("blue")
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
      alert('Erro ao criar categoria')
    } finally {
      setSubmitting(false)
    }
  }

  const removeCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    
    try {
      await categoriesApi.deleteCategory(id)
      setCategories(categories.filter((cat) => cat.id !== id))
    } catch (error) {
      console.error('Erro ao excluir categoria:', error)
      alert('Erro ao excluir categoria')
    }
  }

  const startEditing = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const saveEdit = async () => {
    if (!editingName.trim() || !editingId) return
    
    try {
      const updatedCategory = await categoriesApi.updateCategory(editingId, {
        name: editingName.trim()
      })
      setCategories(categories.map((cat) => 
        cat.id === editingId ? updatedCategory : cat
      ))
      setEditingId(null)
      setEditingName("")
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error)
      alert('Erro ao atualizar categoria')
    }
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
              <Button onClick={addCategory} className="w-full" disabled={!newCategory.trim() || submitting}>
                {submitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {submitting ? 'Adicionando...' : 'Adicionar Categoria'}
              </Button>
            </div>
          </div>

          {/* Existing Categories */}
          <div className="space-y-3">
            <h4 className="font-medium">Categorias Existentes ({categories.length})</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma categoria encontrada</p>
                </div>
              ) : (
                categories.map((category) => (
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
                ))
              )}
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