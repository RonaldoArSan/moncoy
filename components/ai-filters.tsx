import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  AlertTriangle, 
  PiggyBank, 
  BarChart3, 
  TrendingUp, 
  Filter,
  X
} from "lucide-react"

interface AIFiltersProps {
  selectedCategory: string | null
  selectedPriority: string | null
  onCategoryChange: (category: string | null) => void
  onPriorityChange: (priority: string | null) => void
  categories: string[]
}

const categoryIcons: Record<string, any> = {
  "Alerta": AlertTriangle,
  "Economia": PiggyBank,
  "Investimentos": TrendingUp,
  "Planejamento": BarChart3
}

const priorityColors: Record<string, string> = {
  "high": "destructive",
  "medium": "default", 
  "low": "secondary"
}

const priorityLabels: Record<string, string> = {
  "high": "Alta",
  "medium": "Média",
  "low": "Baixa"
}

export function AIFilters({ 
  selectedCategory, 
  selectedPriority, 
  onCategoryChange, 
  onPriorityChange,
  categories 
}: AIFiltersProps) {
  const hasFilters = selectedCategory || selectedPriority

  const clearFilters = () => {
    onCategoryChange(null)
    onPriorityChange(null)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Categoria:</span>
            {categories.map((category) => {
              const Icon = categoryIcons[category] || BarChart3
              const isSelected = selectedCategory === category
              
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onCategoryChange(isSelected ? null : category)}
                  className="h-8"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {category}
                </Button>
              )
            })}
          </div>

          {/* Priority Filters */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Prioridade:</span>
            {Object.entries(priorityLabels).map(([priority, label]) => {
              const isSelected = selectedPriority === priority
              
              return (
                <Badge
                  key={priority}
                  variant={isSelected ? priorityColors[priority] as any : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => onPriorityChange(isSelected ? null : priority)}
                >
                  {label}
                </Badge>
              )
            })}
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-muted-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}