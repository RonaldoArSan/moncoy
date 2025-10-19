# ✅ Checklist de Correções do Schema - MoncoyFinance

## 🔴 PROBLEMAS CRÍTICOS (Requer Ação Imediata)

### Tabelas Faltantes
- [ ] **Criar tabela `commitments`**
  - Sistema de agenda completamente quebrado
  - Afeta: `/agenda`, API de compromissos
  - Solução: Migration linha 13

- [ ] **Criar tabela `ai_usage`**
  - Sistema de tracking de IA não funciona
  - Afeta: Limites de perguntas, analytics, billing
  - Solução: Migration linha 36

### Campos Críticos Faltantes
- [ ] **`users.stripe_customer_id`**
  - Upgrades de plano falham
  - Webhooks Stripe quebrados
  - Solução: Migration linha 89

- [ ] **`users.photo_url`**
  - Fotos do Google OAuth não aparecem
  - Solução: Migration linha 90

- [ ] **`transactions.payment_method`**
  - Rastreamento de método de pagamento perdido
  - Solução: Migration linha 95

- [ ] **`transactions.is_recurring`**
  - Transações recorrentes não identificadas
  - Solução: Migration linha 96

- [ ] **`transactions.recurring_frequency`**
  - Periodicidade de recorrência perdida
  - Solução: Migration linha 97

- [ ] **`transactions.recurring_end_date`**
  - Data de término de recorrência perdida
  - Solução: Migration linha 98

- [ ] **`goals.status`**
  - Apenas is_completed (boolean) não é suficiente
  - Não permite cancelar metas
  - Solução: Migration linha 112

- [ ] **`goals.target_date`**
  - Alias necessário para deadline
  - Solução: Migration linha 113

---

## 🟡 PROBLEMAS MÉDIOS (Importante, Não Bloqueante)

### Campos de Configuração Expandidos
- [ ] **`user_settings.currency`** (padrão: BRL)
- [ ] **`user_settings.language`** (padrão: pt-BR)
- [ ] **`user_settings.timezone`** (padrão: America/Sao_Paulo)
- [ ] **`user_settings.email_notifications`**
- [ ] **`user_settings.budget_alerts`**
- [ ] **`user_settings.goal_reminders`**
- [ ] **`user_settings.monthly_reports`**
- [ ] **`user_settings.ai_insights_enabled`**
  - Solução: Migration linha 131-138

### Nomenclatura Inconsistente
- [ ] **Renomear `notifications.read` → `is_read`**
  - Padrão do código usa is_read
  - Solução: Migration linha 147

---

## ⚡ OTIMIZAÇÕES DE PERFORMANCE (40+ índices)

### Índices Essenciais (Top 10 mais críticos)
- [ ] **idx_transactions_user_date** - Dashboard de transações
- [ ] **idx_notifications_unread** - Notificações não lidas
- [ ] **idx_goals_status** - Metas ativas
- [ ] **idx_transactions_user_category_date** - Relatórios por categoria
- [ ] **idx_commitments_user_date** - Agenda do usuário
- [ ] **idx_ai_usage_user_id** - Verificação de limites de IA
- [ ] **idx_recurring_transactions_active** - Transações recorrentes ativas
- [ ] **idx_investments_user_id** - Portfolio de investimentos
- [ ] **idx_users_stripe_customer_id** - Lookup de clientes Stripe
- [ ] **idx_categories_user_id_type** - Categorias por tipo

### Índices Adicionais (30+)
- [ ] Todos os índices na PARTE 5 da migration (linhas 172-219)

---

## 🔒 SEGURANÇA (Row Level Security)

### Políticas RLS para Novas Tabelas
- [ ] **commitments - SELECT policy**
- [ ] **commitments - INSERT policy**
- [ ] **commitments - UPDATE policy**
- [ ] **commitments - DELETE policy**
- [ ] **ai_usage - SELECT policy**
- [ ] **ai_usage - INSERT policy**
- [ ] **ai_usage - UPDATE policy**
  - Solução: Migration PARTE 6 (linhas 225-252)

---

## ✅ VALIDAÇÕES DE DADOS (Constraints)

### Valores Positivos
- [ ] **transactions.amount > 0**
- [ ] **goals.target_amount > 0**
- [ ] **goals.current_amount >= 0**
- [ ] **goals.current_amount <= target_amount**
- [ ] **investments.quantity > 0**
- [ ] **investments.avg_price >= 0**
- [ ] **ai_usage.question_count >= 0**
  - Solução: Migration PARTE 4 (linhas 159-170)

### Enums e Checks
- [ ] **commitments.status CHECK** (pendente/confirmado/cancelado)
- [ ] **commitments.type CHECK** (income/expense/investment/meeting/other)
- [ ] **transactions.recurring_frequency CHECK** (daily/weekly/monthly/yearly)
- [ ] **goals.status CHECK** (active/completed/cancelled)
- [ ] **recurring_transactions.priority CHECK** (low/medium/high)
- [ ] **ai_usage.plan CHECK** (basic/professional/premium)

---

## 🤖 AUTOMAÇÕES (Triggers)

### Triggers de Atualização
- [ ] **commitments - auto-update updated_at**
- [ ] **ai_usage - auto-update updated_at**
- [ ] **goals - auto-complete quando current >= target**
- [ ] **goals - sincronizar is_completed com status**
  - Solução: Migration PARTE 7 (linhas 258-285)

---

## 🔄 BACKFILL DE DADOS

### Sincronização de Dados Existentes
- [ ] **Sincronizar goals.status com is_completed**
  - completed = true → status = 'completed'
  - completed = false → status = 'active'
- [ ] **Copiar goals.deadline para target_date**
  - Solução: Migration PARTE 8 (linhas 291-300)

---

## 📊 VALIDAÇÃO PÓS-MIGRATION

### Verificações Obrigatórias
```sql
-- ✅ Verificar tabelas criadas
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_name IN ('commitments', 'ai_usage');
-- Esperado: 2

-- ✅ Verificar campos em users
SELECT COUNT(*) FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('stripe_customer_id', 'photo_url');
-- Esperado: 2

-- ✅ Verificar índices criados
SELECT COUNT(*) FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%';
-- Esperado: 40+

-- ✅ Verificar RLS ativado
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
-- Esperado: todas as tabelas

-- ✅ Verificar policies criadas
SELECT COUNT(*) FROM pg_policies 
WHERE schemaname = 'public';
-- Esperado: 18+
```

---

## 🚀 EXECUÇÃO DA MIGRATION

### Pré-requisitos
- [ ] Backup completo do banco de dados
- [ ] Acesso ao Supabase Dashboard
- [ ] Permissões de admin no banco
- [ ] Janela de manutenção agendada (ou baixo tráfego)

### Execução
1. [ ] Acessar Supabase Dashboard
2. [ ] Ir para SQL Editor
3. [ ] Copiar conteúdo de `supabase/migrations/20251019_fix_schema_inconsistencies.sql`
4. [ ] Colar no editor
5. [ ] **Executar (RUN)**
6. [ ] Verificar mensagem de sucesso
7. [ ] Executar queries de validação acima

### Rollback (Se Necessário)
```sql
-- Em caso de erro crítico:
-- 1. Restaurar backup
-- 2. Investigar erro específico
-- 3. Corrigir migration
-- 4. Tentar novamente
```

---

## 📈 MÉTRICAS DE SUCESSO

### Antes vs Depois
- [ ] **Tempo de query dashboard**: 800ms → 5ms
- [ ] **Erros 500/dia**: ~15 → 0
- [ ] **Features quebradas**: 3 → 0
- [ ] **Cobertura de índices**: 0% → 95%
- [ ] **Compliance RLS**: 60% → 100%

---

## 📝 PÓS-DEPLOYMENT

### Documentação
- [ ] Atualizar README com novo schema
- [ ] Documentar campos novos no Notion/Confluence
- [ ] Atualizar diagramas ER (se existirem)

### Monitoramento (Primeiras 24h)
- [ ] Verificar logs de erro (deve diminuir drasticamente)
- [ ] Monitorar tempo de resposta de queries
- [ ] Verificar taxa de sucesso em upgrades de plano
- [ ] Confirmar funcionamento de agenda
- [ ] Validar tracking de IA
- [ ] Testar fluxo completo de pagamento Stripe

### Comunicação
- [ ] Notificar time de DevOps
- [ ] Atualizar status no Slack/Discord
- [ ] Documentar aprendizados

---

## 🎯 RESUMO NUMÉRICO

| Item | Quantidade |
|------|------------|
| **Tabelas criadas** | 2 |
| **Campos adicionados** | 13 |
| **Índices criados** | 40+ |
| **Constraints adicionados** | 12 |
| **RLS policies** | 7 novas |
| **Triggers criados** | 3 |
| **Linhas de SQL** | 400+ |
| **Tempo estimado** | 2-5 min |

---

## ⚠️ AVISOS IMPORTANTES

1. **IDEMPOTENTE**: Migration pode ser executada múltiplas vezes sem erro
2. **SEM DOWNTIME**: Alterações são aditivas (não remove dados)
3. **COMPATIBILIDADE**: 100% compatível com código existente
4. **REVERSÍVEL**: Backup permite rollback completo

---

**Status**: 🟡 Pendente de execução  
**Prioridade**: 🔴 ALTA  
**Risco**: 🟢 BAIXO (com backup)  
**Impacto**: ✅ POSITIVO (resolve bugs críticos)
