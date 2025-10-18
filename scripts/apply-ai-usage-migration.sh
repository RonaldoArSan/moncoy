#!/bin/bash

# Script para aplicar a migração da tabela ai_usage no Supabase
# Execute: bash scripts/apply-ai-usage-migration.sh

echo "🚀 Aplicando migração da tabela ai_usage..."
echo ""

# Verificar se a CLI do Supabase está instalada
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI não encontrada!"
    echo "📦 Instale com: npm install -g supabase"
    exit 1
fi

# Verificar se o projeto está linkado
if [ ! -f "supabase/.temp/project-ref" ] && [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Projeto não está linkado ao Supabase"
    echo "🔗 Execute primeiro: supabase link --project-ref <seu-project-id>"
    echo ""
    echo "Para encontrar seu project-id:"
    echo "1. Acesse https://app.supabase.com/projects"
    echo "2. Clique no seu projeto"
    echo "3. Settings > General > Reference ID"
    exit 1
fi

echo "📋 Arquivo de migração: supabase/migrations/20251016_create_ai_usage_table.sql"
echo ""

# Opção 1: Push all migrations
read -p "Deseja aplicar TODAS as migrações pendentes? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]
then
    echo "⏳ Aplicando todas as migrações..."
    supabase db push
    echo "✅ Migrações aplicadas!"
else
    echo ""
    echo "📝 Para aplicar manualmente via SQL Editor:"
    echo "1. Acesse: https://app.supabase.com/project/_/sql/new"
    echo "2. Cole o conteúdo de: supabase/migrations/20251016_create_ai_usage_table.sql"
    echo "3. Execute a query"
    echo ""
    echo "Ou execute: supabase db push"
fi

echo ""
echo "🔍 Para verificar se a tabela foi criada:"
echo "   SELECT * FROM ai_usage LIMIT 1;"
echo ""
echo "✨ Pronto! Reinicie a aplicação após aplicar a migração."
