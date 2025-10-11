"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cookie, Settings, X, Shield, Eye } from "lucide-react"
import Link from "next/link"

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be disabled
    functional: true,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('moncoy-cookie-consent')
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('moncoy-cookie-consent', JSON.stringify(consent))
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const consent = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('moncoy-cookie-consent', JSON.stringify(consent))
    setShowBanner(false)
  }

  const handleSavePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('moncoy-cookie-consent', JSON.stringify(consent))
    setShowBanner(false)
    setShowPreferences(false)
  }

  const handleDismiss = () => {
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="shadow-lg border border-border bg-background/95 backdrop-blur">
        <CardContent className="p-4">
          {!showPreferences ? (
            // Main cookie banner
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <Cookie className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-foreground">Uso de Cookies e Dados</h3>
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      LGPD
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Utilizamos cookies essenciais, funcionais, analíticos e de marketing para melhorar sua experiência. 
                    Alguns dados podem ser compartilhados com parceiros para personalização. 
                    Você pode gerenciar suas preferências a qualquer momento.
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <Link href="/privacy" className="hover:text-primary underline">
                      Política de Privacidade
                    </Link>
                    <Link href="/terms" className="hover:text-primary underline">
                      Termos de Uso
                    </Link>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(true)}
                  className="order-3 sm:order-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Gerenciar Preferências
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectAll}
                  className="order-2"
                >
                  Rejeitar Não Essenciais
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="order-1 sm:order-3"
                >
                  Aceitar Todos
                </Button>
              </div>
            </div>
          ) : (
            // Cookie preferences panel
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-foreground">Preferências de Cookies</h3>
                  <Badge variant="secondary" className="text-xs">
                    <Eye className="h-3 w-3 mr-1" />
                    Transparência
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Cookies Essenciais</h4>
                    <p className="text-xs text-muted-foreground">
                      Necessários para o funcionamento básico da plataforma (login, segurança, etc.)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">Sempre ativo</span>
                    <div className="w-8 h-4 bg-primary rounded-full flex items-center">
                      <div className="w-3 h-3 bg-white rounded-full transform translate-x-4"></div>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Cookies Funcionais</h4>
                    <p className="text-xs text-muted-foreground">
                      Lembram suas preferências e configurações pessoais
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Cookies Analíticos</h4>
                    <p className="text-xs text-muted-foreground">
                      Ajudam a entender como você usa a plataforma para melhorá-la
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Cookies de Marketing</h4>
                    <p className="text-xs text-muted-foreground">
                      Personalizam anúncios e conteúdo baseado em seus interesses
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreferences(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSavePreferences}
                >
                  Salvar Preferências
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}