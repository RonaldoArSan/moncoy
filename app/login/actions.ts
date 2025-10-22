'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signInAction(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email ou senha incorretos' }
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Email não confirmado. Verifique sua caixa de entrada.' }
    }
    return { error: error.message }
  }

  redirect('/')
}
