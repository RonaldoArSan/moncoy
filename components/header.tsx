"use client"

import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { NotificationsDropdown } from "@/components/notifications-dropdown"
import { SearchDropdown } from "@/components/search-dropdown"
import { PlanBadge } from "@/components/plan-upgrade-card"
import { useSettingsContext } from "@/contexts/settings-context"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { user } = useSettingsContext()
  const { signOut } = useAuth()
  
  const getPlanName = (plan: string) => {
    return plan === 'professional' ? 'Plano Profissional' : 'Plano Básico'
  }

  const handleLogout = async () => {
    const result = await signOut()
    if (result.success) {
      window.location.href = "/login"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Logo/Brand */}
        <div className="mr-4 hidden md:flex">
          <h1 className="text-xl font-bold text-primary">Olá, {user?.name || 'Usuário'}</h1>
        </div>

        {/* Search Bar */}
        <div className="flex flex-1 items-center space-x-2">
          <SearchDropdown />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Plan Badge */}
          <div className="hidden sm:inline-flex">
            <PlanBadge />
          </div>

          {/* Notifications */}
          <NotificationsDropdown />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Usuário'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
                  <Badge variant="outline" className="w-fit text-xs mt-1">
                    {user ? getPlanName(user.plan) : 'Carregando...'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/support" className="cursor-pointer">
                  Suporte
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
