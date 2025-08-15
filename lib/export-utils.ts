import type { Transaction } from '@/lib/supabase'

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf'
  period: string
  startDate?: string
  endDate?: string
  includeCharts?: boolean
}

export function filterTransactionsByPeriod(transactions: Transaction[], period: string, startDate?: string, endDate?: string): Transaction[] {
  const now = new Date()
  let start: Date
  let end: Date = now

  switch (period) {
    case 'current-month':
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'last-month':
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      end = new Date(now.getFullYear(), now.getMonth(), 0)
      break
    case 'last-3-months':
      start = new Date(now.getFullYear(), now.getMonth() - 3, 1)
      break
    case 'last-6-months':
      start = new Date(now.getFullYear(), now.getMonth() - 6, 1)
      break
    case 'current-year':
      start = new Date(now.getFullYear(), 0, 1)
      break
    case 'custom':
      if (!startDate || !endDate) return transactions
      start = new Date(startDate)
      end = new Date(endDate)
      break
    default:
      return transactions
  }

  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    return transactionDate >= start && transactionDate <= end
  })
}

export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Status']
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString('pt-BR'),
    t.description,
    t.category?.name || 'Sem categoria',
    t.type === 'income' ? 'Receita' : 'Despesa',
    `R$ ${t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    t.status === 'completed' ? 'Concluída' : 'Pendente'
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

export function exportToExcel(transactions: Transaction[]): void {
  const data = transactions.map(t => ({
    'Data': new Date(t.date).toLocaleDateString('pt-BR'),
    'Descrição': t.description,
    'Categoria': t.category?.name || 'Sem categoria',
    'Tipo': t.type === 'income' ? 'Receita' : 'Despesa',
    'Valor': t.amount,
    'Status': t.status === 'completed' ? 'Concluída' : 'Pendente'
  }))

  // Simple Excel export using data URI
  const worksheet = data.map(row => Object.values(row).join('\t')).join('\n')
  const headers = Object.keys(data[0] || {}).join('\t')
  const content = headers + '\n' + worksheet

  const blob = new Blob([content], { type: 'application/vnd.ms-excel' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `transacoes_${new Date().toISOString().split('T')[0]}.xls`
  link.click()
}

export function exportToPDF(transactions: Transaction[]): void {
  const content = `
    <html>
      <head>
        <title>Relatório de Transações</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .income { color: green; }
          .expense { color: red; }
        </style>
      </head>
      <body>
        <h1>Relatório de Transações</h1>
        <p>Gerado em: ${new Date().toLocaleDateString('pt-BR')}</p>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(t => `
              <tr>
                <td>${new Date(t.date).toLocaleDateString('pt-BR')}</td>
                <td>${t.description}</td>
                <td>${t.category?.name || 'Sem categoria'}</td>
                <td>${t.type === 'income' ? 'Receita' : 'Despesa'}</td>
                <td class="${t.type}">${t.type === 'income' ? '+' : '-'}R$ ${Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td>${t.status === 'completed' ? 'Concluída' : 'Pendente'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `

  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }
}

export function exportTransactions(transactions: Transaction[], options: ExportOptions): void {
  const filteredTransactions = filterTransactionsByPeriod(
    transactions, 
    options.period, 
    options.startDate, 
    options.endDate
  )

  switch (options.format) {
    case 'csv':
      exportToCSV(filteredTransactions)
      break
    case 'excel':
      exportToExcel(filteredTransactions)
      break
    case 'pdf':
      exportToPDF(filteredTransactions)
      break
  }
}