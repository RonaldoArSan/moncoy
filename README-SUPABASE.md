# Configuração do Supabase

## Passos para configurar o backend

### 1. Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha:
   - **Name**: moncoy-finance (ou nome de sua escolha)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: South America)
6. Clique em "Create new project"

### 2. Obter as chaves da API
Após o projeto ser criado:
1. Vá para **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (algo como: https://xxxxx.supabase.co)
   - **anon public** key
   - **service_role** key (mantenha secreta)

### 3. Configurar variáveis de ambiente
Edite o arquivo `.env.local` e substitua pelos seus valores:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# OpenAI Configuration (opcional - para recursos de IA)
OPENAI_API_KEY=sua_chave_openai_aqui

# NextAuth Configuration (se usar NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=um_secret_aleatorio_aqui

# Database URL (opcional - para migrações)
DATABASE_URL=postgresql://postgres:sua_senha@db.seu-projeto.supabase.co:5432/postgres
```

### 4. Executar o SQL Schema
1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a execução completar

### 5. Configurar autenticação
1. Vá para **Authentication** > **Settings**
2. Configure os provedores desejados (Email, Google, etc.)
3. Para email/senha, certifique-se que está habilitado
4. Configure as URLs de redirecionamento:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 6. Instalar dependências
Execute no terminal:
```bash
pnpm install @supabase/supabase-js
```

### 7. Testar a conexão
1. Execute o projeto: `pnpm dev`
2. Acesse `http://localhost:3000`
3. Tente fazer login/cadastro
4. Verifique se os dados aparecem no painel do Supabase

## Estrutura do Banco de Dados

### Tabelas principais:
- **users**: Dados dos usuários (estende auth.users)
- **categories**: Categorias personalizáveis por usuário
- **transactions**: Transações financeiras
- **goals**: Metas financeiras
- **investments**: Investimentos
- **investment_transactions**: Operações de compra/venda
- **bank_accounts**: Contas bancárias
- **ai_insights**: Insights gerados pela IA
- **user_settings**: Configurações do usuário

### Recursos implementados:
- ✅ Row Level Security (RLS)
- ✅ Triggers automáticos
- ✅ Categorias padrão para novos usuários
- ✅ Índices para performance
- ✅ View para dashboard analytics
- ✅ Tipos TypeScript gerados

## Próximos passos

1. **Configurar autenticação nas páginas**
2. **Implementar CRUD operations**
3. **Conectar componentes aos dados reais**
4. **Configurar upload de arquivos (Storage)**
5. **Implementar recursos de IA**

## Comandos úteis

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar testes
pnpm test
```

## Troubleshooting

### Erro de conexão
- Verifique se as variáveis de ambiente estão corretas
- Confirme se o projeto Supabase está ativo
- Teste a conexão no painel do Supabase

### Erro de RLS
- Certifique-se que o usuário está autenticado
- Verifique se as políticas RLS estão ativas
- Confirme se o user_id está sendo passado corretamente

### Erro de schema
- Execute novamente o SQL schema
- Verifique se todas as tabelas foram criadas
- Confirme se os triggers estão funcionando