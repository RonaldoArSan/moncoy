/**
 * Validação de Configuração do Google OAuth 2.0
 * 
 * Este utilitário ajuda a identificar problemas de configuração do Google OAuth
 * antes que o usuário tente fazer login.
 */

export interface OAuthConfigValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Valida a configuração do Google OAuth 2.0
 * Verifica se todas as variáveis de ambiente necessárias estão presentes
 */
export function validateGoogleOAuthConfig(): OAuthConfigValidation {
  const errors: string[] = []
  const warnings: string[] = []

  // Validar variáveis obrigatórias do Supabase
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL não está configurada no .env.local')
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada no .env.local')
  }

  // Validar formato da URL do Supabase
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!supabaseUrl.startsWith('https://')) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL deve começar com https://')
    }

    if (!supabaseUrl.includes('supabase.co')) {
      warnings.push('URL do Supabase parece inválida. Verifique se está correta.')
    }
  }

  // Avisos sobre configurações opcionais mas recomendadas
  if (!process.env.NEXT_PUBLIC_APP_NAME) {
    warnings.push('NEXT_PUBLIC_APP_NAME não configurada - recomendado para branding')
  }

  if (!process.env.NEXT_PUBLIC_APP_DOMAIN) {
    warnings.push('NEXT_PUBLIC_APP_DOMAIN não configurada - recomendado para produção')
  }

  if (!process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    warnings.push('NEXT_PUBLIC_ADMIN_EMAIL não configurada - necessária para acesso admin')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Gera a URL de callback do Supabase para o Google OAuth
 * Esta é a URL que deve ser registrada no Google Cloud Console
 */
export function getSupabaseCallbackUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  return `${supabaseUrl}/auth/v1/callback`
}

/**
 * Gera lista de todas as URLs que devem ser registradas no Google Cloud Console
 */
export function getRequiredGoogleOAuthUrls() {
  const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'moncoyfinance.com'
  const supabaseCallbackUrl = getSupabaseCallbackUrl()

  return {
    authorizedOrigins: [
      'http://localhost:3000',
      `https://${domain}`,
      `https://www.${domain}`
    ],
    redirectUris: [
      'http://localhost:3000/auth/callback',
      `https://${domain}/auth/callback`,
      `https://www.${domain}/auth/callback`,
      supabaseCallbackUrl
    ],
    supabaseCallbackUrl // A mais importante!
  }
}

/**
 * Imprime no console as instruções de configuração do Google OAuth
 * Útil para desenvolvimento
 */
export function printOAuthSetupInstructions() {
  const validation = validateGoogleOAuthConfig()
  const urls = getRequiredGoogleOAuthUrls()

  console.log('\n🔐 ===== CONFIGURAÇÃO DO GOOGLE OAUTH 2.0 =====\n')

  // Mostrar erros
  if (validation.errors.length > 0) {
    console.error('❌ ERROS CRÍTICOS:')
    validation.errors.forEach(error => console.error(`   - ${error}`))
    console.log('')
  }

  // Mostrar avisos
  if (validation.warnings.length > 0) {
    console.warn('⚠️  AVISOS:')
    validation.warnings.forEach(warning => console.warn(`   - ${warning}`))
    console.log('')
  }

  // Mostrar URLs necessárias
  if (validation.isValid) {
    console.log('✅ Configuração básica válida!\n')
    
    console.log('📋 URLs para registrar no Google Cloud Console:\n')
    
    console.log('Authorized JavaScript Origins:')
    urls.authorizedOrigins.forEach(url => console.log(`   ✓ ${url}`))
    console.log('')
    
    console.log('Authorized Redirect URIs:')
    urls.redirectUris.forEach(url => console.log(`   ✓ ${url}`))
    console.log('')
    
    console.log('🎯 URI CRÍTICA (Supabase Callback):')
    console.log(`   ➜ ${urls.supabaseCallbackUrl}`)
    console.log('   Esta URI é OBRIGATÓRIA para o login funcionar!')
    console.log('')
    
    console.log('📖 Para instruções completas, consulte:')
    console.log('   - CONFIGURACAO-GOOGLE-OAUTH.md (solução rápida)')
    console.log('   - docs/GOOGLE-OAUTH-SETUP.md (guia completo)')
    console.log('')
  }

  console.log('================================================\n')

  return validation
}

/**
 * Middleware de validação que pode ser executado no startup
 * Útil para desenvolvimento para identificar problemas rapidamente
 */
export function validateOAuthOnStartup() {
  if (process.env.NODE_ENV === 'development') {
    // Apenas em desenvolvimento, para não afetar produção
    setTimeout(() => {
      printOAuthSetupInstructions()
    }, 1000) // Pequeno delay para não interferir com outros logs
  }
}
