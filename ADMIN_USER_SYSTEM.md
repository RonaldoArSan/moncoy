# Sistema de Usuário Administrativo Independente

Este documento descreve o sistema de autenticação administrativo independente implementado no Moncoy Finance.

## Visão Geral

O sistema de usuário administrativo foi criado para separar completamente a autenticação de administradores da autenticação de usuários regulares da aplicação. Isso proporciona:

- **Segurança aprimorada**: Administradores não dependem do sistema de autenticação Supabase dos usuários regulares
- **Controle granular**: Administradores podem ser gerenciados independentemente
- **Separação de responsabilidades**: O sistema administrativo é completamente isolado do sistema de usuários

## Arquitetura

### Banco de Dados

Duas novas tabelas foram criadas:

1. **admin_users**: Armazena informações dos administradores
   - `id`: UUID único
   - `email`: Email único do administrador
   - `password_hash`: Hash da senha (bcrypt)
   - `name`: Nome completo
   - `role`: Função (admin ou super_admin)
   - `is_active`: Status ativo/inativo
   - `last_login`: Data do último login
   - `created_at`, `updated_at`: Timestamps
   - `created_by`: Referência ao admin que criou este usuário

2. **admin_sessions**: Gerencia sessões de administradores
   - `id`: UUID único
   - `admin_user_id`: Referência ao admin_user
   - `token`: Token de sessão único
   - `expires_at`: Data de expiração (8 horas)
   - `ip_address`: IP do cliente
   - `user_agent`: User agent do navegador

### Autenticação

A autenticação administrativa usa:
- **Bcrypt** para hash de senhas
- **Tokens de sessão** armazenados em cookies HTTP-only
- **Validação de sessão** em cada requisição protegida
- **Expiração automática** de sessões antigas

### API Endpoints

#### Autenticação
- `POST /api/admin/auth/login` - Login de administrador
- `GET /api/admin/auth/verify` - Verificar sessão atual
- `POST /api/admin/auth/logout` - Logout

#### Gerenciamento de Usuários (apenas super_admin)
- `GET /api/admin/users/list` - Listar todos os administradores
- `POST /api/admin/users/create` - Criar novo administrador
- `POST /api/admin/users/update-password` - Atualizar senha de administrador
- `POST /api/admin/users/toggle-status` - Ativar/desativar administrador
- `POST /api/admin/users/delete` - Excluir administrador

## Funções (Roles)

### Admin
- Acesso ao painel administrativo
- Gerenciamento de usuários regulares da aplicação
- Visualização de relatórios e estatísticas

### Super Admin
- Todas as permissões de Admin
- Gerenciamento de outros administradores
- Criação de novos administradores
- Alteração de senhas de administradores
- Ativação/desativação de contas administrativas

## Como Usar

### Primeiro Acesso

1. Execute a migração do banco de dados:
   ```sql
   -- Execute o arquivo: supabase/migrations/20250114_create_admin_users.sql
   ```

2. Crie o primeiro administrador usando o script:
   ```bash
   npx tsx scripts/create-admin-user.ts
   ```

3. Acesse o painel administrativo em `/admin/login`

### Gerenciamento de Administradores

Como Super Admin, você pode gerenciar outros administradores em:
`/admin/admin-users`

Funcionalidades disponíveis:
- Criar novos administradores
- Alterar senhas
- Ativar/desativar contas
- Excluir administradores (exceto sua própria conta)

### Middleware de Proteção

O middleware em `middleware.ts` protege automaticamente todas as rotas `/admin/*` (exceto `/admin/login`):
- Redireciona para login se não houver sessão válida
- Valida token de sessão em cada requisição

## Segurança

### Boas Práticas Implementadas

1. **Senhas Seguras**
   - Hash bcrypt com salt de 10 rounds
   - Nunca armazenadas em texto plano
   - Validação no lado do servidor

2. **Sessões Seguras**
   - Tokens aleatórios de 64 bytes
   - Armazenados em cookies HTTP-only
   - Expiração automática após 8 horas
   - Limpeza automática de sessões expiradas

3. **Controle de Acesso**
   - Verificação de função em cada endpoint
   - Proteção contra auto-desativação/exclusão
   - RLS (Row Level Security) no banco de dados

4. **Auditoria**
   - Registro de último login
   - Rastreamento de criador de cada admin
   - Armazenamento de IP e user agent nas sessões

### Recomendações de Segurança

1. **Senhas Fortes**
   - Mínimo 12 caracteres
   - Combinação de letras, números e símbolos
   - Alteração periódica

2. **Ambiente de Produção**
   - Use HTTPS sempre
   - Configure variáveis de ambiente adequadamente
   - Habilite `secure` nos cookies em produção

3. **Monitoramento**
   - Revise logs de login regularmente
   - Monitore sessões ativas
   - Desative contas não utilizadas

## Variáveis de Ambiente Necessárias

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production|development
```

## Migração do Sistema Antigo

O sistema antigo usava uma lista hardcoded de emails administrativos (`ADMIN_EMAILS`). Para migrar:

1. Crie administradores no novo sistema para cada email da lista antiga
2. Teste o acesso com cada novo administrador
3. Remova ou comente a verificação de `ADMIN_EMAILS` quando confirmar que o novo sistema está funcionando

## Troubleshooting

### Erro: "Session expired"
- Faça login novamente
- As sessões expiram após 8 horas de inatividade

### Erro: "Unauthorized - Super admin only"
- Esta ação requer permissões de Super Admin
- Contate um Super Admin para obter as permissões necessárias

### Esqueci a senha do administrador
- Um Super Admin pode alterar a senha através do painel `/admin/admin-users`
- Se não houver Super Admins disponíveis, será necessário acesso direto ao banco de dados

### Não consigo criar o primeiro administrador
- Verifique se a migração do banco de dados foi executada
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Execute o script `create-admin-user.ts` com privilégios adequados

## Estrutura de Arquivos

```
lib/
  admin-auth.ts           # Funções de autenticação administrativa
  supabase-admin.ts       # Cliente Supabase com service role

app/
  api/admin/
    auth/
      login/route.ts      # Endpoint de login
      logout/route.ts     # Endpoint de logout
      verify/route.ts     # Verificação de sessão
    users/
      list/route.ts       # Listar administradores
      create/route.ts     # Criar administrador
      update-password/route.ts  # Atualizar senha
      toggle-status/route.ts    # Ativar/desativar
      delete/route.ts     # Excluir administrador

  admin/
    login/page.tsx        # Página de login administrativo
    admin-users/page.tsx  # Gerenciamento de administradores

hooks/
  use-admin-auth.ts       # Hook React para autenticação administrativa

scripts/
  create-admin-user.ts    # Script CLI para criar administradores

supabase/
  migrations/
    20250114_create_admin_users.sql  # Migração do banco de dados

middleware.ts             # Proteção de rotas administrativas
```

## Suporte

Para questões ou problemas com o sistema administrativo:
1. Verifique este documento primeiro
2. Revise os logs do servidor para erros
3. Consulte a documentação do Supabase para questões relacionadas ao banco de dados
