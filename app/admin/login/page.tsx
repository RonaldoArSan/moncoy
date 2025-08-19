"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react"

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setPaymentSuccess(true)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulação de autenticação admin
    if (email === "admin@financeira.com" && password === "admin123") {
      setTimeout(() => {
        router.push("/admin")
      }, 1000)
    } else {
      setError("Credenciais de administrador inválidas")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Acesso Administrativo</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Entre com suas credenciais de administrador
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {paymentSuccess && (
              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 dark:text-green-400">Pagamento confirmado! Faça login para acessar.</span>
              </div>
            )}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                Email do Administrador
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@financeira.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 pr-10"
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
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Entrar no Painel Admin"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              <strong>Demo:</strong> admin@financeira.com / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
