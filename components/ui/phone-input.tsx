'use client'

import { forwardRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { formatPhoneNumber, unformatPhoneNumber } from '@/lib/phone-mask'
import { cn } from '@/lib/utils'

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string, unformatted: string) => void
}

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value = '', ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(formatPhoneNumber(String(value)))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formatted = formatPhoneNumber(inputValue)
      const unformatted = unformatPhoneNumber(inputValue)
      
      setDisplayValue(formatted)
      onChange?.(formatted, unformatted)
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder="(11) 99999-9999"
        maxLength={15}
        className={cn(className)}
      />
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

export { PhoneInput }