# Guia Rápido de Configuração do Sistema Administrativo

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:
- Acesso ao banco de dados Supabase
- Variáveis de ambiente configuradas
- Permissões para executar migrações no banco

## 🚀 Configuração Inicial (3 Passos)

### Passo 1: Executar a Migração do Banco de Dados

Execute a migração SQL no seu banco de dados Supabase:

```sql
-- Copie e execute o conteúdo do arquivo:
-- supabase/migrations/20250114_create_admin_users.sql
```

Ou, se estiver usando Supabase CLI:

```bash
supabase db push
```

### Passo 2: Verificar Variáveis de Ambiente

Certifique-se de que estas variáveis estão configuradas no seu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NODE_ENV=development
```

⚠️ **Importante**: A `SUPABASE_SERVICE_ROLE_KEY` é necessária para as operações administrativas.

### Passo 3: Criar o Primeiro Administrador

Existem duas opções:

#### Opção A: Usar o Script CLI (Recomendado)

```bash
# Instale tsx se ainda não tiver
npm install -g tsx

# Execute o script de criação
npx tsx scripts/create-admin-user.ts
```

Siga as instruções interativas para criar seu primeiro super admin.

#### Opção B: Via SQL Direto

Execute no banco de dados:

```sql
-- Substitua os valores conforme necessário
INSERT INTO admin_users (
  email,
  name,
  password_hash,
  role,
  is_active
) VALUES (
  'admin@seuemail.com',
  'Seu Nome',
  -- Hash bcrypt da senha - use o script para gerar!
  '$2a$10$[seu_hash_bcrypt_aqui]',
  'super_admin',
  true
);
```

⚠️ **Atenção**: Opção B requer gerar o hash bcrypt manualmente. Use a Opção A para facilitar.

## ✅ Verificação da Instalação

1. **Acesse a página de login administrativo:**
   ```
   http://localhost:3000/admin/login
   ```

2. **Faça login** com as credenciais que você criou

3. **Acesse o gerenciamento de admins:**
   ```
   http://localhost:3000/admin/admin-users
   ```
   
   (Esta página só está disponível para super_admin)

## 🔐 Segurança

### Senha do Primeiro Administrador

- Use uma senha forte (12+ caracteres)
- Combine letras maiúsculas, minúsculas, números e símbolos
- Não reutilize senhas de outros sistemas
- Considere usar um gerenciador de senhas

### Após o Primeiro Login

1. Crie administradores adicionais conforme necessário
2. Remova ou desative administradores de teste
3. Configure autenticação de dois fatores (se disponível)
4. Revise os logs de acesso periodicamente

## 🛠️ Troubleshooting

### "Cannot find module '@/lib/admin-auth'"

Execute:
```bash
npm install bcryptjs @types/bcryptjs --legacy-peer-deps
```

### "SUPABASE_SERVICE_ROLE_KEY is not defined"

Certifique-se de que a variável de ambiente está definida corretamente no arquivo `.env.local`.

### "Table 'admin_users' does not exist"

Execute a migração do banco de dados (Passo 1).

### Erro ao criar primeiro administrador

Verifique:
1. A migração foi executada com sucesso
2. As variáveis de ambiente estão corretas
3. O banco de dados está acessível

## 📚 Próximos Passos

Após a configuração inicial:

1. Leia a documentação completa em `ADMIN_USER_SYSTEM.md`
2. Configure políticas de senha mais rigorosas (se necessário)
3. Implemente auditoria de logs (opcional)
4. Configure alertas para atividades suspeitas (opcional)

## 🆘 Suporte

Se encontrar problemas:

1. Consulte `ADMIN_USER_SYSTEM.md` para documentação detalhada
2. Verifique os logs do servidor para mensagens de erro
3. Confirme que todas as dependências estão instaladas

## 🔄 Migração do Sistema Antigo

Se você estava usando o sistema de `ADMIN_EMAILS`:

1. **Mantenha temporariamente** o sistema antigo funcionando
2. **Crie administradores** no novo sistema para cada email da lista
3. **Teste** o acesso com cada novo administrador
4. **Remova** o código antigo quando confirmar que tudo funciona

### Código a ser removido/modificado após migração:

Em `components/auth-provider.tsx`:
```typescript
// Pode remover ou comentar estas linhas após migração
const ADMIN_EMAILS = [
  'admin@financeira.com',
  'ronald@financeira.com',
  process.env.NEXT_PUBLIC_ADMIN_EMAIL
].filter(Boolean)
```

## ✨ Recursos Disponíveis

- ✅ Autenticação independente de administradores
- ✅ Gerenciamento de múltiplos administradores
- ✅ Dois níveis de permissão (admin e super_admin)
- ✅ Sessões seguras com expiração automática
- ✅ Proteção de rotas administrativas
- ✅ Auditoria básica (último login, criador)
- ✅ Ativação/desativação de contas
- ✅ Alteração de senhas

## 📝 Checklist Pós-Instalação

- [ ] Migração do banco executada
- [ ] Variáveis de ambiente configuradas
- [ ] Primeiro super admin criado
- [ ] Login administrativo testado
- [ ] Página de gerenciamento acessível
- [ ] Administradores adicionais criados (se necessário)
- [ ] Documentação revisada
- [ ] Senhas fortes configuradas
- [ ] Sistema antigo desativado (se aplicável)

---

**Pronto!** Seu sistema administrativo independente está configurado e pronto para uso. 🎉
