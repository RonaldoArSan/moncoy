#!/usr/bin/env node

/**
 * Script de verificação da configuração do Google OAuth 2.0
 * 
 * Execute: node scripts/check-oauth-config.js
 * ou: npm run check-oauth
 * 
 * Este script valida se todas as configurações necessárias
 * para o Google OAuth estão presentes e corretas.
 */

const fs = require('fs')
const path = require('path')

// Função para carregar variáveis de ambiente do .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const env = {}
  
  if (!fs.existsSync(envPath)) {
    return env
  }
  
  const content = fs.readFileSync(envPath, 'utf8')
  const lines = content.split('\n')
  
  lines.forEach(line => {
    // Ignorar comentários e linhas vazias
    if (line.trim().startsWith('#') || !line.trim()) {
      return
    }
    
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      env[key] = value
    }
  })
  
  return env
}

// Carregar variáveis de ambiente
const env = loadEnvFile()
const hasEnvFile = Object.keys(env).length > 0

const validation = {
  isValid: true,
  errors: [],
  warnings: [],
  info: []
}

console.log('\n🔐 ===== VERIFICAÇÃO DE CONFIGURAÇÃO GOOGLE OAUTH 2.0 =====\n')

if (!hasEnvFile) {
  console.log('⚠️  Arquivo .env.local não encontrado!\n')
  console.log('📝 AÇÃO NECESSÁRIA:')
  console.log('')
  console.log('1. Copie o arquivo de exemplo:')
  console.log('   cp .env.example .env.local')
  console.log('')
  console.log('2. Edite .env.local e adicione suas credenciais')
  console.log('')
  console.log('3. Execute este script novamente:')
  console.log('   npm run check-oauth')
  console.log('')
  console.log('📖 Para mais informações, consulte:')
  console.log('   - CONFIGURACAO-GOOGLE-OAUTH.md')
  console.log('   - docs/GOOGLE-OAUTH-SETUP.md')
  console.log('')
  console.log('════════════════════════════════════════════════════════════\n')
  process.exit(1)
}

// Verificar variáveis obrigatórias
console.log('📋 Verificando variáveis de ambiente obrigatórias...\n')

if (!env.NEXT_PUBLIC_SUPABASE_URL) {
  validation.errors.push('NEXT_PUBLIC_SUPABASE_URL não encontrada')
  validation.isValid = false
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL: ' + env.NEXT_PUBLIC_SUPABASE_URL)
}

if (!env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  validation.errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrada')
  validation.isValid = false
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: [DEFINIDA]')
}

console.log('')

// Verificar variáveis opcionais mas recomendadas
console.log('📋 Verificando variáveis opcionais (recomendadas)...\n')

if (env.NEXT_PUBLIC_APP_NAME) {
  console.log('✅ NEXT_PUBLIC_APP_NAME: ' + env.NEXT_PUBLIC_APP_NAME)
} else {
  validation.warnings.push('NEXT_PUBLIC_APP_NAME não configurada')
  console.log('⚠️  NEXT_PUBLIC_APP_NAME: não configurada (opcional)')
}

if (env.NEXT_PUBLIC_APP_DOMAIN) {
  console.log('✅ NEXT_PUBLIC_APP_DOMAIN: ' + env.NEXT_PUBLIC_APP_DOMAIN)
} else {
  validation.warnings.push('NEXT_PUBLIC_APP_DOMAIN não configurada')
  console.log('⚠️  NEXT_PUBLIC_APP_DOMAIN: não configurada (opcional)')
}

if (env.NEXT_PUBLIC_ADMIN_EMAIL) {
  console.log('✅ NEXT_PUBLIC_ADMIN_EMAIL: ' + env.NEXT_PUBLIC_ADMIN_EMAIL)
} else {
  validation.warnings.push('NEXT_PUBLIC_ADMIN_EMAIL não configurada')
  console.log('⚠️  NEXT_PUBLIC_ADMIN_EMAIL: não configurada (necessária para admin)')
}

console.log('')

// Gerar URLs necessárias
if (validation.isValid) {
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const domain = env.NEXT_PUBLIC_APP_DOMAIN || 'moncoyfinance.com'
  const supabaseCallbackUrl = `${supabaseUrl}/auth/v1/callback`

  console.log('🎯 URLs para configurar no Google Cloud Console:\n')
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('1️⃣  Authorized JavaScript Origins:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('   http://localhost:3000')
  console.log(`   https://${domain}`)
  console.log(`   https://www.${domain}`)
  console.log('')
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('2️⃣  Authorized Redirect URIs:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('   http://localhost:3000/auth/callback')
  console.log(`   https://${domain}/auth/callback`)
  console.log(`   https://www.${domain}/auth/callback`)
  console.log('')
  console.log('   🔴 CRÍTICO - URI DO SUPABASE:')
  console.log(`   ${supabaseCallbackUrl}`)
  console.log('')
  console.log('   ⚠️  A URI do Supabase é OBRIGATÓRIA!')
  console.log('   Sem ela, o login com Google NÃO funcionará!')
  console.log('')
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('3️⃣  OAuth Consent Screen:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('   Application name: MoncoyFinance')
  console.log('   Authorized domains: moncoyfinance.com, supabase.co')
  console.log('   Scopes: email, profile, openid')
  console.log('')
}

// Mostrar resumo
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('📊 RESUMO:')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('')

if (validation.errors.length > 0) {
  console.log('❌ ERROS CRÍTICOS:')
  validation.errors.forEach(error => console.log(`   - ${error}`))
  console.log('')
}

if (validation.warnings.length > 0) {
  console.log('⚠️  AVISOS:')
  validation.warnings.forEach(warning => console.log(`   - ${warning}`))
  console.log('')
}

if (validation.isValid) {
  console.log('✅ Configuração básica válida!')
  console.log('')
  console.log('📝 PRÓXIMOS PASSOS:')
  console.log('')
  console.log('1. Acesse: https://console.cloud.google.com')
  console.log('2. Vá para: APIs & Services → Credentials')
  console.log('3. Configure as URLs listadas acima')
  console.log('4. Configure o Provider Google no Supabase')
  console.log('')
  console.log('📖 Para instruções detalhadas, consulte:')
  console.log('   - CONFIGURACAO-GOOGLE-OAUTH.md (solução rápida)')
  console.log('   - docs/GOOGLE-OAUTH-SETUP.md (guia completo)')
} else {
  console.log('❌ Configuração inválida!')
  console.log('')
  console.log('📝 AÇÃO NECESSÁRIA:')
  console.log('')
  console.log('1. Crie o arquivo .env.local na raiz do projeto')
  console.log('2. Adicione as variáveis de ambiente necessárias')
  console.log('3. Execute este script novamente')
  console.log('')
  console.log('📖 Consulte: docs/GOOGLE-OAUTH-SETUP.md')
}

console.log('')
console.log('════════════════════════════════════════════════════════════\n')

// Exit code
process.exit(validation.isValid ? 0 : 1)
