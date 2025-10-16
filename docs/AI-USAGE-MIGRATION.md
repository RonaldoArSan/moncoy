# AI Usage Tracking - Migration to Server-Side

## 🎯 Overview

Migração completa do sistema de rastreamento de uso de IA de `localStorage` (client-side) para banco de dados Supabase (server-side).

## ✨ O que mudou

### Antes (localStorage)
- ❌ Dados armazenados no navegador
- ❌ Facilmente burlável
- ❌ Não sincroniza entre dispositivos
- ❌ Sem analytics para admins

### Depois (Database)
- ✅ Dados persistidos no Supabase
- ✅ Validação server-side robusta
- ✅ Sincronização cross-device
- ✅ Analytics prontos para admins
- ✅ RLS policies para segurança

## 📁 Arquivos Criados

### 1. Migração SQL
**Arquivo:** `supabase/migrations/20251016_create_ai_usage_table.sql`

Cria:
- Tabela `ai_usage` com todos os campos necessários
- Índices para performance
- RLS policies (usuários veem só seus dados, admins veem tudo)
- Função `check_and_reset_ai_usage()` para reset automático
- Trigger para atualizar `updated_at`

### 2. API Routes
**Arquivo:** `app/api/ai/usage/route.ts`

Endpoints:
- `GET /api/ai/usage` - Verifica limite atual e reseta se necessário
- `POST /api/ai/usage` - Incrementa contador após pergunta bem-sucedida

### 3. Tipos TypeScript
**Arquivo:** `lib/supabase/types.ts`

Adiciona:
```typescript
export interface AIUsageRecord {
  id: string
  user_id: string
  plan: 'basic' | 'professional' | 'premium'
  question_count: number
  last_reset_date: string
  last_question_date?: string | null
  created_at: string
  updated_at: string
}
```

### 4. Biblioteca de Limites
**Arquivo:** `lib/ai-limits.ts`

Funções atualizadas:
- `checkAILimit()` - Agora chama API server-side
- `incrementAIUsage()` - Agora chama API server-side
- Funções antigas marcadas como `@deprecated`

### 5. Hook Atualizado
**Arquivo:** `hooks/use-ai.ts`

Mudanças:
- Carrega limites automaticamente no mount
- Verifica limites antes de cada chamada
- Incrementa contador após sucesso
- Mostra toast se perto do limite
- Estado `usage` com todos os dados necessários

### 6. Utilitário de Migração
**Arquivo:** `lib/ai-usage-migration.ts`

Funções:
- `migrateAIUsageToDatabase()` - Migra dados do localStorage para DB
- `autoMigrateAIUsage()` - Auto-migra quando usuário faz login

## 🚀 Como Usar

### Para Desenvolvedores

#### 1. Aplicar Migração SQL
```bash
# Conecte ao seu projeto Supabase
supabase link --project-ref <seu-project-id>

# Execute a migração
supabase db push
```

#### 2. Verificar Tabela
```sql
-- No Supabase SQL Editor
SELECT * FROM ai_usage LIMIT 10;
```

#### 3. Usar no Código
```typescript
import { useAI } from '@/hooks/use-ai'

function MyComponent() {
  const { usage, loading, analyzeTransactions } = useAI()
  
  // Mostrar uso atual
  if (usage) {
    console.log(`${usage.remaining}/${usage.limit} perguntas restantes`)
  }
  
  // Fazer pergunta
  const handleAsk = async () => {
    try {
      const result = await analyzeTransactions(transactions, 'monthly')
      console.log(result)
    } catch (error) {
      // Erro se limite atingido
      toast.error(error.message)
    }
  }
}
```

### Para Admins

#### Ver Uso de Todos os Usuários
```sql
SELECT 
  u.email,
  u.plan,
  ai.question_count,
  ai.last_reset_date,
  ai.last_question_date
FROM ai_usage ai
JOIN users u ON u.id = ai.user_id
ORDER BY ai.question_count DESC;
```

#### Usuários que Atingiram o Limite
```sql
SELECT 
  u.email,
  u.plan,
  ai.question_count,
  CASE 
    WHEN u.plan IN ('basic', 'professional') THEN 7
    WHEN u.plan = 'premium' THEN 50
  END as limit
FROM ai_usage ai
JOIN users u ON u.id = ai.user_id
WHERE 
  (u.plan IN ('basic', 'professional') AND ai.question_count >= 7)
  OR (u.plan = 'premium' AND ai.question_count >= 50);
```

#### Reset Manual (se necessário)
```sql
UPDATE ai_usage
SET 
  question_count = 0,
  last_reset_date = NOW()
WHERE user_id = '<user-id>';
```

## 🔄 Migração de Dados Existentes

### Automática
A migração é automática quando o usuário:
1. Faz login após o deploy
2. Usa qualquer recurso de IA

O código verifica se há dados no localStorage e os migra automaticamente.

### Manual (se necessário)
```typescript
import { migrateAIUsageToDatabase } from '@/lib/ai-usage-migration'

// Em um script ou console
const result = await migrateAIUsageToDatabase(userId, userPlan)
console.log(result.message)
```

## 📊 Limites por Plano

| Plano | Limite | Período de Reset | Período de Espera |
|-------|--------|------------------|-------------------|
| Basic | 5 perguntas | 7 dias (semanal) | 22 dias após cadastro |
| Professional | 7 perguntas | 7 dias (semanal) | Sem espera |
| Premium | 50 perguntas | 30 dias (mensal) | Sem espera |

## 🔒 Segurança

### RLS Policies
- Usuários só veem seus próprios dados
- Admins (emails hardcoded) veem todos os dados
- Insert/Update só pelo próprio usuário
- Delete não permitido (usar soft delete se necessário)

### Validação Server-Side
- Todas as verificações ocorrem no servidor
- Impossível burlar via devtools
- Transações atômicas para evitar race conditions

## 🧪 Testes

### Testar Limite Básico
```typescript
// No console do navegador
const { useAI } = require('@/hooks/use-ai')
const { usage } = useAI()

// Fazer 5 perguntas (limite do basic)
for (let i = 0; i < 5; i++) {
  await analyzeTransactions([], 'test')
}

// Tentar 6ª pergunta - deve falhar
await analyzeTransactions([], 'test') // Error: Limite atingido
```

### Testar Reset
```sql
-- Forçar reset mudando data
UPDATE ai_usage
SET last_reset_date = NOW() - INTERVAL '8 days'
WHERE user_id = '<seu-user-id>';

-- Próxima chamada deve resetar o contador
```

## 📝 Notas Importantes

1. **Período de 22 dias** para plano básico continua sendo validado no código (não no banco)
2. **Funções antigas** em `lib/ai-limits.ts` estão marcadas como `@deprecated` mas mantidas para compatibilidade
3. **localStorage** é limpo automaticamente após migração bem-sucedida
4. **Erros de migração** não quebram o app - são apenas logados

## 🐛 Troubleshooting

### Contador não reseta
- Verificar se `last_reset_date` está correto
- Executar manualmente a função `check_and_reset_ai_usage()`

### Erro 401 (Não autenticado)
- Verificar se usuário está logado
- Verificar cookies do Supabase

### Erro 404 (Registro não encontrado)
- Registro será criado automaticamente no próximo uso
- Ou criar manualmente via API

## 🎉 Benefícios

1. **Segurança**: Impossível burlar limites
2. **UX**: Sincronização entre dispositivos
3. **Analytics**: Dados prontos para análise
4. **Escalabilidade**: Preparado para crescimento
5. **Manutenibilidade**: Código mais limpo e organizado

## 📚 Referências

- Migração SQL: `supabase/migrations/20251016_create_ai_usage_table.sql`
- Documentação: `.github/copilot-instructions.md`
- Exemplos: `hooks/use-ai.ts`
