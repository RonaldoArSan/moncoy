"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth-provider'
import { User, Crown, Clock } from 'lucide-react'

const testUsers = [
  {
    email: 'basico@teste.com',
    password: '123456',
    name: 'Usuário Básico',
    plan: 'basic',
    description: 'Plano básico - IA bloqueada',
    icon: User,
    color: 'bg-gray-500'
  },
  {
    email: 'pro.novo@teste.com',
    password: '123456',
    name: 'Pro Novo',
    plan: 'professional',
    description: 'Profissional há 10 dias - IA em carência',
    icon: Clock,
    color: 'bg-amber-500'
  },
  {
    email: 'pro.veterano@teste.com',
    password: '123456',
    name: 'Pro Veterano',
    plan: 'professional',
    description: 'Profissional há 30 dias - IA liberada',
    icon: Crown,
    color: 'bg-green-500'
  }
]

export function TestLogin() {
  const [loading, setLoading] = useState<string | null>(null)
  const { signIn } = useAuth()

  const handleTestLogin = async (email: string, password: string) => {
    setLoading(email)
    try {
      await signIn(email, password)
      // Redirect will be handled by auth state change
    } catch (error) {
      console.error('Erro no login:', error)
      alert('Erro no login. Verifique se os usuários de teste foram criados.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Usuários de Teste</h3>
        <p className="text-sm text-muted-foreground">
          Clique para fazer login com diferentes tipos de usuário
        </p>
      </div>
      
      <div className="grid gap-4">
        {testUsers.map((user) => {
          const IconComponent = user.icon
          const isLoading = loading === user.email
          
          return (
            <Card key={user.email} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${user.color} text-white`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{user.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {user.email}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={user.plan === 'premium' ? 'destructive' : user.plan === 'professional' ? 'default' : 'secondary'}>
                    {user.plan === 'premium' ? 'Premium' : user.plan === 'professional' ? 'Profissional' : 'Básico'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {user.description}
                </p>
                <Button
                  onClick={() => handleTestLogin(user.email, user.password)}
                  disabled={isLoading}
                  className="w-full"
                  size="sm"
                >
                  {isLoading ? 'Entrando...' : 'Fazer Login'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <div className="text-xs text-muted-foreground text-center mt-4">
        <p>Senha padrão para todos: <code>123456</code></p>
        <p>Execute o script <code>test-users.sql</code> no Supabase antes de usar</p>
      </div>
    </div>
  )
}