# Como Importar Dados CSV no Supabase

## IMPORTANTE: Problema com auth.users

⚠️ **A tabela `auth.users` é gerenciada pelo Supabase e não pode ser importada diretamente via CSV.**

### Solução: Criar usuários via SQL

Antes de importar os CSVs, execute este SQL no **SQL Editor**:

```sql
-- Criar usuários de teste via auth.users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'basico@teste.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', '2024-12-20 10:00:00+00', '2024-12-20 10:00:00+00', '2024-12-20 10:00:00+00', '{"name": "Usuário Básico"}'),
  ('550e8400-e29b-41d4-a716-446655440002', 'pro.novo@teste.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', '2024-12-15 10:00:00+00', '2024-12-15 10:00:00+00', '2024-12-15 10:00:00+00', '{"name": "Pro Novo"}'),
  ('550e8400-e29b-41d4-a716-446655440003', 'pro.veterano@teste.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456789', '2024-11-25 10:00:00+00', '2024-11-25 10:00:00+00', '2024-11-25 10:00:00+00', '{"name": "Pro Veterano"}');
```

## Ordem de Importação CSV

Após criar os usuários via SQL, importe os CSVs nesta ordem:

### 1. public.users (Dados dos Usuários)
- Arquivo: `users.csv`
- Tabela: `public.users`

### 3. public.user_settings (Configurações)
- Arquivo: `user_settings.csv`
- Tabela: `public.user_settings`

### 4. public.categories (Categorias)
- Arquivo: `categories.csv`
- Tabela: `public.categories`

### 5. public.transactions (Transações)
- Arquivo: `transactions.csv`
- Tabela: `public.transactions`

### 6. public.goals (Metas)
- Arquivo: `goals.csv`
- Tabela: `public.goals`

### 7. public.investments (Investimentos)
- Arquivo: `investments.csv`
- Tabela: `public.investments`

## Como Importar no Supabase

### Método 1: Via Interface Web
1. Acesse seu projeto no Supabase
2. Vá para **Table Editor**
3. Selecione a tabela desejada
4. Clique em **Insert** > **Import data from CSV**
5. Faça upload do arquivo CSV correspondente
6. Mapeie as colunas corretamente
7. Clique em **Import**

### Método 2: Via SQL Editor
⚠️ **Não funciona no Supabase hospedado** - use apenas a interface web.

```sql
-- Exemplo (só funciona em instalações locais)
COPY public.users(id, name, email, plan, registration_date, created_at, updated_at)
FROM '/path/to/users.csv'
DELIMITER ','
CSV HEADER;
```

## Usuários de Teste Criados

| Email | Senha | Plano | Dias desde cadastro | Status IA |
|-------|-------|-------|-------------------|-----------|
| `basico@teste.com` | `123456` | Básico | 5 dias | ❌ Bloqueada |
| `pro.novo@teste.com` | `123456` | Profissional | 10 dias | ⏳ Carência |
| `pro.veterano@teste.com` | `123456` | Profissional | 30 dias | ✅ Liberada |

## Dados de Exemplo Incluídos

### Pro Veterano (`pro.veterano@teste.com`)
- **Transações**: 5 transações (salário, supermercado, combustível, etc.)
- **Meta**: Reserva de emergência (R$ 15.000 / R$ 50.000)
- **Investimento**: PETR4 - 100 ações
- **Categorias**: Completas para todos os tipos

### Outros Usuários
- **Básico** e **Pro Novo**: Apenas dados básicos (sem transações)

## Troubleshooting

### Erro de UUID
Se houver erro de UUID, certifique-se que:
- Os IDs estão no formato correto
- As referências entre tabelas estão corretas

### Erro de Data
- Use formato ISO: `2024-12-25 10:00:00+00`
- Inclua timezone (`+00` para UTC)

### Erro de Enum
- Valores devem corresponder exatamente aos definidos no schema
- `plan`: `basic` ou `professional`
- `type`: `income`, `expense`, `goal`, `investment`

### Erro de Referência
- Importe na ordem correta
- Verifique se os `user_id` e `category_id` existem

## Verificar Importação

Execute no SQL Editor:
```sql
-- Verificar usuários
SELECT name, email, plan, 
       EXTRACT(DAY FROM (NOW() - registration_date)) as days_since_registration
FROM public.users;

-- Verificar dados do usuário veterano
SELECT 
  (SELECT COUNT(*) FROM public.transactions WHERE user_id = '550e8400-e29b-41d4-a716-446655440003') as transactions,
  (SELECT COUNT(*) FROM public.goals WHERE user_id = '550e8400-e29b-41d4-a716-446655440003') as goals,
  (SELECT COUNT(*) FROM public.investments WHERE user_id = '550e8400-e29b-41d4-a716-446655440003') as investments;
```