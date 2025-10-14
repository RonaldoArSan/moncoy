import { useState, useEffect } from 'react'
import { goalsApi, categoriesApi } from '@/lib/api'
import type { Goal, Category } from '@/lib/supabase/types'

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const loadGoals = async () => {
    try {
      setLoading(true)
      const data = await goalsApi.getGoals()
      setGoals(data)
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getCategories('goal')
      setCategories(data)
    } catch (error) {
      console.error('Erro ao carregar categorias:', error)
    }
  }

  const createGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newGoal = await goalsApi.createGoal(goal)
      setGoals(prev => [newGoal, ...prev])
      return newGoal
    } catch (error) {
      console.error('Erro ao criar meta:', error)
      throw error
    }
  }

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const updatedGoal = await goalsApi.updateGoal(id, updates)
      setGoals(prev => prev.map(g => g.id === id ? updatedGoal : g))
      return updatedGoal
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
      throw error
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      await goalsApi.deleteGoal(id)
      setGoals(prev => prev.filter(g => g.id !== id))
    } catch (error) {
      console.error('Erro ao deletar meta:', error)
      throw error
    }
  }

  useEffect(() => {
    loadGoals()
    loadCategories()
  }, [])

  return {
    goals,
    categories,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    refreshGoals: loadGoals,
    refreshCategories: loadCategories
  }
}