'use client'

import { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Utilitários para CPF
function formatCPF(value: string): string {
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

function unformatCPF(value: string): string {
  return value.replace(/\D/g, '')
}

export interface CPFInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string, unformatted: string) => void
}

const CPFInput = forwardRef<HTMLInputElement, CPFInputProps>(
  ({ className, onChange, value = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatCPF(String(value)))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formatted = formatCPF(inputValue)
      const unformatted = unformatCPF(inputValue)
      
      setDisplayValue(formatted)
      onChange?.(formatted, unformatted)
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder="000.000.000-00"
        maxLength={14}
        className={cn(className)}
      />
    )
  }
)

CPFInput.displayName = 'CPFInput'

export { CPFInput }