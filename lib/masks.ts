// Utilitários centralizados para máscaras brasileiras

// TELEFONE
export function formatPhoneNumber(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 2) {
    return `(${numbers}`
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

// CPF
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }
}

// CNPJ
export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
  } else if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`
  } else if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`
  } else {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`
  }
}

// CEP
export function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 5) {
    return numbers
  } else {
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }
}

// DINHEIRO
export function formatCurrency(value: string): string {
  const numbers = value.replace(/\D/g, '')
  const amount = parseFloat(numbers) / 100
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount || 0)
}

// REMOVER FORMATAÇÃO
export function unformat(value: string): string {
  return value.replace(/\D/g, '')
}

// VALIDAÇÕES
export function isValidCPF(cpf: string): boolean {
  const numbers = unformat(cpf)
  return numbers.length === 11
}

export function isValidCNPJ(cnpj: string): boolean {
  const numbers = unformat(cnpj)
  return numbers.length === 14
}

export function isValidPhone(phone: string): boolean {
  const numbers = unformat(phone)
  return numbers.length === 10 || numbers.length === 11
}

export function isValidCEP(cep: string): boolean {
  const numbers = unformat(cep)
  return numbers.length === 8
}