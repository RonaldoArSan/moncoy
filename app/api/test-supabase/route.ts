import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Teste 1: Verificar variáveis de ambiente
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Teste 2: Tentar buscar dados
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    // Teste 3: Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    return NextResponse.json({
      success: true,
      envVars: {
        hasUrl,
        hasKey,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      },
      database: {
        connected: !error,
        error: error?.message,
        categoriesCount: categories?.length || 0,
      },
      auth: {
        authenticated: !!user,
        error: authError?.message,
        userId: user?.id,
      },
    })
  } catch (error: unknown) {
    const err = error as Error
    return NextResponse.json({
      success: false,
      error: err.message,
      stack: err.stack,
    }, { status: 500 })
  }
}
