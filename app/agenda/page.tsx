
"use client"

import { useMemo } from "react"
import { useTransactions } from "@/hooks/use-transactions"
import { Calendar, momentLocalizer } from "react-big-calendar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const localizer = momentLocalizer(require('moment'))

export default function AgendaPage() {
  const { transactions, recurringTransactions, loading } = useTransactions()

  // Monta eventos para o calendário
  const events = useMemo(() => {
    const txEvents = transactions.map(tx => ({
      id: tx.id,
      title: `${tx.type === 'income' ? 'Entrada' : 'Saída'}: ${tx.description}`,
      start: parseISO(tx.date),
      end: parseISO(tx.date),
      allDay: true,
      resource: { type: tx.type, amount: tx.amount }
    }))
    const recEvents = recurringTransactions.map(rt => ({
      id: rt.id,
      title: `Recorrente: ${rt.description}`,
      start: parseISO(rt.start_date),
      end: parseISO(rt.start_date),
      allDay: true,
      resource: { type: 'recorrente', amount: rt.amount }
    }))
    return [...txEvents, ...recEvents]
  }, [transactions, recurringTransactions])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
                Agenda Financeira
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center h-96 bg-muted/20 rounded-xl border-2 border-dashed border-muted">
              <div className="text-center space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">Carregando eventos...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl text-blue-700 dark:text-blue-300">
              Agenda Financeira
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {events.length} evento{events.length !== 1 ? 's' : ''}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Legenda de cores */}
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg border">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-600 border border-green-700"></div>
              <span className="text-sm font-medium text-muted-foreground">Receitas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-red-600 border border-red-700"></div>
              <span className="text-sm font-medium text-muted-foreground">Despesas</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-yellow-600 border border-yellow-700"></div>
              <span className="text-sm font-medium text-muted-foreground">Recorrentes</span>
            </div>
          </div>

          <div 
            className="rounded-xl shadow-lg border bg-background overflow-hidden" 
            style={{ height: '75vh', minHeight: 500, maxHeight: '80vh' }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={['month', 'week', 'day']}
              messages={{
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                today: 'Hoje',
                previous: 'Anterior',
                next: 'Próximo',
                agenda: 'Agenda',
                date: 'Data',
                time: 'Horário',
                event: 'Evento',
                showMore: (total: number) => `+ Ver mais (${total})`,
                work_week: 'Semana útil',
                allDay: 'Dia inteiro',
                noEventsInRange: 'Nenhum evento neste período.',
                weekNumber: 'Nº da semana',
                dayHeaderFormat: 'dddd, D MMMM',
                selectRange: 'Selecione o período',
                select: 'Selecionar',
                notSelected: 'Não selecionado',
                back: 'Voltar',
                forward: 'Avançar',
                close: 'Fechar',
                open: 'Abrir',
                update: 'Atualizar',
                add: 'Adicionar',
                delete: 'Excluir',
                edit: 'Editar',
                more: 'Mais',
              }}
              culture="pt-BR"
              style={{ 
                height: '100%', 
                width: '100%',
                backgroundColor: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))'
              }}
              eventPropGetter={(event: any) => {
                let eventStyle = {
                  borderRadius: '8px',
                  fontWeight: '500',
                  fontSize: '12px',
                  border: 'none',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  padding: '4px 8px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }

                if (event.resource.type === 'income') {
                  return {
                    style: {
                      ...eventStyle,
                      backgroundColor: 'hsl(142 76% 36%)',
                      color: 'white',
                      border: '1px solid hsl(142 76% 30%)'
                    }
                  }
                }
                if (event.resource.type === 'expense') {
                  return {
                    style: {
                      ...eventStyle,
                      backgroundColor: 'hsl(0 84% 60%)',
                      color: 'white',
                      border: '1px solid hsl(0 84% 50%)'
                    }
                  }
                }
                if (event.resource.type === 'recorrente') {
                  return {
                    style: {
                      ...eventStyle,
                      backgroundColor: 'hsl(43 96% 56%)',
                      color: 'hsl(0 0% 9%)',
                      border: '1px solid hsl(43 96% 46%)'
                    }
                  }
                }
                
                return {
                  style: {
                    ...eventStyle,
                    backgroundColor: 'hsl(var(--muted))',
                    color: 'hsl(var(--muted-foreground))',
                    border: '1px solid hsl(var(--border))'
                  }
                }
              }}
              components={{
                event: ({ event }: { event: any }) => (
                  <div className="flex flex-col p-1 hover:scale-105 transition-transform duration-200">
                    <div className="flex items-center space-x-1">
                      {event.resource.type === 'income' && (
                        <TrendingUp className="h-3 w-3 flex-shrink-0" />
                      )}
                      {event.resource.type === 'expense' && (
                        <TrendingDown className="h-3 w-3 flex-shrink-0" />
                      )}
                      {event.resource.type === 'recorrente' && (
                        <DollarSign className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="text-xs font-medium truncate">
                        {event.title.replace(/^(Entrada|Saída|Recorrente): /, '')}
                      </span>
                    </div>
                    <span className="text-xs opacity-90 font-semibold">
                      R$ {Number(event.resource.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ),
                toolbar: (props: any) => (
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-card to-muted/50 border-b border-border rounded-t-xl">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.onNavigate('PREV')}
                        className="flex items-center space-x-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline">Anterior</span>
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => props.onNavigate('TODAY')}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Hoje
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => props.onNavigate('NEXT')}
                        className="flex items-center space-x-1"
                      >
                        <span className="hidden sm:inline">Próximo</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <h2 className="text-lg font-semibold text-primary">
                      {props.label}
                    </h2>
                    
                    <div className="flex items-center space-x-1">
                      {props.views && props.views.map((view: any) => (
                        <Button
                          key={view}
                          variant={props.view === view ? "default" : "ghost"}
                          size="sm"
                          onClick={() => props.onView(view)}
                          className={props.view === view ? "bg-primary text-primary-foreground" : ""}
                        >
                          {view === 'month' ? 'Mês' : view === 'week' ? 'Semana' : view === 'day' ? 'Dia' : view}
                        </Button>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}