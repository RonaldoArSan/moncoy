'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInAction(email: string, password: string) {
  console.log('🔐 Server Action: signInAction called', { 
    email,
    hasPassword: !!password,
    passwordLength: password?.length || 0,
    emailTrimmed: email.trim()
  })
  
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('🚨 CRITICAL: Missing Supabase environment variables', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0
      })
      return { error: 'Erro de configuração do servidor. Contate o suporte.' }
    }
    
    const supabase = await createClient()
    console.log('✅ Supabase client created successfully')

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
        // @ts-ignore - Additional error details
        code: error.code,
        // @ts-ignore
        details: error.details
      })
      
      // More specific error handling
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Email ou senha incorretos. Verifique suas credenciais.' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'Email não confirmado. Verifique sua caixa de entrada.' }
      }
      if (error.message.includes('User not found')) {
        return { error: 'Usuário não encontrado. Verifique o email digitado.' }
      }
      if (error.message.includes('Too many requests')) {
        return { error: 'Muitas tentativas de login. Aguarde alguns minutos.' }
      }
      
      // Log full error for debugging
      console.error('🔴 Detailed error:', JSON.stringify(error, null, 2))
      return { error: `Erro ao fazer login: ${error.message}` }
    }

    if (!data.user) {
      console.error('❌ No user data returned despite no error')
      return { error: 'Erro ao autenticar. Tente novamente.' }
    }

    console.log('✅ Sign in successful:', { 
      userId: data.user?.id, 
      email: data.user?.email,
      role: data.user?.role,
      hasSession: !!data.session,
      sessionExpiresAt: data.session?.expires_at
    })
    
    // Verificar se a sessão foi criada
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Session check error:', sessionError)
      return { error: 'Erro ao verificar sessão. Tente novamente.' }
    }
    
    console.log('🔍 Session check:', { 
      hasSession: !!sessionData.session,
      sessionUserId: sessionData.session?.user?.id,
      sessionExpiresAt: sessionData.session?.expires_at
    })
    
    if (!sessionData.session) {
      console.error('⚠️ Login successful but session not created')
      return { error: 'Sessão não criada. Tente novamente ou limpe os cookies do navegador.' }
    }

    console.log('🎯 Redirecting to dashboard...')
    redirect('/')
  } catch (error: any) {
    console.error('💥 Unexpected error in signInAction:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    // If redirect error, re-throw it (this is expected behavior)
    if (error.message?.includes('NEXT_REDIRECT')) {
      throw error
    }
    
    return { error: `Erro inesperado: ${error.message}` }
  }
}
