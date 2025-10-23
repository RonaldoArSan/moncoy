'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInAction(email: string, password: string) {
  console.log('🔐 Server Action: signInAction called', { email })
  
  const supabase = await createClient()

  console.log('📡 Attempting sign in with Supabase...')
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    console.error('❌ Sign in error:', {
      message: error.message,
      status: error.status,
      name: error.name,
      // @ts-ignore
      code: error.code,
      // @ts-ignore
      details: error.details
    })
    
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Email não confirmado. Verifique sua caixa de entrada.' }
    }
    if (error.message.includes('User not found')) {
      return { error: 'Usuário não encontrado. Cadastre-se primeiro.' }
    }
    return { error: error.message }
  }

  console.log('✅ Sign in successful:', { userId: data.user?.id, email: data.user?.email })
  
  // Verificar se a sessão foi criada
  const { data: sessionData } = await supabase.auth.getSession()
  console.log('🔍 Session check:', { hasSession: !!sessionData.session })

  redirect('/')
}
