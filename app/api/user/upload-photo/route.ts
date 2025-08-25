import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const userId = formData.get('userId') as string
  if (!file || !userId) {
    return NextResponse.json({ error: 'Arquivo ou usuário não informado.' }, { status: 400 })
  }
  const fileExt = file.name.split('.').pop()
  const filePath = `avatars/${userId}.${fileExt}`
  const { data, error } = await supabase.storage.from('avatars').upload(filePath, file, {
    upsert: true,
    contentType: file.type,
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const photoUrl = `${supabaseUrl}/storage/v1/object/public/${filePath}`
  // Atualiza o campo photo_url do usuário
  await supabase.from('users').update({ photo_url: photoUrl }).eq('id', userId)
  return NextResponse.json({ photoUrl })
}
