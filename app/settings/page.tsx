"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
  Save,
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useSettingsContext } from "@/contexts/settings-context"
import { useUserPlan } from "@/contexts/user-plan-context"

export default function SettingsPage() {
  const { user, loading, updateUser } = useSettingsContext()
  const { currentPlan, upgradeToProfessional } = useUserPlan()
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  })
  
  const isProfessional = currentPlan === 'professional'

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [user])
  

  
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      const emailChanged = formData.email !== user?.email
      
      await updateUser({
        name: formData.name,
        email: formData.email
      })
      
      if (emailChanged) {
        alert('Perfil atualizado! Verifique seu novo email para confirmar a alteração.')
      } else {
        alert('Perfil atualizado com sucesso!')
      }
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar alterações')
    } finally {
      setIsSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

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
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration-date">Data de Registro</Label>
                <Input 
                  id="registration-date" 
                  value={user?.registration_date ? new Date(user.registration_date).toLocaleDateString('pt-BR') : ''}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plano Atual</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="plan" 
                    value={user?.plan === 'professional' ? 'Profissional' : 'Básico'}
                    disabled
                  />
                  {user?.plan !== 'professional' && (
                    <Link href="/plans">
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        Upgrade
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700" 
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
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
                  {user?.plan === 'professional' ? "Plano Profissional" : "Plano Básico"}
                </p>
              </div>
              <Badge variant={user?.plan === 'professional' ? "default" : "secondary"}>
                {user?.plan === 'professional' ? "PRO" : "BÁSICO"}
              </Badge>
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

        {/* Configurações de IA */}
        {user?.plan === 'professional' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                IA Financeira
                <Badge variant="outline" className="ml-2">
                  PRO
                </Badge>
              </CardTitle>
              <CardDescription>Inteligência artificial para análises financeiras avançadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Status da IA</Label>
                  <p className="text-xs text-muted-foreground">
                    IA financeira ativa e pronta para uso
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Ativo
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>• Análise de gastos inteligente</p>
                <p>• Sugestões de orçamento personalizadas</p>
                <p>• Categorização automática de transações</p>
                <p>• Insights preditivos</p>
              </div>
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
                <Label>Notificações Gerais</Label>
                <p className="text-sm text-muted-foreground">Receber notificações do sistema</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
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
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Em Breve
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Funcionalidade em desenvolvimento
                </p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Configurar
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
