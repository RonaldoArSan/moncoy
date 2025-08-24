import { NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabase'
import supabaseAdmin from '@/lib/supabase-admin'

// Simple admin check via header token (replace with real auth/role check)
function isAdmin(req: NextRequest) {
  const token = req.headers.get('x-admin-token')
  const expected = process.env.ADMIN_EDIT_TOKEN
  return Boolean(expected && token && token === expected)
}

export async function GET() {
  const { data, error } = await supabase
    .from('support_settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || null)
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { data: existing } = await supabase
    .from('support_settings')
    .select('id')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  const payload: any = {
    support_email: body.support_email ?? null,
    phones: Array.isArray(body.phones) ? body.phones : [],
    whatsapp: body.whatsapp ?? null,
    business_hours: body.business_hours ?? null,
    chat_url: body.chat_url ?? null,
    knowledge_base_url: body.knowledge_base_url ?? null,
    updated_at: new Date().toISOString(),
  }
  if (existing?.id) payload.id = existing.id

  const { data, error } = await supabaseAdmin
    .from('support_settings')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
