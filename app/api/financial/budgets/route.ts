import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

// GET - Listar orçamentos do usuário
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID é obrigatório' }, { status: 400 })
    }

    const { data: budgets, error } = await supabaseAdmin
      .from('budgets')
      .select(`
        *,
        budget_categories (
          id,
          category_id,
          allocated_amount,
          spent_amount,
          categories (
            id,
            name,
            color
          )
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ budgets })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Criar novo orçamento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      name, 
      description, 
      total_amount, 
      period_type, 
      start_date, 
      end_date,
      categories 
    } = body

    if (!user_id || !name || !total_amount || !start_date || !end_date) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: user_id, name, total_amount, start_date, end_date' 
      }, { status: 400 })
    }

    // Criar orçamento
    const { data: budget, error: budgetError } = await supabaseAdmin
      .from('budgets')
      .insert({
        user_id,
        name,
        description,
        total_amount,
        period_type: period_type || 'monthly',
        start_date,
        end_date,
        spent_amount: 0
      })
      .select()
      .single()

    if (budgetError) {
      return NextResponse.json({ error: budgetError.message }, { status: 500 })
    }

    // Criar categorias do orçamento se fornecidas
    if (categories && categories.length > 0) {
      const budgetCategories = categories.map((cat: any) => ({
        budget_id: budget.id,
        category_id: cat.category_id,
        allocated_amount: cat.allocated_amount
      }))

      const { error: categoriesError } = await supabaseAdmin
        .from('budget_categories')
        .insert(budgetCategories)

      if (categoriesError) {
        console.warn('Erro ao criar categorias do orçamento:', categoriesError)
      }
    }

    return NextResponse.json({ budget })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Atualizar orçamento
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do orçamento é obrigatório' }, { status: 400 })
    }

    const { data: budget, error } = await supabaseAdmin
      .from('budgets')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ budget })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Desativar orçamento
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID do orçamento é obrigatório' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('budgets')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Orçamento desativado com sucesso' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}