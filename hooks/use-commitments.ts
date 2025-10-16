import { useState, useEffect } from 'react'
import { commitmentsApi } from '@/lib/api'
import type { Commitment } from '@/lib/supabase/types'

export function useCommitments() {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCommitments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await commitmentsApi.getCommitments()
      setCommitments(data)
    } catch (err) {
      console.error('Erro ao carregar compromissos:', err)
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const createCommitment = async (commitment: Omit<Commitment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newCommitment = await commitmentsApi.createCommitment(commitment)
      setCommitments(prev => [newCommitment, ...prev])
      return newCommitment
    } catch (err) {
      console.error('Erro ao criar compromisso:', err)
      throw err
    }
  }

  const updateCommitment = async (id: string, updates: Partial<Omit<Commitment, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    try {
      const updatedCommitment = await commitmentsApi.updateCommitment(id, updates)
      setCommitments(prev => prev.map(c => c.id === id ? updatedCommitment : c))
      return updatedCommitment
    } catch (err) {
      console.error('Erro ao atualizar compromisso:', err)
      throw err
    }
  }

  const deleteCommitment = async (id: string) => {
    try {
      await commitmentsApi.deleteCommitment(id)
      setCommitments(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Erro ao deletar compromisso:', err)
      throw err
    }
  }

  const getCommitmentsByDate = (date: Date): Commitment[] => {
    const dateStr = date.toISOString().split('T')[0]
    return commitments.filter(c => c.date === dateStr)
  }

  useEffect(() => {
    fetchCommitments()
  }, [])

  return {
    commitments,
    loading,
    error,
    createCommitment,
    updateCommitment,
    deleteCommitment,
    getCommitmentsByDate,
    refreshCommitments: fetchCommitments
  }
}
