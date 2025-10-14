#!/bin/bash

# Script para verificar configurações do Google OAuth para MoncoyFinance
echo "🔍 Verificando configurações do Google OAuth para MoncoyFinance..."
echo "================================================================"

# Verificar variáveis de ambiente
echo ""
echo "📋 Variáveis de Ambiente:"
echo "NEXT_PUBLIC_APP_NAME: ${NEXT_PUBLIC_APP_NAME:-❌ Não definida}"
echo "NEXT_PUBLIC_APP_DOMAIN: ${NEXT_PUBLIC_APP_DOMAIN:-❌ Não definida}"
echo "NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-❌ Não definida}"
echo "NEXT_PUBLIC_SUPABASE_URL: ${NEXT_PUBLIC_SUPABASE_URL:-❌ Não definida}"

# Verificar arquivos importantes
echo ""
echo "📁 Arquivos de Configuração:"
if [ -f ".env.local" ]; then
    echo "✅ .env.local existe"
else
    echo "❌ .env.local não encontrado"
fi

if [ -f "lib/brand-config.ts" ]; then
    echo "✅ brand-config.ts existe"
else
    echo "❌ brand-config.ts não encontrado"
fi

if [ -f "GOOGLE_AUTH_CUSTOMIZATION.md" ]; then
    echo "✅ Guia de customização existe"
else
    echo "❌ Guia de customização não encontrado"
fi

# Testar se o servidor está rodando
echo ""
echo "🌐 Testando servidor local:"
if curl -s http://localhost:3000 >/dev/null; then
    echo "✅ Servidor local está rodando (localhost:3000)"
else
    echo "❌ Servidor local não está rodando"
    echo "   Execute: pnpm run dev"
fi

echo ""
echo "📝 Próximos passos:"
echo "1. Configure no Google Cloud Console:"
echo "   - Application name: MoncoyFinance"
echo "   - Authorized domains: moncoyfinance.com, localhost"
echo ""
echo "2. Configure no Supabase Dashboard:"
echo "   - Site URL: https://moncoyfinance.com"
echo "   - Redirect URLs atualizadas"
echo ""
echo "3. Teste o login Google em modo incógnito"
echo ""
echo "📖 Veja GOOGLE_AUTH_CUSTOMIZATION.md para instruções detalhadas"
echo "================================================================"