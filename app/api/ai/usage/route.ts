import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { AIUsageRecord } from '@/lib/supabase/types'
import { handleCorsPreFlight, addCorsHeaders } from '@/lib/cors'

// Plan limits configuration
const PLAN_LIMITS = {
  basic: { limit: 5, resetDays: 7 },      // 5 questions per week
  professional: { limit: 7, resetDays: 7 }, // 7 questions per week
  premium: { limit: 50, resetDays: 30 }   // 50 questions per month
} as const

/**
 * OPTIONS /api/ai/usage
 * Handle CORS preflight request
 */
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreFlight(request.headers.get('origin'))
}

/**
 * GET /api/ai/usage
 * Returns current AI usage stats for the authenticated user
 */
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error in AI usage GET:', authError)
      const response = NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
      return addCorsHeaders(response, origin)
    }

    // Get user's plan from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      const response = NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
      return addCorsHeaders(response, origin)
    }

    const userPlan = userData.plan as 'basic' | 'professional' | 'premium'

    // Get or create AI usage record
    let { data: usageData, error: usageError } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    // If table doesn't exist yet (migration not run), return default values
    if (usageError && usageError.code === '42P01') {
      console.warn('ai_usage table does not exist yet. Please run migration.')
      const planConfig = PLAN_LIMITS[userPlan]
      const response = NextResponse.json({
        allowed: true,
        remaining: planConfig.limit,
        limit: planConfig.limit,
        used: 0,
        resetDate: new Date(Date.now() + planConfig.resetDays * 24 * 60 * 60 * 1000).toISOString(),
        plan: userPlan,
        lastQuestionDate: null,
        warning: 'Migration pending - using temporary values'
      })
      return addCorsHeaders(response, origin)
    }

    // Create record if doesn't exist
    if (!usageData) {
      const { data: newUsage, error: createError } = await supabase
        .from('ai_usage')
        .insert({
          user_id: user.id,
          plan: userPlan,
          question_count: 0,
          last_reset_date: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        const response = NextResponse.json(
          { error: 'Erro ao criar registro de uso' },
          { status: 500 }
        )
        return addCorsHeaders(response, origin)
      }

      usageData = newUsage
    }

    // Check if reset is needed
    const lastReset = new Date(usageData.last_reset_date)
    const now = new Date()
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24))
    
    const planConfig = PLAN_LIMITS[userPlan]
    const shouldReset = daysSinceReset >= planConfig.resetDays

    // Reset if needed
    if (shouldReset) {
      const { data: resetData, error: resetError } = await supabase
        .from('ai_usage')
        .update({
          question_count: 0,
          last_reset_date: now.toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (resetError) {
        const response = NextResponse.json(
          { error: 'Erro ao resetar contador' },
          { status: 500 }
        )
        return addCorsHeaders(response, origin)
      }

      usageData = resetData
    }

    // Calculate next reset date
    const nextReset = new Date(usageData.last_reset_date)
    nextReset.setDate(nextReset.getDate() + planConfig.resetDays)

    // Calculate remaining questions
    const remaining = Math.max(0, planConfig.limit - usageData.question_count)
    const allowed = remaining > 0

    const response = NextResponse.json({
      allowed,
      remaining,
      limit: planConfig.limit,
      used: usageData.question_count,
      resetDate: nextReset.toISOString(),
      plan: userPlan,
      lastQuestionDate: usageData.last_question_date
    })
    return addCorsHeaders(response, origin)
  } catch (error) {
    console.error('Error in GET /api/ai/usage:', error)
    const response = NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
    return addCorsHeaders(response, origin)
  }
}

/**
 * POST /api/ai/usage
 * Increments the AI usage counter for the authenticated user
 */
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      const response = NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
      return addCorsHeaders(response, origin)
    }

    // Get user's plan
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    const userPlan = userData.plan as 'basic' | 'professional' | 'premium'

    // Get current usage
    const { data: usageData, error: usageError } = await supabase
      .from('ai_usage')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (usageError || !usageData) {
      const response = NextResponse.json(
        { error: 'Registro de uso não encontrado' },
        { status: 404 }
      )
      return addCorsHeaders(response, origin)
    }

    // Check if already at limit
    const planConfig = PLAN_LIMITS[userPlan]
    if (usageData.question_count >= planConfig.limit) {
      const response = NextResponse.json(
        { error: 'Limite de perguntas atingido', allowed: false },
        { status: 429 }
      )
      return addCorsHeaders(response, origin)
    }

    // Increment counter
    const { data: updatedUsage, error: updateError } = await supabase
      .from('ai_usage')
      .update({
        question_count: usageData.question_count + 1,
        last_question_date: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      const response = NextResponse.json(
        { error: 'Erro ao atualizar contador' },
        { status: 500 }
      )
      return addCorsHeaders(response, origin)
    }

    // Calculate remaining
    const remaining = Math.max(0, planConfig.limit - updatedUsage.question_count)

    const response = NextResponse.json({
      success: true,
      remaining,
      used: updatedUsage.question_count,
      limit: planConfig.limit
    })
    return addCorsHeaders(response, origin)
  } catch (error) {
    console.error('Error in POST /api/ai/usage:', error)
    const response = NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
    return addCorsHeaders(response, origin)
  }
}
