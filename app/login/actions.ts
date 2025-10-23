'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInAction(email: string, password: string) {
  console.log('🔐 Server Action: signInAction called', { email })
  
  // Verificar variáveis de ambiente
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('🔍 Environment check:', {
    hasUrl,
    hasKey,
    urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40) || 'undefined',
    nodeEnv: process.env.NODE_ENV,
    vercel: process.env.VERCEL
  })
  
  if (!hasUrl || !hasKey) {
    console.error('🚨 Missing Supabase environment variables!')
    return { error: 'Erro de configuração do servidor. Verifique as variáveis de ambiente.' }
  }
  
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
    
    // Log adicional para diagnóstico em produção
    console.error('🔍 Detailed error info:', {
      errorString: String(error),
      errorJSON: JSON.stringify(error, null, 2),
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      timestamp: new Date().toISOString()
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
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  console.log('🔍 Session check after login:', { 
    hasSession: !!sessionData.session,
    sessionUserId: sessionData.session?.user?.id,
    sessionError: sessionError?.message
  })
  
  if (!sessionData.session) {
    console.error('⚠️ WARNING: Login succeeded but no session was created!')
    return { error: 'Erro ao criar sessão. Tente novamente.' }
  }

  redirect('/')
}
