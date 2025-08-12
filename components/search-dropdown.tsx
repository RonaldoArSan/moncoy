"use client"

import type React from "react"

import { Search, Clock, TrendingUp, Target, CreditCard, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import Link from "next/link"

interface SearchResult {
  id: string
  type: "transaction" | "goal" | "investment" | "page"
  title: string
  subtitle?: string
  value?: string
  href: string
  icon: React.ReactNode
}

export function SearchDropdown() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  // Mock search data
  const searchData: SearchResult[] = [
    {
      id: "1",
      type: "transaction",
      title: "Supermercado Extra",
      subtitle: "Alimentação • Hoje",
      value: "R$ 156,80",
      href: "/transactions",
      icon: <DollarSign className="h-4 w-4 text-danger-500" />,
    },
    {
      id: "2",
      type: "transaction",
      title: "Salário",
      subtitle: "Receita • 01/12",
      value: "R$ 5.500,00",
      href: "/transactions",
      icon: <DollarSign className="h-4 w-4 text-success-500" />,
    },
    {
      id: "3",
      type: "goal",
      title: "Viagem para Europa",
      subtitle: "Meta • 65% concluída",
      value: "R$ 6.500,00",
      href: "/goals",
      icon: <Target className="h-4 w-4 text-primary-500" />,
    },
    {
      id: "4",
      type: "investment",
      title: "PETR4",
      subtitle: "Ações • +2,5%",
      value: "R$ 2.340,00",
      href: "/investments",
      icon: <TrendingUp className="h-4 w-4 text-success-500" />,
    },
    {
      id: "5",
      type: "page",
      title: "Relatórios",
      subtitle: "Análises financeiras",
      href: "/reports",
      icon: <CreditCard className="h-4 w-4 text-secondary-500" />,
    },
  ]

  const recentSearches = [
    "Transações de dezembro",
    "Meta de emergência",
    "Investimentos em ações",
    "Gastos com alimentação",
  ]

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle?.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [query])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar transações, metas..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="start">
        {query.length === 0 ? (
          <>
            <DropdownMenuLabel>Buscas Recentes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentSearches.map((search, index) => (
              <DropdownMenuItem key={index} className="cursor-pointer">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{search}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Acesso Rápido</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/transactions" className="cursor-pointer">
                <DollarSign className="h-4 w-4 mr-2" />
                Todas as Transações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/goals" className="cursor-pointer">
                <Target className="h-4 w-4 mr-2" />
                Minhas Metas
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/investments" className="cursor-pointer">
                <TrendingUp className="h-4 w-4 mr-2" />
                Investimentos
              </Link>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>
              Resultados para "{query}" ({results.length})
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">Nenhum resultado encontrado</div>
            ) : (
              results.map((result) => (
                <DropdownMenuItem key={result.id} asChild>
                  <Link href={result.href} className="cursor-pointer">
                    <div className="flex items-center space-x-3 w-full">
                      {result.icon}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{result.title}</p>
                          {result.value && <span className="text-sm font-medium">{result.value}</span>}
                        </div>
                        {result.subtitle && <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {result.type === "transaction"
                          ? "Transação"
                          : result.type === "goal"
                            ? "Meta"
                            : result.type === "investment"
                              ? "Investimento"
                              : "Página"}
                      </Badge>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
