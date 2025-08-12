'use client'

import { useState } from 'react'
import { useUser } from '@/hooks/use-user'
import { userApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Settings, Crown } from 'lucide-react'

export function Profile() {
  const { user, setUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const updatedUser = await userApi.updateUser({ name })
      setUser(updatedUser)
      setIsEditing(false)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysSinceRegistration = () => {
    if (!user?.registration_date) return 0
    const registrationDate = new Date(user.registration_date)
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate.getTime() - registrationDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getAIStatus = () => {
    if (!user?.plan) return { status: 'Bloqueada', color: 'destructive' }
    if (user.plan === 'basic') return { status: 'Bloqueada', color: 'destructive' }
    if (user.plan === 'professional') {
      const days = getDaysSinceRegistration()
      if (days <= 22) {
        return { status: `Carência (${22 - days} dias)`, color: 'secondary' }
      }
      return { status: 'Liberada', color: 'default' }
    }
    return { status: 'Bloqueada', color: 'destructive' }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Carregando perfil...</p>
        </CardContent>
      </Card>
    )
  }

  const aiStatus = getAIStatus()

  return (
    <div className="space-y-6">
      {/* Informações do Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Perfil do Usuário
          </CardTitle>
          <CardDescription>
            Gerencie suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                />
              ) : (
                <p className="text-sm font-medium">{user.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Editar Perfil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações do Plano */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Plano e Recursos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Plano Atual</Label>
              <Badge variant={user.plan === 'professional' ? 'default' : 'secondary'}>
                {user.plan === 'professional' ? 'Profissional' : 'Básico'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label>Status IA</Label>
              <Badge variant={aiStatus.color as any}>
                {aiStatus.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label>Membro há</Label>
              <p className="text-sm font-medium">{getDaysSinceRegistration()} dias</p>
            </div>
          </div>

          {user.plan === 'basic' && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Upgrade para Profissional</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Desbloqueie recursos avançados como análise de IA, relatórios detalhados e muito mais.
              </p>
              <Button size="sm">
                Fazer Upgrade
              </Button>
            </div>
          )}

          {user.plan === 'professional' && getDaysSinceRegistration() <= 22 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium mb-2">Período de Carência</h4>
              <p className="text-sm text-muted-foreground">
                Os recursos de IA serão liberados em {22 - getDaysSinceRegistration()} dias. 
                Isso garante que você tenha tempo para se familiarizar com a plataforma.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configurações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificações</Label>
                <p className="text-sm text-muted-foreground">
                  Receber notificações sobre transações e metas
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Tema</Label>
                <p className="text-sm text-muted-foreground">
                  Personalizar aparência da aplicação
                </p>
              </div>
              <Button variant="outline" size="sm">
                Alterar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}