# Sistema de Administração - Guia de Configuração

Este documento explica como configurar o sistema de administração independente da aplicação.

## 🔐 Visão Geral

O sistema foi redesenhado para usar um sistema robusto baseado em roles no banco de dados, eliminando a dependência de hardcoded emails para determinar permissões administrativas.

### Principais Mudanças:

1. **Sistema de Roles**: Usuários agora têm roles (`user`, `admin`, `super_admin`) armazenadas no banco
2. **Middleware de Segurança**: Proteção automática de rotas admin
3. **Auditoria**: Log de todas as ações administrativas
4. **Usuário Admin Independente**: Admins podem ser criados independentemente da aplicação

## 📋 Pré-requisitos

1. ✅ Supabase configurado
2. ✅ Banco de dados com as migrações aplicadas
3. ✅ Variáveis de ambiente configuradas

## 🚀 Configuração Inicial

### Passo 1: Aplicar Migrações

Execute os seguintes arquivos SQL no Supabase SQL Editor na ordem:

1. `supabase/migrations/20241013_create_admin_system.sql`
2. `supabase/migrations/20241013_fix_user_settings_policies.sql`

### Passo 2: Criar o Primeiro Super Admin

#### Opção A: Pelo Supabase Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard**
   - Vá para: Authentication → Users
   - Clique em "Add user"

2. **Crie o usuário admin:**
   ```
   Email: admin@moncoy.com (ou seu email preferido)
   Password: [SENHA_MUITO_FORTE]
   ✅ Confirm email
   ✅ Auto confirm user
   ```

3. **Copie o UUID** do usuário criado (será algo como: `12345678-1234-1234-1234-123456789abc`)

4. **Execute no SQL Editor:**
   ```sql
   -- Substitua SEU_UUID_AQUI pelo UUID real
   INSERT INTO user_roles (user_id, role, granted_by) 
   VALUES ('SEU_UUID_AQUI', 'super_admin', 'SEU_UUID_AQUI');
   
   -- Verificar se foi criado:
   SELECT u.email, ur.role 
   FROM users u 
   JOIN user_roles ur ON u.id = ur.user_id 
   WHERE ur.role IN ('admin', 'super_admin');
   ```

#### Opção B: Via Código (Para desenvolvedores)

```typescript
import { adminUtils } from '@/lib/admin-utils'

// Após criar o usuário via Supabase Auth
const userId = 'UUID_DO_USUARIO'
await adminUtils.promoteToAdmin(userId, 'super_admin')
```

### Passo 3: Testar o Login Admin

1. Acesse: `http://localhost:3000/admin/login`
2. Use as credenciais do admin criado
3. Você deve ser redirecionado para: `http://localhost:3000/admin`

## 🛡️ Segurança

### Permissões por Role:

- **`user`**: Acesso normal à aplicação
- **`admin`**: Acesso ao painel admin + todas as funções de usuário
- **`super_admin`**: Pode gerenciar outros admins + todas as funções de admin

### Políticas de Segurança:

1. **RLS Habilitado**: Todas as tabelas têm Row Level Security
2. **Middleware Proteção**: Rotas `/admin/*` protegidas automaticamente
3. **Verificação Dupla**: Login admin verifica roles no banco
4. **Auditoria**: Todas as ações admin são logadas

## 🔧 Utilitários Disponíveis

### Gerenciar Admins via Código:

```typescript
import { adminUtils } from '@/lib/admin-utils'

// Verificar se é admin
const isAdmin = await adminUtils.isUserAdmin(userId)

// Listar todos os admins
const admins = await adminUtils.listAdmins()

// Promover usuário para admin
await adminUtils.promoteToAdmin(userId, 'admin')

// Remover permissões admin
await adminUtils.demoteFromAdmin(userId)

// Ver logs de auditoria
const logs = await adminUtils.getAuditLogs(100)
```

## 🐛 Troubleshooting

### Problema: "Usuário não possui permissões administrativas"

**Solução:**
```sql
-- Verificar roles do usuário
SELECT ur.role FROM user_roles ur WHERE ur.user_id = 'SEU_UUID';

-- Se não houver roles, adicionar:
INSERT INTO user_roles (user_id, role) VALUES ('SEU_UUID', 'super_admin');
```

### Problema: Erro 400 ao carregar configurações

**Solução:**
1. Verificar se as migrações foram aplicadas
2. Verificar políticas RLS da tabela `user_settings`
3. Executar: `SELECT * FROM user_settings WHERE user_id = 'SEU_UUID';`

### Problema: Middleware redirecionando incorretamente

**Solução:**
1. Verificar se as variáveis de ambiente estão corretas
2. Limpar cookies do navegador
3. Verificar logs do servidor

## 📊 Monitoramento

### Verificar Status do Sistema:

```sql
-- Verificar usuários admin
SELECT u.email, u.name, ur.role, ur.granted_at
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role IN ('admin', 'super_admin')
ORDER BY ur.granted_at DESC;

-- Verificar logs recentes
SELECT action, admin_user_id, target_user_id, created_at
FROM admin_audit_log
ORDER BY created_at DESC
LIMIT 20;

-- Verificar estatísticas
SELECT * FROM admin_dashboard_stats;
```

## 🔄 Próximos Passos

1. **Criar Interface de Gerenciamento**: Página para gerenciar admins via UI
2. **Notificações de Segurança**: Email quando novos admins são criados
3. **2FA**: Implementar autenticação de dois fatores para admins
4. **Backup Automático**: Configurar backups regulares das configurações admin

## 📞 Suporte

Se encontrar problemas, verifique:

1. ✅ Migrações aplicadas corretamente
2. ✅ Variáveis de ambiente configuradas
3. ✅ Políticas RLS funcionando
4. ✅ UUID do usuário correto

---

**⚠️ IMPORTANTE**: Mantenha as credenciais do super admin em local seguro e use senhas fortes!