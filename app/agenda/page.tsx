
"use client"

import { useMemo } from "react"
import { useTransactions } from "@/hooks/use-transactions"
import { Calendar, momentLocalizer } from "react-big-calendar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"

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

  return (
  <div className="max-w-6xl mx-auto p-2 space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Agenda Financeira</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg shadow-lg border bg-background" style={{ width: '100%', height: '70vh', minHeight: 400, maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
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
              style={{ flex: 1, width: '100%', height: '100%', background: 'hsl(var(--background))', color: 'hsl(var(--foreground))', borderRadius: 12 }}
              eventPropGetter={(event: any) => {
                let bg = '#e2e8f0', color = '#222', border = '1px solid #d1d5db'
                if (event.resource.type === 'income') { bg = '#bbf7d0'; color = '#065f46'; border = '1px solid #34d399' }
                if (event.resource.type === 'destructive' || event.resource.type === 'expense') { bg = '#fecaca'; color = '#991b1b'; border = '1px solid #f87171' }
                if (event.resource.type === 'recorrente') { bg = '#fef9c3'; color = '#92400e'; border = '1px solid #fde68a' }
                return { style: { backgroundColor: bg, color, border, borderRadius: 8, fontWeight: 500, boxShadow: '0 1px 4px #0001', cursor: 'pointer', transition: '0.2s' } }
              }}
              components={{
                event: ({ event }: { event: any }) => (
                  <div className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                    <span className="block text-sm font-semibold">{event.title}</span>
                    <span className="block text-xs text-gray-500">R$ {event.resource.amount}</span>
                  </div>
                ),
                toolbar: (props: any) => (
                  <div className="flex items-center justify-between px-2 py-1 rounded-t-lg border-b"
                    style={{ background: 'var(--sidebar)', color: 'var(--sidebar-foreground)', borderColor: 'var(--sidebar-border)' }}>
                    <div className="flex gap-1">
                      <button className="px-2 py-1 rounded" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }} onClick={() => props.onNavigate('PREV')}>{(props.messages && props.messages.previous) ? props.messages.previous : 'Anterior'}</button>
                      <button className="px-2 py-1 rounded" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }} onClick={() => props.onNavigate('TODAY')}>{(props.messages && props.messages.today) ? props.messages.today : 'Hoje'}</button>
                      <button className="px-2 py-1 rounded" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }} onClick={() => props.onNavigate('NEXT')}>{(props.messages && props.messages.next) ? props.messages.next : 'Próximo'}</button>
                    </div>
                    <span className="font-bold text-lg" style={{ color: 'var(--sidebar-primary)' }}>{props.label}</span>
                    <div className="flex gap-1">
                      {props.views && props.views.map((view: any) => (
                        <button key={view}
                          className={`px-2 py-1 rounded`}
                          style={{
                            background: props.view === view ? 'var(--primary)' : 'var(--secondary)',
                            color: props.view === view ? 'var(--primary-foreground)' : 'var(--secondary-foreground)'
                          }}
                          onClick={() => props.onView(view)}>
                          {view === 'month' ? 'Mês' : view === 'week' ? 'Semana' : view === 'day' ? 'Dia' : view}
                        </button>
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