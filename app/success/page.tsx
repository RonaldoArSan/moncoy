"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Processando seu pagamento...</h2>
          <p className="text-blue-100">Aguarde um momento</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center text-white p-8">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Pagamento Realizado!</h1>
          <p className="text-xl text-blue-100 mb-6">
            Parabéns! Sua assinatura foi ativada com sucesso.
          </p>
          {sessionId && (
            <p className="text-sm text-blue-200 mb-6">
              ID da sessão: {sessionId}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-lg">
            <h3 className="font-semibold mb-2">O que acontece agora?</h3>
            <ul className="text-sm text-blue-100 space-y-1">
              <li>✅ Sua conta foi ativada</li>
              <li>✅ Você receberá um email de confirmação</li>
              <li>✅ Acesso completo aos recursos premium</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-all"
            >
              Fazer Login
            </Link>
            <Link
              href="/register"
              className="block w-full border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              Criar Conta
            </Link>
            <Link
              href="/landingpage"
              className="block w-full text-blue-100 py-2 hover:text-white transition-colors"
            >
              ← Voltar à página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Success() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Carregando...</h2>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}