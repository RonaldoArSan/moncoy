import Link from 'next/link'

export default function Cancel() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center text-white p-8">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4">Pagamento Cancelado</h1>
          <p className="text-xl text-red-100 mb-6">
            Não se preocupe! Você pode tentar novamente quando quiser.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-blur-lg">
            <h3 className="font-semibold mb-2">Por que escolher o Moncoy Finance?</h3>
            <ul className="text-sm text-red-100 space-y-1">
              <li>🤖 IA Financeira Personalizada</li>
              <li>📊 Dashboard Completo</li>
              <li>📱 Acesso Web e Mobile</li>
              <li>🎯 Metas Inteligentes</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link
              href="/landingpage"
              className="block w-full bg-white text-red-600 py-3 px-6 rounded-lg font-semibold hover:bg-red-50 transition-all"
            >
              Tentar Novamente
            </Link>
            <Link
              href="/landingpage#planos"
              className="block w-full border-2 border-white text-white py-3 px-6 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-all"
            >
              Ver Planos
            </Link>
            <Link
              href="/landingpage"
              className="block w-full text-red-100 py-2 hover:text-white transition-colors"
            >
              ← Voltar à página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}