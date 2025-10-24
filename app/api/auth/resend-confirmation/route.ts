import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Reenviar email de confirmação
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    })

    if (error) {
      console.error('Erro ao reenviar email:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email de confirmação reenviado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
