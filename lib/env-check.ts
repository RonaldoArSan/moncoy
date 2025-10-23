/**
 * Environment Configuration Validation
 * 
 * This module validates that required environment variables are properly configured
 * before the application attempts to use them.
 */

export interface EnvCheckResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Check if Supabase environment variables are properly configured
 * @returns EnvCheckResult with validation status and messages
 */
export function checkSupabaseEnv(): EnvCheckResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check required variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL não configurada')
  } else {
    // Validate URL format
    try {
      const url = new URL(supabaseUrl)
      if (!url.hostname.includes('supabase')) {
        warnings.push('NEXT_PUBLIC_SUPABASE_URL pode não ser uma URL do Supabase válida')
      }
    } catch {
      errors.push('NEXT_PUBLIC_SUPABASE_URL não é uma URL válida')
    }
  }

  if (!supabaseKey) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada')
  } else if (supabaseKey.length < 100) {
    warnings.push('NEXT_PUBLIC_SUPABASE_ANON_KEY parece ser muito curta')
  }

  // Check optional but recommended variables
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    warnings.push('NEXT_PUBLIC_SITE_URL não configurada (recomendado para produção)')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get a user-friendly error message for environment configuration issues
 */
export function getEnvErrorMessage(result: EnvCheckResult): string {
  if (result.isValid) {
    return ''
  }

  let message = 'Erro de configuração:\n'
  message += result.errors.join('\n')
  
  if (result.warnings.length > 0) {
    message += '\n\nAvisos:\n'
    message += result.warnings.join('\n')
  }
  
  message += '\n\nPor favor, entre em contato com o suporte.'
  
  return message
}

/**
 * Log environment check results to console (development only)
 */
export function logEnvCheck(): void {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const result = checkSupabaseEnv()
  
  if (!result.isValid) {
    console.error('❌ Environment Configuration Errors:', result.errors)
  }
  
  if (result.warnings.length > 0) {
    console.warn('⚠️ Environment Configuration Warnings:', result.warnings)
  }
  
  if (result.isValid && result.warnings.length === 0) {
    console.log('✅ Environment configuration is valid')
  }
}
