#!/bin/bash

# Script de Verificação Rápida - MoncoyFinance
# Execute: chmod +x check-config.sh && ./check-config.sh

echo "🔍 Verificando Configuração do MoncoyFinance..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar variáveis de ambiente
echo "📋 1. Verificando variáveis de ambiente..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✓${NC} .env.local encontrado"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_URL presente"
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_SUPABASE_URL ausente"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY presente"
    else
        echo -e "${RED}✗${NC} NEXT_PUBLIC_SUPABASE_ANON_KEY ausente"
    fi
    
    if grep -q "NEXT_PUBLIC_SITE_URL" .env.local; then
        echo -e "${GREEN}✓${NC} NEXT_PUBLIC_SITE_URL presente"
    else
        echo -e "${YELLOW}⚠${NC} NEXT_PUBLIC_SITE_URL ausente (recomendado para produção)"
    fi
else
    echo -e "${RED}✗${NC} .env.local não encontrado"
fi

echo ""

# 2. Verificar arquivos críticos
echo "📁 2. Verificando estrutura de arquivos..."

if [ -f "app/auth/callback/route.ts" ]; then
    echo -e "${GREEN}✓${NC} app/auth/callback/route.ts existe"
else
    echo -e "${RED}✗${NC} app/auth/callback/route.ts ausente"
fi

if [ -f "app/auth/callback/page.tsx" ]; then
    echo -e "${RED}✗${NC} app/auth/callback/page.tsx existe (CONFLITO! Deve ser removido)"
else
    echo -e "${GREEN}✓${NC} app/auth/callback/page.tsx não existe (correto)"
fi

if [ -f "app/login/actions.ts" ]; then
    echo -e "${GREEN}✓${NC} app/login/actions.ts existe (Server Action)"
else
    echo -e "${YELLOW}⚠${NC} app/login/actions.ts ausente"
fi

if [ -f "middleware.ts" ]; then
    echo -e "${GREEN}✓${NC} middleware.ts existe"
else
    echo -e "${RED}✗${NC} middleware.ts ausente"
fi

echo ""

# 3. Verificar dependências
echo "📦 3. Verificando dependências..."

if [ -f "package.json" ]; then
    if grep -q "@supabase/ssr" package.json; then
        echo -e "${GREEN}✓${NC} @supabase/ssr instalado"
    else
        echo -e "${RED}✗${NC} @supabase/ssr não encontrado"
    fi
    
    if grep -q "next" package.json; then
        NEXT_VERSION=$(grep -o '"next": "[^"]*"' package.json | cut -d'"' -f4)
        echo -e "${GREEN}✓${NC} Next.js $NEXT_VERSION"
    fi
fi

echo ""

# 4. Verificar build
echo "🔨 4. Verificando build..."

if [ -d ".next" ]; then
    echo -e "${GREEN}✓${NC} Diretório .next existe"
    BUILD_DATE=$(stat -c %y .next 2>/dev/null || stat -f "%Sm" .next 2>/dev/null)
    echo -e "   Último build: $BUILD_DATE"
else
    echo -e "${YELLOW}⚠${NC} Diretório .next não encontrado - execute: pnpm build"
fi

echo ""

# 5. Verificar git
echo "🌿 5. Verificando Git..."

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Git inicializado - Branch: $CURRENT_BRANCH"
    
    # Verificar se há mudanças não commitadas
    if [ -n "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}⚠${NC} Há mudanças não commitadas"
        git status --short | head -5
    else
        echo -e "${GREEN}✓${NC} Working tree limpo"
    fi
else
    echo -e "${YELLOW}⚠${NC} Não é um repositório git"
fi

echo ""

# 6. Verificar conectividade
echo "🌐 6. Verificando conectividade..."

if command -v curl &> /dev/null; then
    # Verificar se o site está acessível
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://moncoyfinance.com 2>/dev/null)
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✓${NC} https://moncoyfinance.com acessível (HTTP $HTTP_CODE)"
    else
        echo -e "${RED}✗${NC} https://moncoyfinance.com retornou HTTP $HTTP_CODE"
    fi
    
    # Verificar Supabase
    SUPABASE_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://dxdbpppymxfiojszrmir.supabase.co 2>/dev/null)
    if [ "$SUPABASE_CODE" = "200" ] || [ "$SUPABASE_CODE" = "404" ]; then
        echo -e "${GREEN}✓${NC} Supabase acessível (HTTP $SUPABASE_CODE)"
    else
        echo -e "${RED}✗${NC} Supabase retornou HTTP $SUPABASE_CODE"
    fi
else
    echo -e "${YELLOW}⚠${NC} curl não instalado - pulando verificação de conectividade"
fi

echo ""

# 7. Resumo
echo "📊 RESUMO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Próximos passos recomendados:"
echo ""
echo "1. Se há erros acima, corrija-os primeiro"
echo "2. Execute: pnpm build"
echo "3. Teste localmente: pnpm dev"
echo "4. Teste login em: http://localhost:3000/login"
echo "5. Se funcionar local, faça deploy:"
echo "   git add ."
echo "   git commit -m 'fix: resolve authentication issues'"
echo "   git push origin main"
echo ""
echo "6. Verifique variáveis de ambiente no Vercel:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - NEXT_PUBLIC_SITE_URL"
echo ""
echo "7. Força redeploy no Vercel após adicionar variáveis"
echo ""
echo "Documentação completa: DIAGNOSTICO-PRODUCAO.md"
echo ""
