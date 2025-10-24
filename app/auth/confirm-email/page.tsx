"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'

function ConfirmEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get('email')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResendEmail = async () => {
    if (!email) return
    
    setResending(true)
    try {
      // Chamar API para reenviar email de confirmação
      const response = await fetch('/api/auth/resend-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setResent(true)
        setTimeout(() => setResent(false), 5000)
      }
    } catch (error) {
      console.error('Erro ao reenviar email:', error)
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Confirme seu Email</CardTitle>
          <CardDescription className="text-base">
            Enviamos um email de confirmação para:
          </CardDescription>
          {email && (
            <div className="font-semibold text-blue-600 bg-blue-50 p-3 rounded-lg">
              {email}
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Abra seu email e procure por uma mensagem de <strong>Moncoy Finance</strong></span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Clique no link de confirmação dentro do email</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Você será redirecionado automaticamente para fazer login</span>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <strong>⚠️ Importante:</strong> Verifique também a pasta de spam ou lixo eletrônico
          </div>

          {resent && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
              ✅ Email reenviado com sucesso!
            </div>
          )}

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendEmail}
              disabled={resending}
            >
              {resending ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reenviando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reenviar email de confirmação
                </>
              )}
            </Button>

            <Link href="/login" className="block">
              <Button className="w-full" variant="default">
                Ir para Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <Link href="/landingpage" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Voltar à página inicial
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}
