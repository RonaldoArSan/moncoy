# 🚨 SOLUÇÃO RÁPIDA - Aplicação Lenta / Erro 400

## Problema
A aplicação está demorando para carregar e apresentando erro 400 no login porque o hook `useAI` está tentando acessar a tabela `ai_usage` que ainda não existe no banco de dados.

## ✅ Solução Imediata (2 minutos)

### Opção 1: Aplicar Migração SQL (Recomendado)

1. **Acesse o SQL Editor do Supabase:**
   - Vá para: https://app.supabase.com/project/[seu-project-id]/sql/new

2. **Cole e Execute o SQL:**
   ```sql
   -- Copie TODO o conteúdo do arquivo:
   -- supabase/migrations/20251016_create_ai_usage_table.sql
   ```

3. **Verifique se foi criado:**
   ```sql
   SELECT * FROM ai_usage LIMIT 1;
   ```

4. **Reinicie a aplicação:**
   ```bash
   # Ctrl+C no terminal e depois:
   pnpm dev
   ```

### Opção 2: Usar CLI do Supabase

```bash
# 1. Instalar CLI (se não tiver)
npm install -g supabase

# 2. Linkar ao projeto
supabase link --project-ref <seu-project-id>

# 3. Aplicar migrações
supabase db push

# 4. Reiniciar app
pnpm dev
```

### Opção 3: Desabilitar Temporariamente

Se não puder aplicar a migração agora, comente o hook no código:

**Arquivo: `hooks/use-ai.ts`**
```typescript
// Load usage on mount (only if user is authenticated)
useEffect(() => {
  // TEMPORARIAMENTE DESABILITADO - Aplicar migração SQL primeiro
  // if (user?.id) {
  //   loadUsage()
  // } else {
  //   setUsageLoading(false)
  // }
  setUsageLoading(false) // Desabilitar temporariamente
}, [user?.id])
```

## 🔍 Verificando o Problema

### No Console do Navegador
Você verá:
```
Error loading AI usage: 400 Bad Request
```

### No Network Tab
Requisição falhando:
```
POST /api/ai/usage → 400
```

## ✨ Após Aplicar a Migração

1. A aplicação carregará normalmente
2. O contador de perguntas de IA funcionará
3. Dados sincronizarão entre dispositivos
4. Não haverá mais erro 400

## 📊 Verificar se Funcionou

Após aplicar a migração, teste:

```sql
-- No Supabase SQL Editor
SELECT 
  id, 
  user_id, 
  plan, 
  question_count, 
  last_reset_date 
FROM ai_usage;
```

Se retornar vazio = OK (tabela existe, só não tem dados ainda)
Se retornar erro = Migração não foi aplicada

## 🆘 Ainda com Problemas?

### Erro: "relation ai_usage does not exist"
- ✅ Significa que a migração SQL não foi executada
- 🔧 Solução: Execute o SQL manualmente no Supabase

### Erro: "authentication required"
- ✅ Problema diferente - verifique suas credenciais do Supabase
- 🔧 Verifique `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=sua-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key
  ```

### App ainda lento após migração?
- 🔧 Limpe o cache do navegador (Ctrl+Shift+Delete)
- 🔧 Reinicie o servidor (`pnpm dev`)
- 🔧 Verifique o Network tab por outras chamadas lentas

## 📝 Nota Importante

As mudanças no código JÁ incluem tratamento de erro para não quebrar a aplicação mesmo sem a migração, mas é **altamente recomendado** aplicar a migração para ter o sistema funcionando corretamente.

---

**Tempo estimado:** 2-5 minutos
**Prioridade:** 🔴 Alta (bloqueia uso da aplicação)
