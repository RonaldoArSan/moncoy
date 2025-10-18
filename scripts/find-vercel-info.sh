#!/bin/bash

# Script para ajudar a encontrar informações sobre o deploy na Vercel
# Execute: bash scripts/find-vercel-info.sh

echo "🔍 Procurando informações sobre o deploy na Vercel..."
echo ""

# Verificar se Vercel CLI está instalada
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI encontrada"
    echo ""
    
    # Verificar se já está linkado
    if [ -d ".vercel" ]; then
        echo "✅ Projeto já está linkado localmente"
        echo ""
        echo "📋 Informações do projeto:"
        vercel inspect 2>/dev/null || echo "⚠️  Erro ao obter informações"
    else
        echo "⚠️  Projeto NÃO está linkado localmente"
        echo ""
        echo "🔗 Para linkar, execute:"
        echo "   vercel link"
    fi
else
    echo "❌ Vercel CLI não instalada"
    echo ""
    echo "📦 Para instalar:"
    echo "   npm install -g vercel"
    echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar variáveis de ambiente relacionadas
echo "🔍 Variáveis de ambiente encontradas:"
echo ""

if [ -f ".env" ]; then
    echo "📄 .env:"
    grep -i "vercel\|url\|domain" .env 2>/dev/null | sed 's/=.*/=***/' || echo "   Nenhuma variável relacionada"
    echo ""
fi

if [ -f ".env.local" ]; then
    echo "📄 .env.local:"
    grep -i "vercel\|url\|domain" .env.local 2>/dev/null | sed 's/=.*/=***/' || echo "   Nenhuma variável relacionada"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar package.json
echo "🔍 Informações do package.json:"
if [ -f "package.json" ]; then
    PROJECT_NAME=$(grep -o '"name": *"[^"]*"' package.json | cut -d'"' -f4)
    echo "   Nome do projeto: $PROJECT_NAME"
else
    echo "   ⚠️  package.json não encontrado"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verificar git remote
echo "🔍 Repositório Git:"
if git rev-parse --git-dir > /dev/null 2>&1; then
    REMOTE_URL=$(git remote get-url origin 2>/dev/null)
    if [ ! -z "$REMOTE_URL" ]; then
        echo "   Remote: $REMOTE_URL"
        
        # Extrair owner/repo do GitHub
        if [[ $REMOTE_URL == *"github.com"* ]]; then
            REPO_PATH=$(echo $REMOTE_URL | sed -E 's/.*github\.com[:/]([^/]+)\/([^/.]+).*/\1\/\2/')
            echo "   GitHub: https://github.com/$REPO_PATH"
        fi
    else
        echo "   ⚠️  Nenhum remote configurado"
    fi
else
    echo "   ⚠️  Não é um repositório Git"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Sugestões
echo "💡 PRÓXIMOS PASSOS:"
echo ""
echo "1️⃣  Acesse: https://vercel.com/login"
echo ""
echo "2️⃣  Procure pelo projeto 'moncoy' ou 'moncoyfinance'"
echo ""
echo "3️⃣  Ou acesse seu domínio: https://moncoyfinance.com"
echo "    (O domínio vai te levar ao projeto na Vercel)"
echo ""
echo "4️⃣  No projeto, vá em: Settings > General"
echo "    Lá você verá a 'Vercel Organization'"
echo ""
echo "5️⃣  Para linkar localmente:"
echo "    vercel login"
echo "    vercel link"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentação completa: docs/FIND-VERCEL-ORG.md"
echo ""
