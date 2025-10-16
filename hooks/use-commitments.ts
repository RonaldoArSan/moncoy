import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import type { Commitment } from '@/types/commitment'

export interface DatabaseCommitment {
  id: string
  user_id: string
  title: string
  description?: string
  date: string
  time: string
  status: 'pendente' | 'confirmado' | 'cancelado'
  type: 'income' | 'expense' | 'investment' | 'meeting' | 'other'
  amount?: number
  category?: string
  recurring: boolean
  recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  created_at: string
  updated_at: string
}

export function useCommitments() {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const supabase = createClient()

  // Converter do formato do banco para o tipo do frontend
  const mapDatabaseToCommitment = (dbCommitment: DatabaseCommitment): Commitment => ({
    id: dbCommitment.id,
    title: dbCommitment.title,
    description: dbCommitment.description,
    date: dbCommitment.date,
    time: dbCommitment.time,
    status: dbCommitment.status,
    type: dbCommitment.type,
    amount: dbCommitment.amount,
    category: dbCommitment.category,
    recurring: dbCommitment.recurring,
    recurringPattern: dbCommitment.recurring_pattern,
    createdAt: dbCommitment.created_at,
    updatedAt: dbCommitment.updated_at
  })

  // Converter do tipo do frontend para o formato do banco
  const mapCommitmentToDatabase = (commitment: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'>): Omit<DatabaseCommitment, 'id' | 'user_id' | 'created_at' | 'updated_at'> => ({
    title: commitment.title,
    description: commitment.description,
    date: commitment.date,
    time: commitment.time,
    status: commitment.status,
    type: commitment.type,
    amount: commitment.amount,
    category: commitment.category,
    recurring: commitment.recurring || false,
    recurring_pattern: commitment.recurringPattern
  })

  // Carregar compromissos
  const fetchCommitments = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('commitments')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      const mappedCommitments = data?.map(mapDatabaseToCommitment) || []
      setCommitments(mappedCommitments)
    } catch (err) {
      console.error('Erro ao carregar compromissos:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  // Criar compromisso
  const createCommitment = async (commitmentData: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const dbData = mapCommitmentToDatabase(commitmentData)
      
      const { data, error: insertError } = await supabase
        .from('commitments')
        .insert([{
          ...dbData,
          user_id: user.id
        }])
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      const newCommitment = mapDatabaseToCommitment(data)
      setCommitments(prev => [...prev, newCommitment])
      
      return newCommitment
    } catch (err) {
      console.error('Erro ao criar compromisso:', err)
      throw err
    }
  }

  // Atualizar compromisso
  const updateCommitment = async (id: string, commitmentData: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const dbData = mapCommitmentToDatabase(commitmentData)
      
      const { data, error: updateError } = await supabase
        .from('commitments')
        .update(dbData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      const updatedCommitment = mapDatabaseToCommitment(data)
      setCommitments(prev => 
        prev.map(c => c.id === id ? updatedCommitment : c)
      )
      
      return updatedCommitment
    } catch (err) {
      console.error('Erro ao atualizar compromisso:', err)
      throw err
    }
  }

  // Excluir compromisso
  const deleteCommitment = async (id: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    try {
      const { error: deleteError } = await supabase
        .from('commitments')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) {
        throw deleteError
      }

      setCommitments(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Erro ao excluir compromisso:', err)
      throw err
    }
  }

  // Carregar compromissos quando o usuário estiver disponível
  useEffect(() => {
    if (user) {
      fetchCommitments()
    } else {
      setCommitments([])
      setLoading(false)
    }
  }, [user])

  return {
    commitments,
    loading,
    error,
    createCommitment,
    updateCommitment,
    deleteCommitment,
    refetch: fetchCommitments
  }
}