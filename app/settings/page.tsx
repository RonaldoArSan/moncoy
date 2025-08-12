"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AddBankAccountModal } from "@/components/modals/add-bank-account-modal"
import { Setup2FAModal } from "@/components/modals/setup-2fa-modal"
import { ExportDataModal } from "@/components/modals/export-data-modal"
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Database,
  Download,
  Trash2,
  Key,
  Building,
  DollarSign,
  Brain,
  Eye,
  EyeOff,
} from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [isProfessional] = useState(true) // Simulating professional plan
  const [showApiKey, setShowApiKey] = useState(false)
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center ml-12 md:ml-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
          </div>
        </div>

        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>Informações básicas da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" defaultValue="João Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" defaultValue="joao.silva@email.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" defaultValue="(11) 99999-9999" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">CPF/CNPJ</Label>
                <Input id="document" defaultValue="123.456.789-00" />
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">Salvar Alterações</Button>
          </CardContent>
        </Card>

        {/* Configurações de Conta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Tipo de Conta
            </CardTitle>
            <CardDescription>Configure o tipo de conta e funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Plano Atual</Label>
                <p className="text-sm text-muted-foreground">
                  {isProfessional ? "Plano Profissional" : "Plano Pessoal Premium"}
                </p>
              </div>
              <Badge variant="secondary">Ativo</Badge>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-type">Tipo de Conta</Label>
              <Select defaultValue="personal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Pessoal</SelectItem>
                  <SelectItem value="business">Empresarial</SelectItem>
                  <SelectItem value="family">Familiar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Modo Empresarial</Label>
                <p className="text-sm text-muted-foreground">Ative funcionalidades para pequenas empresas</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {isProfessional && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Configurações de IA
                <Badge variant="outline" className="ml-2">
                  Profissional
                </Badge>
              </CardTitle>
              <CardDescription>Configure sua chave API e modelo de IA preferido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-model">Modelo de IA</Label>
                <Select defaultValue="chatgpt">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v0">v0 (Vercel)</SelectItem>
                    <SelectItem value="chatgpt">ChatGPT (OpenAI)</SelectItem>
                    <SelectItem value="gemini">Gemini (Google)</SelectItem>
                    <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">Chave API</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    placeholder="sk-..."
                    defaultValue="sk-1234567890abcdef"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sua chave API é criptografada e armazenada com segurança
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Análise Automática de Comprovantes</Label>
                  <p className="text-sm text-muted-foreground">Use IA para extrair dados de recibos e comprovantes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Conselhos Financeiros Personalizados</Label>
                  <p className="text-sm text-muted-foreground">Receba insights e recomendações baseadas em IA</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Detecção de Anomalias</Label>
                  <p className="text-sm text-muted-foreground">Alertas automáticos para gastos incomuns</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Status da Conexão</Label>
                  <p className="text-xs text-muted-foreground">Última verificação: há 2 minutos</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Conectado
                </Badge>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">Testar Conexão</Button>
            </CardContent>
          </Card>
        )}

        {/* Configurações Financeiras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Configurações Financeiras
            </CardTitle>
            <CardDescription>Preferências de moeda e formatação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Moeda Principal</Label>
                <Select defaultValue="brl">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brl">Real Brasileiro (R$)</SelectItem>
                    <SelectItem value="usd">Dólar Americano ($)</SelectItem>
                    <SelectItem value="eur">Euro (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-format">Formato de Data</Label>
                <Select defaultValue="dd/mm/yyyy">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                    <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Categorização Automática</Label>
                <p className="text-sm text-muted-foreground">Use IA para categorizar transações automaticamente</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure como e quando receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>E-mail</Label>
                <p className="text-sm text-muted-foreground">Receber notificações por e-mail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Notificações no navegador e mobile</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Lembretes de Pagamento</Label>
                <p className="text-sm text-muted-foreground">Alertas para contas próximas do vencimento</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Relatórios Mensais</Label>
                <p className="text-sm text-muted-foreground">Resumo financeiro mensal por e-mail</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Integrações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Integrações
            </CardTitle>
            <CardDescription>Conecte suas contas bancárias e serviços</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Building className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Banco do Brasil</p>
                    <p className="text-sm text-muted-foreground">Conta corrente conectada</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Conectado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Nubank</p>
                    <p className="text-sm text-muted-foreground">Cartão de crédito</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Conectado
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg border-dashed">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Database className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Adicionar Nova Conta</p>
                    <p className="text-sm text-muted-foreground">Conecte mais bancos via Open Finance</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAddBankModal(true)}>
                  Conectar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Segurança
            </CardTitle>
            <CardDescription>Configurações de segurança e privacidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label>Autenticação de Dois Fatores</Label>
                  {is2FAEnabled && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Ativo
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {is2FAEnabled ? "Sua conta está protegida com 2FA via SMS" : "Adicione uma camada extra de segurança"}
                </p>
              </div>
              <Button variant={is2FAEnabled ? "outline" : "default"} size="sm" onClick={() => setShow2FAModal(true)}>
                {is2FAEnabled ? "Gerenciar" : "Configurar"}
              </Button>
            </div>
            <Separator />
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Key className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={() => setShowExportModal(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Dados
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir Conta
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddBankAccountModal open={showAddBankModal} onOpenChange={setShowAddBankModal} />
      <Setup2FAModal open={show2FAModal} onOpenChange={setShow2FAModal} />
      <ExportDataModal open={showExportModal} onOpenChange={setShowExportModal} />
    </div>
  )
}
