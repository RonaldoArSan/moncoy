"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { loading, signInAsAdmin } = useAuth()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const result = await signInAsAdmin(email, password)
    
    if (result.success) {
      router.push("/admin")
    } else {
      setError(result.error || "Erro ao fazer login como administrador")
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Acesso Administrativo</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Entre com suas credenciais de administrador
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email do Administrador</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="admin@moncoy.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha de administrador"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                autoComplete="current-password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verificando..." : "Entrar como Admin"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            ← Voltar ao login normal
          </Link>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-700 dark:text-amber-300">
              <p className="font-medium">Acesso Restrito</p>
              <p>Apenas administradores autorizados podem acessar esta área.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            <strong>Demo:</strong> admin@moncoy.com / admin123
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-slate-100 dark:from-slate-900 dark:via-background dark:to-slate-800 flex items-center justify-center p-4">
      <Suspense fallback={<div>Carregando...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
