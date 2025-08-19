// Utilitários para máscara de telefone brasileiro

export function formatPhoneNumber(value: string): string {
  // Remove todos os caracteres não numéricos
  const numbers = value.replace(/\D/g, '')
  
  // Aplica a máscara baseada no tamanho
  if (numbers.length === 0) {
    return ''
  } else if (numbers.length <= 2) {
    return `(${numbers})`
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

export function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidPhoneNumber(value: string): boolean {
  const numbers = unformatPhoneNumber(value)
  return numbers.length === 10 || numbers.length === 11
}