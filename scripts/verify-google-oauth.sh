#!/bin/bash

# Script de Verificação de Configuração Google OAuth
# MoncoyFinance

echo "🔍 Verificando Configuração do Google OAuth..."
echo "================================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar variáveis de ambiente
echo "📋 Passo 1: Verificando variáveis de ambiente"
echo "----------------------------------------------"

if [ -f .env.local ]; then
    echo -e "${GREEN}✓${NC} Arquivo .env.local encontrado"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d '=' -f2)
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL}"
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_SUPABASE_URL não encontrado"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY: Configurado"
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY não encontrado"
    fi
else
    echo -e "${RED}✗${NC} Arquivo .env.local NÃO encontrado"
fi

echo ""

# Verificar callback URL
echo "🔗 Passo 2: URL de Callback Necessária"
echo "--------------------------------------"
echo "Adicione esta URL no Google Cloud Console:"
echo -e "${YELLOW}${SUPABASE_URL}/auth/v1/callback${NC}"
echo ""
echo "Caminho no Google Cloud:"
echo "APIs & Services → Credentials → OAuth 2.0 Client IDs"
echo "→ Authorized redirect URIs"
echo ""

# Verificar servidor
echo "🖥️  Passo 3: Verificando servidor Next.js"
echo "-----------------------------------------"

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Servidor rodando na porta 3000"
    echo "Acesse: http://localhost:3000/login"
else
    echo -e "${YELLOW}⚠${NC} Servidor NÃO está rodando na porta 3000"
    echo "Execute: pnpm dev"
fi

echo ""

# Checklist
echo "✅ Checklist de Configuração"
echo "----------------------------"
echo "[ ] Google Cloud Console: OAuth 2.0 Client ID criado"
echo "[ ] Redirect URI adicionado: ${SUPABASE_URL}/auth/v1/callback"
echo "[ ] Supabase Dashboard: Google provider ativado"
echo "[ ] Supabase: Client ID e Secret configurados"
echo "[ ] Teste: Login com Google funcionando"
echo ""

# URLs úteis
echo "🔗 Links Úteis"
echo "--------------"
echo "Google Cloud Console:"
echo "  https://console.cloud.google.com/apis/credentials"
echo ""
echo "Supabase Dashboard:"
echo "  https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/auth/providers"
echo ""
echo "Documentação:"
echo "  docs/FIX-GOOGLE-OAUTH-ERROR.md"
echo ""

# Teste de conectividade
echo "🧪 Passo 4: Testando conectividade com Supabase"
echo "------------------------------------------------"

if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${SUPABASE_URL}/rest/v1/" -H "apikey: ${NEXT_PUBLIC_SUPABASE_ANON_KEY}" 2>/dev/null)
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "401" ] || [ "$RESPONSE" = "404" ]; then
        echo -e "${GREEN}✓${NC} Supabase está acessível (HTTP ${RESPONSE})"
    else
        echo -e "${RED}✗${NC} Erro ao acessar Supabase (HTTP ${RESPONSE})"
    fi
else
    echo -e "${YELLOW}⚠${NC} curl não instalado - não foi possível testar conectividade"
fi

echo ""
echo "================================================"
echo "✨ Verificação concluída!"
echo ""
echo "💡 Próximo passo:"
echo "   1. Abra o Google Cloud Console (link acima)"
echo "   2. Configure o Redirect URI"
echo "   3. Teste o login: http://localhost:3000/login"
echo ""
