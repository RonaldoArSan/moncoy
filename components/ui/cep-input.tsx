'use client'

import { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

// Utilitários para CEP
function formatCEP(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 5) {
    return numbers
  } else {
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }
}

function unformatCEP(value: string): string {
  return value.replace(/\D/g, '')
}

export interface CEPInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string, unformatted: string) => void
}

const CEPInput = forwardRef<HTMLInputElement, CEPInputProps>(
  ({ className, onChange, value = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatCEP(String(value)))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formatted = formatCEP(inputValue)
      const unformatted = unformatCEP(inputValue)
      
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
        placeholder="00000-000"
        maxLength={9}
        className={cn(className)}
      />
    )
  }
)

CEPInput.displayName = 'CEPInput'

export { CEPInput }