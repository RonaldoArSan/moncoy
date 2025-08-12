# Usuários de Teste

## Como criar os usuários de teste

### 1. Execute o schema principal
Primeiro, execute o arquivo `supabase-schema.sql` no SQL Editor do Supabase.

### 2. Execute o script de usuários de teste
Depois, execute o arquivo `test-users.sql` no SQL Editor do Supabase.

### 3. Usuários criados

| Email | Senha | Plano | Dias desde cadastro | Status da IA |
|-------|-------|-------|-------------------|--------------|
| `basico@teste.com` | `123456` | Básico | 5 dias | ❌ Bloqueada |
| `pro.novo@teste.com` | `123456` | Profissional | 10 dias | ⏳ Em carência (faltam 12 dias) |
| `pro.veterano@teste.com` | `123456` | Profissional | 30 dias | ✅ Liberada |

## Como usar

### Opção 1: Login manual
1. Vá para `/login`
2. Digite o email e senha
3. Clique em "Entrar"

### Opção 2: Login rápido (recomendado)
1. Vá para `/login`
2. Clique em "Mostrar Usuários de Teste"
3. Clique no botão do usuário desejado

## Dados de exemplo

O usuário **Pro Veterano** (`pro.veterano@teste.com`) vem com dados de exemplo:

### Transações
- Salário Janeiro: +R$ 8.500,00
- Supermercado: -R$ 320,50
- Combustível: -R$ 180,00
- Restaurante: -R$ 85,30
- Uber: -R$ 25,50

### Metas
- Reserva de Emergência: R$ 15.000 / R$ 50.000 (30%)

### Investimentos
- PETR4: 100 ações a R$ 28,50 (atual R$ 32,10)

## Testando funcionalidades por usuário

### Usuário Básico
- ✅ Dashboard básico
- ✅ Transações
- ✅ Metas
- ✅ Investimentos
- ❌ IA bloqueada
- ❌ Upload de comprovantes

### Pro Novo (< 22 dias)
- ✅ Dashboard completo
- ✅ Todas as funcionalidades básicas
- ⏳ IA em período de carência
- ⏳ Upload bloqueado temporariamente

### Pro Veterano (> 22 dias)
- ✅ Todas as funcionalidades
- ✅ IA completamente liberada
- ✅ Upload de comprovantes
- ✅ Conselhos personalizados

## Comandos SQL úteis

### Verificar usuários criados
```sql
SELECT 
    u.name,
    u.email,
    u.plan,
    u.registration_date,
    EXTRACT(DAY FROM (NOW() - u.registration_date)) as days_since_registration
FROM public.users u
WHERE u.email LIKE '%@teste.com'
ORDER BY u.registration_date;
```

### Alterar plano de um usuário
```sql
UPDATE public.users 
SET plan = 'professional' 
WHERE email = 'basico@teste.com';
```

### Alterar data de cadastro (para testar período de carência)
```sql
UPDATE public.users 
SET registration_date = NOW() - INTERVAL '25 days'
WHERE email = 'pro.novo@teste.com';
```

### Limpar dados de teste
```sql
DELETE FROM public.users WHERE email LIKE '%@teste.com';
DELETE FROM auth.users WHERE email LIKE '%@teste.com';
```

## Troubleshooting

### Erro "Usuário não encontrado"
- Verifique se executou o `test-users.sql`
- Confirme se os usuários aparecem na tabela `auth.users`

### Erro de autenticação
- Verifique se a autenticação por email/senha está habilitada no Supabase
- Confirme se as políticas RLS estão ativas

### Dados não aparecem
- Verifique se as políticas RLS permitem acesso aos dados
- Confirme se o `user_id` está sendo passado corretamente