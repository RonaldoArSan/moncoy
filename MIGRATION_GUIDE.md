# Guia de Migração - Funcionalidade de Compromissos

Este guia explica como aplicar as mudanças necessárias para adicionar a funcionalidade de compromissos à sua instância do Moncoy Finance.

## Alterações Implementadas

### 1. Banco de Dados
Foi criada uma nova tabela `commitments` para armazenar compromissos dos usuários.

**Arquivo de migração:** `supabase/migrations/20251016_create_commitments_table.sql`

### 2. Backend
- **Tipos TypeScript:** Adicionado tipo `Commitment` em `lib/supabase/types.ts`
- **API:** Adicionadas funções de CRUD em `lib/api.ts` no objeto `commitmentsApi`
- **Hook:** Criado hook `useCommitments()` em `hooks/use-commitments.ts`

### 3. Frontend
- **Página Agenda:** Atualizada `app/agenda/page.tsx` para integrar compromissos
  - Adicionado botão "Novo Evento" para criar compromissos
  - Modal para criar novos compromissos
  - Modal para visualizar compromissos de uma data específica ao clicar no calendário
  - Eventos de compromisso exibidos no calendário com cor azul

## Como Aplicar a Migração

### Opção 1: Via Supabase CLI (Recomendado)

Se você tem o Supabase CLI instalado:

```bash
# Navegue até o diretório do projeto
cd /path/to/moncoy

# Execute a migração
supabase db push
```

### Opção 2: Via Supabase Dashboard

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para "SQL Editor"
4. Cole o conteúdo do arquivo `supabase/migrations/20251016_create_commitments_table.sql`
5. Execute o SQL

### Opção 3: Via SQL direto

Execute o seguinte SQL no seu banco de dados Supabase:

```sql
-- Create commitments table
CREATE TABLE IF NOT EXISTS commitments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  reminder_enabled BOOLEAN DEFAULT FALSE,
  reminder_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow users to access their own commitments" 
  ON commitments FOR ALL 
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_commitments_user_id ON commitments(user_id);
CREATE INDEX IF NOT EXISTS idx_commitments_date ON commitments(date);
CREATE INDEX IF NOT EXISTS idx_commitments_status ON commitments(status);
```

## Estrutura da Tabela Commitments

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único do compromisso |
| user_id | UUID | ID do usuário (referência para users.id) |
| title | VARCHAR(255) | Título do compromisso (obrigatório) |
| description | TEXT | Descrição detalhada (opcional) |
| date | DATE | Data do compromisso (obrigatório) |
| time | TIME | Horário do compromisso (opcional) |
| location | VARCHAR(255) | Local do compromisso (opcional) |
| status | VARCHAR(50) | Status: 'pending', 'completed', 'cancelled' |
| reminder_enabled | BOOLEAN | Se o lembrete está ativado |
| reminder_minutes | INTEGER | Minutos antes para lembrar (padrão: 15) |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data da última atualização |

## Funcionalidades Disponíveis

### Criar Compromisso
- Clique no botão "Novo Evento" no topo da página de agenda
- Preencha o formulário com título, descrição, data, horário e local
- Clique em "Criar Compromisso"

### Visualizar Compromissos
- Clique em qualquer data no calendário
- Um modal será aberto mostrando todos os compromissos daquele dia
- Compromissos aparecem no calendário com cor azul clara

### Editar Status
- No modal de visualização, clique em "Marcar como Concluído" ou "Marcar como Pendente"
- O status do compromisso será atualizado

### Excluir Compromisso
- No modal de visualização, clique em "Excluir"
- Confirme a exclusão

## Políticas de Segurança (RLS)

A tabela possui Row Level Security (RLS) ativado, garantindo que:
- Cada usuário só pode ver seus próprios compromissos
- Cada usuário só pode criar, editar e excluir seus próprios compromissos
- As operações são validadas usando `auth.uid()`

## Rollback

Para reverter a migração, execute:

```sql
DROP TABLE IF EXISTS commitments CASCADE;
```

**Atenção:** Isso irá deletar todos os dados de compromissos permanentemente.

## Verificação

Após aplicar a migração, verifique se:

1. A tabela `commitments` foi criada:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'commitments';
   ```

2. As políticas RLS estão ativas:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'commitments';
   ```

3. Os índices foram criados:
   ```sql
   SELECT * FROM pg_indexes WHERE tablename = 'commitments';
   ```

## Suporte

Se encontrar problemas durante a migração, verifique:
- Se o usuário do banco tem permissões adequadas
- Se a tabela `users` existe (é uma dependência)
- Os logs do Supabase para mensagens de erro detalhadas
