# Arquitetura do Sistema Administrativo

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────────────┐
│                        APLICAÇÃO MONCOY FINANCE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────┐    ┌──────────────────────────────┐  │
│  │   Usuários Regulares    │    │    Administradores           │  │
│  │   (Application Users)   │    │    (Admin Users)             │  │
│  └────────────┬────────────┘    └──────────────┬───────────────┘  │
│               │                                 │                   │
│               │                                 │                   │
│  ┌────────────▼────────────┐    ┌──────────────▼───────────────┐  │
│  │  Supabase Auth          │    │  Custom Admin Auth           │  │
│  │  - OAuth (Google)       │    │  - Bcrypt passwords          │  │
│  │  - Email/Password       │    │  - Session tokens            │  │
│  │  - Magic Links          │    │  - HTTP-only cookies         │  │
│  └────────────┬────────────┘    └──────────────┬───────────────┘  │
│               │                                 │                   │
│               │                                 │                   │
│  ┌────────────▼────────────┐    ┌──────────────▼───────────────┐  │
│  │  Database: users        │    │  Database: admin_users       │  │
│  │  - id (from auth.users) │    │  - id (UUID)                 │  │
│  │  - name                 │    │  - email                     │  │
│  │  - email                │    │  - password_hash             │  │
│  │  - plan                 │    │  - name                      │  │
│  │  - registration_date    │    │  - role (admin/super_admin)  │  │
│  └────────────┬────────────┘    │  - is_active                 │  │
│               │                  │  - last_login                │  │
│               │                  └──────────────┬───────────────┘  │
│               │                                 │                   │
│               │                  ┌──────────────▼───────────────┐  │
│               │                  │  Database: admin_sessions    │  │
│               │                  │  - id                        │  │
│               │                  │  - admin_user_id             │  │
│               │                  │  - token                     │  │
│               │                  │  - expires_at                │  │
│               │                  │  - ip_address                │  │
│               │                  │  - user_agent                │  │
│               │                  └──────────────────────────────┘  │
│               │                                                      │
│  ┌────────────▼──────────────────────────────────────────────────┐ │
│  │                    Application Data Tables                     │ │
│  │  - transactions                                                │ │
│  │  - categories                                                  │ │
│  │  - goals                                                       │ │
│  │  - investments                                                 │ │
│  │  - etc.                                                        │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 🔐 Fluxo de Autenticação

### Usuários Regulares (Existente)
```
1. User → Login Page (/login)
2. Input credentials
3. Supabase Auth validates
4. JWT token issued
5. Session stored in Supabase
6. Access to /app/* routes
```

### Administradores (Novo Sistema)
```
1. Admin → Admin Login Page (/admin/login)
2. Input credentials
3. POST /api/admin/auth/login
4. bcrypt verifies password
5. Session token generated
6. HTTP-only cookie set
7. Access to /admin/* routes
```

## 🛡️ Camadas de Segurança

### Nível 1: Middleware
```typescript
// middleware.ts
if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
  const adminSession = cookies.get('admin_session')
  if (!adminSession) redirect('/admin/login')
}
```

### Nível 2: API Route Protection
```typescript
// Cada rota API verifica:
1. Session token exists
2. Session is valid (not expired)
3. Admin user is active
4. Admin has required role (admin or super_admin)
```

### Nível 3: Database RLS
```sql
-- Row Level Security policies
-- Service role bypasses RLS para operações admin
CREATE POLICY "Service role can manage admin users" ON admin_users
  FOR ALL USING (true) WITH CHECK (true);
```

## 📁 Estrutura de Código

```
moncoy/
├── lib/
│   ├── admin-auth.ts              # Core authentication logic
│   └── supabase-admin.ts          # Service role client
│
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   ├── admin-users/
│   │   │   └── page.tsx           # Admin management UI
│   │   └── page.tsx               # Admin dashboard (updated)
│   │
│   └── api/admin/
│       ├── auth/
│       │   ├── login/route.ts     # Login endpoint
│       │   ├── logout/route.ts    # Logout endpoint
│       │   └── verify/route.ts    # Session verification
│       │
│       └── users/
│           ├── list/route.ts      # List admins
│           ├── create/route.ts    # Create admin
│           ├── update-password/route.ts
│           ├── toggle-status/route.ts
│           └── delete/route.ts
│
├── hooks/
│   └── use-admin-auth.ts          # React hook for admin auth
│
├── scripts/
│   └── create-admin-user.ts       # CLI tool
│
├── supabase/migrations/
│   └── 20250114_create_admin_users.sql
│
├── middleware.ts                  # Route protection
├── ADMIN_USER_SYSTEM.md           # Full documentation
├── ADMIN_SETUP_GUIDE.md           # Quick setup
└── ADMIN_ARCHITECTURE.md          # This file
```

## 🎯 Separação de Responsabilidades

| Aspecto | Usuários Regulares | Administradores |
|---------|-------------------|-----------------|
| **Autenticação** | Supabase Auth | Custom (bcrypt) |
| **Tabela** | auth.users + users | admin_users |
| **Sessão** | JWT + Supabase | Token + Cookie |
| **Login** | /login | /admin/login |
| **Rotas** | /app/* | /admin/* |
| **Permissões** | User/Premium | admin/super_admin |
| **Gerenciamento** | Self-service | Super admin only |

## 🔄 Interação Entre Sistemas

```
┌─────────────────────────────────────────────────────────┐
│                   Admin Dashboard                        │
│                                                           │
│  ┌─────────────────────┐    ┌────────────────────────┐  │
│  │  Manage App Users   │    │  Manage Admin Users    │  │
│  │  (via Supabase)     │    │  (via Custom System)   │  │
│  │                     │    │                        │  │
│  │  - View all users   │    │  - Create admins       │  │
│  │  - Edit profiles    │    │  - Change passwords    │  │
│  │  - Change plans     │    │  - Toggle status       │  │
│  │  - Delete users     │    │  - Delete admins       │  │
│  │  - View analytics   │    │  - View login history  │  │
│  └─────────────────────┘    └────────────────────────┘  │
│                                                           │
│  ⚠️  Systems are COMPLETELY INDEPENDENT                  │
│  ✅  Admin compromised ≠ Users compromised               │
│  ✅  Users compromised ≠ Admins compromised              │
└─────────────────────────────────────────────────────────┘
```

## 💾 Schema de Dados

### admin_users
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,    -- bcrypt hash
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',       -- 'admin' | 'super_admin'
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);
```

### admin_sessions
```sql
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id),
  token VARCHAR(512) UNIQUE NOT NULL,     -- 64 bytes hex
  expires_at TIMESTAMPTZ NOT NULL,        -- NOW() + 8 hours
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);
```

## 🚀 Fluxo de Requisição Completo

### Login Request
```
1. Client → POST /api/admin/auth/login
   Body: { email, password }

2. Server validates credentials
   - Find admin_user by email
   - bcrypt.compare(password, hash)
   
3. Server creates session
   - Generate random token (64 bytes)
   - Store in admin_sessions table
   - Set expiration (8 hours)
   
4. Server sets cookie
   - HttpOnly: true
   - Secure: true (production)
   - SameSite: 'lax'
   
5. Client receives user data
   - { success: true, user: {...} }
   
6. Client redirects to /admin
```

### Protected Route Access
```
1. Client → GET /admin/users

2. Middleware checks cookie
   - admin_session present?
   - If not → redirect /admin/login
   
3. Page loads
   - useAdminAuth() hook runs
   - Calls /api/admin/auth/verify
   
4. Server verifies session
   - Token valid?
   - Session expired?
   - User active?
   
5. If valid → render page
   If invalid → redirect /admin/login
```

## 📊 Níveis de Acesso

### Admin (role: 'admin')
- ✅ Access admin dashboard
- ✅ Manage application users
- ✅ View reports and analytics
- ✅ Configure settings
- ❌ Manage other admins

### Super Admin (role: 'super_admin')
- ✅ All Admin permissions
- ✅ Create new admins
- ✅ Edit admin passwords
- ✅ Activate/deactivate admins
- ✅ Delete admins
- ✅ View admin audit logs

## 🔧 Manutenção

### Cleanup de Sessões Expiradas
```sql
-- Função automática (chamada em cada verificação)
CREATE OR REPLACE FUNCTION cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Auditoria
```sql
-- Informações de auditoria disponíveis:
SELECT 
  au.email,
  au.role,
  au.last_login,
  au.created_at,
  creator.email as created_by_email
FROM admin_users au
LEFT JOIN admin_users creator ON au.created_by = creator.id
ORDER BY au.created_at DESC;
```

## 🎓 Boas Práticas

### ✅ DO
- Use senhas fortes para admins
- Revise logs de login regularmente
- Desative contas não utilizadas
- Use super_admin apenas quando necessário
- Mantenha o número de super_admins mínimo
- Altere senhas periodicamente

### ❌ DON'T
- Compartilhe credenciais administrativas
- Use senhas simples ou óbvias
- Deixe sessões abertas em computadores públicos
- Ignore alertas de segurança
- Conceda super_admin desnecessariamente
- Reutilize senhas de outros sistemas

## 🔮 Futuras Melhorias Possíveis

1. **Autenticação de Dois Fatores (2FA)**
   - TOTP via Google Authenticator
   - SMS verification
   
2. **Auditoria Avançada**
   - Log todas as ações administrativas
   - Histórico de mudanças
   - Relatórios de segurança
   
3. **Notificações**
   - Email em novo login
   - Alerta de tentativas falhadas
   - Notificação de alterações críticas
   
4. **Permissões Granulares**
   - Controle por recurso
   - Políticas customizadas
   - Grupos de permissões
   
5. **Dashboard de Segurança**
   - Sessões ativas
   - Tentativas de login
   - Atividades suspeitas

## 📞 Suporte Técnico

Para questões técnicas sobre a arquitetura:
1. Consulte esta documentação
2. Revise `ADMIN_USER_SYSTEM.md`
3. Verifique `ADMIN_SETUP_GUIDE.md`
4. Consulte os comentários no código

---

**Versão do Sistema:** 1.0  
**Última Atualização:** Janeiro 2025  
**Status:** ✅ Produção
