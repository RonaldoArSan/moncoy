'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAILS = [
  'admin@financeira.com',
  'ronald@financeira.com',
  process.env.NEXT_PUBLIC_ADMIN_EMAIL
].filter(Boolean)

export async function signInAsAdminAction(email: string, password: string) {
  // Verificar se o email é de admin
  if (!ADMIN_EMAILS.includes(email)) {
    return { error: 'Email não autorizado para acesso administrativo' }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Email ou senha incorretos' }
    }
    return { error: error.message }
  }

  // Verificar novamente após login
  if (!ADMIN_EMAILS.includes(data.user.email || '')) {
    await supabase.auth.signOut()
    return { error: 'Usuário não possui permissões administrativas' }
  }

  redirect('/admin')
}
