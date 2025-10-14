'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@/lib/supabase/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ProfileDebug() {
  const [authUser, setAuthUser] = useState<any>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function debug() {
      try {
        console.log('🔍 Iniciando debug...')
        
        // 1. Verificar autenticação
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        console.log('Auth user:', user)
        console.log('Auth error:', authError)
        
        if (authError) {
          setError('Erro auth: ' + authError.message)
          return
        }
        
        if (!user) {
          setError('Usuário não autenticado')
          return
        }
        
        setAuthUser(user)
        
        // 2. Testar conexão com tabela users
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        console.log('Profile data:', profileData)
        console.log('Profile error:', profileError)
        
        if (profileError) {
          setError('Erro profile: ' + profileError.message + ' (Code: ' + profileError.code + ')')
          return
        }
        
        setProfile(profileData)
        
      } catch (err: any) {
        console.error('Erro geral:', err)
        setError('Erro geral: ' + (err?.message || 'Erro desconhecido'))
      } finally {
        setLoading(false)
      }
    }
    
    debug()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>Carregando debug...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Debug do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded">
              <p className="text-red-800 font-medium">❌ {error}</p>
            </div>
          )}
          
          {authUser && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-medium mb-2">✅ Usuário Autenticado:</h4>
              <p><strong>ID:</strong> {authUser.id}</p>
              <p><strong>Email:</strong> {authUser.email}</p>
              <p><strong>Criado:</strong> {authUser.created_at}</p>
            </div>
          )}
          
          {profile ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h4 className="font-medium mb-2">✅ Perfil Encontrado:</h4>
              <p><strong>Nome:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Plano:</strong> {profile.plan}</p>
              <p><strong>Registro:</strong> {profile.registration_date}</p>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-medium mb-2">⚠️ Perfil não encontrado</h4>
              <p>O usuário existe no auth mas não tem perfil na tabela users</p>
            </div>
          )}
          
          <Button onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}