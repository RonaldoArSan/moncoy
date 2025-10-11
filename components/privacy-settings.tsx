"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  Cookie, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  FileX, 
  Database,
  CheckCircle,
  AlertTriangle,
  Mail
} from "lucide-react"
import Link from "next/link"

export function PrivacySettings() {
  const [cookieConsent, setCookieConsent] = useState<any>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('moncoy-cookie-consent')
    if (consent) {
      setCookieConsent(JSON.parse(consent))
    }
  }, [])

  const handleUpdateCookies = (newPreferences: any) => {
    const updatedConsent = {
      ...newPreferences,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('moncoy-cookie-consent', JSON.stringify(updatedConsent))
    setCookieConsent(updatedConsent)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleRequestData = () => {
    // In a real app, this would trigger a data export request
    alert("Solicitação de dados enviada! Você receberá um email em até 30 dias com seus dados.")
  }

  const handleDeleteAccount = () => {
    // In a real app, this would require additional confirmation and security checks
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      alert("Solicitação de exclusão enviada. Entre em contato com suporte@moncoy.com para confirmar.")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações de Privacidade</h1>
        <Badge variant="secondary">
          <Eye className="h-3 w-3 mr-1" />
          LGPD
        </Badge>
      </div>

      {showSuccess && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Suas preferências foram atualizadas com sucesso!
          </AlertDescription>
        </Alert>
      )}

      {/* Cookie Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cookie className="h-5 w-5" />
            <span>Preferências de Cookies</span>
          </CardTitle>
          <CardDescription>
            Gerencie como utilizamos cookies e tecnologias similares em sua experiência.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cookieConsent ? (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground mb-3">
                Última atualização: {new Date(cookieConsent.timestamp).toLocaleDateString('pt-BR')}
              </div>
              
              {/* Essential Cookies */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Cookies Essenciais</h4>
                  <p className="text-xs text-muted-foreground">Necessários para funcionamento básico</p>
                </div>
                <Badge variant="secondary">Sempre ativo</Badge>
              </div>

              {/* Functional Cookies */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Cookies Funcionais</h4>
                  <p className="text-xs text-muted-foreground">Lembram preferências pessoais</p>
                </div>
                <Badge variant={cookieConsent.functional ? "default" : "outline"}>
                  {cookieConsent.functional ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Cookies Analíticos</h4>
                  <p className="text-xs text-muted-foreground">Ajudam a melhorar a plataforma</p>
                </div>
                <Badge variant={cookieConsent.analytics ? "default" : "outline"}>
                  {cookieConsent.analytics ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Cookies de Marketing</h4>
                  <p className="text-xs text-muted-foreground">Personalizam anúncios</p>
                </div>
                <Badge variant={cookieConsent.marketing ? "default" : "outline"}>
                  {cookieConsent.marketing ? "Ativo" : "Inativo"}
                </Badge>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Reopen cookie banner for editing
                  localStorage.removeItem('moncoy-cookie-consent')
                  window.location.reload()
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Preferências
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-3">Você ainda não configurou suas preferências de cookies.</p>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Configurar Agora
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Seus Direitos sobre Dados Pessoais</span>
          </CardTitle>
          <CardDescription>
            Conforme a LGPD, você tem direitos específicos sobre seus dados pessoais.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Access Data */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-500" />
                <h4 className="font-medium">Acessar Dados</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Confirme quais dados temos sobre você e como os utilizamos.
              </p>
              <Button variant="outline" size="sm" onClick={handleRequestData}>
                <Download className="h-4 w-4 mr-2" />
                Solicitar Dados
              </Button>
            </div>

            {/* Correct Data */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Edit className="h-4 w-4 text-green-500" />
                <h4 className="font-medium">Corrigir Dados</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Atualize informações incorretas ou incompletas em seu perfil.
              </p>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </Link>
            </div>

            {/* Portability */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-purple-500" />
                <h4 className="font-medium">Portabilidade</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Transfira seus dados para outro serviço em formato estruturado.
              </p>
              <Button variant="outline" size="sm" onClick={handleRequestData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </Button>
            </div>

            {/* Delete Account */}
            <div className="border border-red-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Trash2 className="h-4 w-4 text-red-500" />
                <h4 className="font-medium text-red-700 dark:text-red-400">Excluir Conta</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Remova permanentemente sua conta e todos os dados associados.
              </p>
              <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Contato para Questões de Privacidade</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Encarregado de Dados (DPO)</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> dpo@moncoy.com<br />
                <strong>Telefone:</strong> (11) 99999-9999<br />
                <strong>Resposta:</strong> Até 15 dias úteis
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Suporte Geral</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> suporte@moncoy.com<br />
                <strong>Central:</strong> <Link href="/support" className="text-primary hover:underline">moncoy.com/support</Link><br />
                <strong>Chat:</strong> Disponível na plataforma
              </p>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Se não conseguirmos resolver sua solicitação, você pode recorrer à 
              <a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                Autoridade Nacional de Proteção de Dados (ANPD)
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos Legais</CardTitle>
          <CardDescription>
            Consulte nossos documentos oficiais sobre privacidade e uso de dados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href="/privacy">
              <Button variant="outline" size="sm">
                <FileX className="h-4 w-4 mr-2" />
                Política de Privacidade
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline" size="sm">
                <FileX className="h-4 w-4 mr-2" />
                Termos de Uso
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}