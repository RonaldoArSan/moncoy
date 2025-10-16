"use client"

import { useMemo, useState } from "react"
import { useTransactions } from "@/hooks/use-transactions"
import { useCommitments } from "@/hooks/use-commitments"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, Plus, TrendingUp, TrendingDown } from "lucide-react"
import { FinancialCalendar } from "@/components/financial-calendar"
import { CommitmentModal } from "@/components/commitment-modal"
import { CreateCommitmentModal } from "@/components/create-commitment-modal"
import { useToast } from "@/hooks/use-toast"
import type { Commitment, DayData } from "@/types/commitment"

export default function AgendaPage() {
  const { transactions, recurringTransactions, loading: transactionsLoading } = useTransactions()
  const { 
    commitments: userCommitments, 
    loading: commitmentsLoading, 
    createCommitment, 
    updateCommitment, 
    deleteCommitment 
  } = useCommitments()
  const [selectedDayData, setSelectedDayData] = useState<DayData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCommitment, setEditingCommitment] = useState<Commitment | null>(null)
  const { toast } = useToast()

  const loading = transactionsLoading || commitmentsLoading

  // Converte transações em compromissos e combina com compromissos reais
  const commitments = useMemo(() => {
    const txCommitments: Commitment[] = transactions.map(tx => ({
      id: tx.id,
      title: tx.description,
      description: `${tx.type === 'income' ? 'Receita' : 'Despesa'}: ${tx.description}`,
      date: tx.date,
      time: "09:00", // Horário padrão, pode ser ajustado conforme necessário
      status: 'confirmado' as const,
      type: tx.type as 'income' | 'expense',
      amount: tx.amount,
      category: tx.category?.name || undefined,
      recurring: false,
      createdAt: tx.created_at || new Date().toISOString(),
      updatedAt: tx.updated_at || new Date().toISOString()
    }))

    const recurringCommitments: Commitment[] = recurringTransactions.map(rt => ({
      id: rt.id,
      title: rt.description,
      description: `Recorrente: ${rt.description}`,
      date: rt.start_date,
      time: "10:00", // Horário padrão para recorrentes
      status: 'confirmado' as const,
      type: 'income', // Ajustar conforme necessário
      amount: rt.amount,
      category: rt.category?.name || undefined,
      recurring: true,
      recurringPattern: 'monthly' as const, // Padrão, pode ser ajustado
      createdAt: rt.created_at || new Date().toISOString(),
      updatedAt: rt.updated_at || new Date().toISOString()
    }))

    // Combina transações convertidas com compromissos reais do usuário
    return [...txCommitments, ...recurringCommitments, ...userCommitments]
  }, [transactions, recurringTransactions, userCommitments])

  const handleDayClick = (dayData: DayData) => {
    setSelectedDayData(dayData)
    setIsModalOpen(true)
  }

  const handleEmptyDayClick = (date: string) => {
    // Abrir modal de criação de novo compromisso com a data selecionada
    setSelectedDayData({
      date,
      commitments: []
    })
    setIsCreateModalOpen(true)
  }

  const handleCreateNewEvent = () => {
    // Abrir modal de criação de novo compromisso para hoje
    const today = new Date().toISOString().split('T')[0]
    setSelectedDayData({
      date: today,
      commitments: []
    })
    setIsCreateModalOpen(true)
  }

  const handleEditCommitment = (commitment: Commitment) => {
    // Só permite editar compromissos criados pelo usuário (não transações)
    const isUserCommitment = userCommitments.some(c => c.id === commitment.id)
    
    if (!isUserCommitment) {
      toast({
        title: "Não é possível editar",
        description: "Este é um evento baseado em transação e não pode ser editado aqui.",
        variant: "destructive"
      })
      return
    }
    
    setEditingCommitment(commitment)
    setSelectedDayData({
      date: commitment.date,
      commitments: [commitment]
    })
    setIsCreateModalOpen(true)
  }

  const handleDeleteCommitment = async (commitmentId: string) => {
    // Só permite excluir compromissos criados pelo usuário (não transações)
    const isUserCommitment = userCommitments.some(c => c.id === commitmentId)
    
    if (!isUserCommitment) {
      toast({
        title: "Não é possível excluir",
        description: "Este é um evento baseado em transação e não pode ser excluído aqui.",
        variant: "destructive"
      })
      return
    }

    try {
      await deleteCommitment(commitmentId)
      toast({
        title: "Compromisso excluído",
        description: "O compromisso foi excluído com sucesso."
      })
      setIsModalOpen(false)
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o compromisso. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  const handleSaveCommitment = async (commitmentData: Omit<Commitment, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingCommitment) {
        // Editando compromisso existente
        await updateCommitment(editingCommitment.id, commitmentData)
        toast({
          title: "Compromisso atualizado",
          description: "As alterações foram salvas com sucesso."
        })
      } else {
        // Criando novo compromisso
        await createCommitment(commitmentData)
        toast({
          title: "Compromisso criado",
          description: "O compromisso foi criado com sucesso."
        })
      }
      
      // Fechar modal após salvar
      setIsCreateModalOpen(false)
      setSelectedDayData(null)
      setEditingCommitment(null)
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o compromisso. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  const totalCommitments = commitments.length
  const totalAmount = commitments.reduce((sum, c) => sum + (c.amount || 0), 0)
  const confirmedCommitments = commitments.filter(c => c.status === 'confirmado').length

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-96 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Eventos</p>
                <p className="text-2xl font-bold">{totalCommitments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold">
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confirmados</p>
                <p className="text-2xl font-bold">{confirmedCommitments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Card */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
              </svg>
            </div>
            <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
              Agenda Financeira
            </CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="text-xs">
              {commitments.length} evento{commitments.length !== 1 ? 's' : ''}
            </Badge>
            <Button size="sm" className="flex items-center space-x-2" onClick={handleCreateNewEvent}>
              <Plus className="h-4 w-4" />
              <span>Novo Evento</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <FinancialCalendar
            commitments={commitments}
            setSelectedCommitment={(commitment) => {
              setSelectedDayData({
                date: commitment.date,
                commitments: [commitment]
              })
              setIsModalOpen(true)
            }}
            onDayClick={handleDayClick}
            onEmptyDayClick={handleEmptyDayClick}
          />
        </CardContent>
      </Card>

      {/* Modal de Compromissos */}
      <CommitmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dayData={selectedDayData}
        onEditCommitment={handleEditCommitment}
        onDeleteCommitment={handleDeleteCommitment}
      />

      {/* Modal de Criação/Edição */}
      <CreateCommitmentModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setSelectedDayData(null)
          setEditingCommitment(null)
        }}
        selectedDate={selectedDayData?.date}
        onSave={handleSaveCommitment}
        editingCommitment={editingCommitment}
      />
    </div>
  )
}