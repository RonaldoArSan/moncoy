# Sistema de Usuário Administrativo Independente - Moncoy Finance

## 🎯 Visão Geral

Este projeto implementa um **sistema de autenticação administrativo completamente independente** para a aplicação Moncoy Finance. O sistema foi projetado para separar a autenticação de administradores da autenticação de usuários regulares, proporcionando maior segurança e flexibilidade.

## ⚡ Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Executar migração do banco de dados
# Execute o arquivo: supabase/migrations/20250114_create_admin_users.sql

# 3. Criar primeiro administrador
npx tsx scripts/create-admin-user.ts

# 4. Acessar o sistema
# Login: http://localhost:3000/admin/login
# Dashboard: http://localhost:3000/admin
# Gerenciar Admins: http://localhost:3000/admin/admin-users
```

## 📚 Documentação

Este projeto inclui três documentos principais:

### 1. 📖 ADMIN_SETUP_GUIDE.md
**Para quem:** Administradores e DevOps  
**Conteúdo:** Guia passo-a-passo para configuração inicial
- Pré-requisitos
- Configuração em 3 passos
- Verificação da instalação
- Troubleshooting

### 2. 📘 ADMIN_USER_SYSTEM.md
**Para quem:** Desenvolvedores e administradores  
**Conteúdo:** Documentação completa do sistema
- Arquitetura detalhada
- API endpoints
- Funções e permissões
- Segurança e boas práticas
- Estrutura de arquivos

### 3. 🏗️ ADMIN_ARCHITECTURE.md
**Para quem:** Arquitetos e desenvolvedores sênior  
**Conteúdo:** Arquitetura técnica detalhada
- Diagramas de arquitetura
- Fluxos de dados
- Camadas de segurança
- Schema do banco de dados
- Interação entre sistemas

## 🔑 Características Principais

### Segurança
- ✅ **Autenticação Independente**: Totalmente separado do sistema de usuários
- ✅ **Bcrypt**: Hash de senhas com salt de 10 rounds
- ✅ **Sessões Seguras**: Tokens HTTP-only cookies
- ✅ **Expiração Automática**: Sessões expiram após 8 horas
- ✅ **RLS**: Row Level Security no banco de dados

### Funcionalidades
- ✅ **Dois Níveis de Acesso**: Admin e Super Admin
- ✅ **CRUD Completo**: Gerenciamento total de administradores
- ✅ **Auditoria**: Rastreamento de criação e último login
- ✅ **Proteção de Rotas**: Middleware automático
- ✅ **UI Moderna**: Interface intuitiva e responsiva

### Developer Experience
- ✅ **TypeScript**: Totalmente tipado
- ✅ **React Hooks**: `useAdminAuth` para fácil integração
- ✅ **CLI Tools**: Scripts para criação de administradores
- ✅ **Documentação Completa**: Três níveis de documentação

## 📁 Estrutura de Arquivos

```
├── lib/
│   ├── admin-auth.ts              # Lógica de autenticação
│   └── supabase-admin.ts          # Cliente service role
│
├── app/
│   ├── admin/
│   │   ├── login/page.tsx         # Página de login
│   │   ├── admin-users/page.tsx   # Gerenciamento de admins
│   │   └── page.tsx               # Dashboard admin
│   │
│   └── api/admin/
│       ├── auth/                   # Endpoints de autenticação
│       └── users/                  # Endpoints de gerenciamento
│
├── hooks/
│   └── use-admin-auth.ts          # Hook React
│
├── supabase/migrations/
│   └── 20250114_create_admin_users.sql
│
├── scripts/
│   └── create-admin-user.ts       # CLI tool
│
├── middleware.ts                  # Proteção de rotas
│
└── Documentação:
    ├── README_ADMIN_SYSTEM.md     # Este arquivo (visão geral)
    ├── ADMIN_SETUP_GUIDE.md       # Guia de configuração
    ├── ADMIN_USER_SYSTEM.md       # Documentação completa
    └── ADMIN_ARCHITECTURE.md      # Arquitetura técnica
```

## 🚀 Casos de Uso

### Para Administradores

**Login Administrativo:**
```
1. Acesse /admin/login
2. Digite email e senha do administrador
3. Sistema valida e cria sessão
4. Redirecionado para dashboard admin
```

**Gerenciar Outros Admins (Super Admin):**
```
1. Acesse /admin/admin-users
2. Clique "Novo Administrador"
3. Preencha dados (nome, email, senha, função)
4. Admin criado e pode fazer login
```

### Para Desenvolvedores

**Usar autenticação em componente:**
```typescript
import { useAdminAuth } from '@/hooks/use-admin-auth'

function MyAdminComponent() {
  const { adminUser, loading, isAuthenticated, isSuperAdmin } = useAdminAuth()
  
  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Not authorized</div>
  
  return <div>Hello, {adminUser?.name}</div>
}
```

**Proteger rota API:**
```typescript
import { verifyAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const token = cookies().get('admin_session')?.value
  const result = await verifyAdminSession(token)
  
  if (!result.success) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Rota protegida...
}
```

## 🔐 Segurança

### Modelo de Ameaças Mitigadas

1. **Comprometimento de Usuários Regulares**
   - ❌ Impacto: Nenhum no sistema admin
   - ✅ Sistemas completamente separados

2. **Ataques de Força Bruta**
   - ✅ Senhas com bcrypt (computacionalmente caro)
   - ✅ Pode adicionar rate limiting (futuro)

3. **Session Hijacking**
   - ✅ HTTP-only cookies (não acessíveis via JS)
   - ✅ Secure flag em produção
   - ✅ SameSite protection

4. **Privilege Escalation**
   - ✅ Verificação de role em cada endpoint
   - ✅ RLS no banco de dados
   - ✅ Prevenção de auto-elevação

## 🔄 Migração do Sistema Antigo

Se você estava usando `ADMIN_EMAILS`:

```typescript
// Antes (em auth-provider.tsx):
const ADMIN_EMAILS = [
  'admin@financeira.com',
  'ronald@financeira.com'
]

// Agora:
// 1. Crie administradores no novo sistema
// 2. Teste cada um
// 3. Remova/comente ADMIN_EMAILS
// 4. Sistema novo em produção ✅
```

## 📊 Comparação: Antes vs Agora

| Aspecto | Sistema Antigo | Sistema Novo |
|---------|---------------|--------------|
| Autenticação | Supabase Auth | Independente |
| Controle | Lista hardcoded | Banco de dados |
| Adição de admins | Deploy de código | Interface web |
| Segurança | Compartilha com users | Isolado |
| Auditoria | Nenhuma | Completa |
| Permissões | Uma só | admin/super_admin |
| Sessões | JWT Supabase | Tokens próprios |
| Flexibilidade | Baixa | Alta |

## 🛠️ Tecnologias Utilizadas

- **Next.js 14+** - Framework React
- **TypeScript** - Type safety
- **Supabase** - Banco de dados e infra
- **bcryptjs** - Hash de senhas
- **React Hooks** - State management
- **HTTP-only Cookies** - Session storage
- **PostgreSQL** - Banco de dados

## 🧪 Testes

Para testar o sistema:

```bash
# 1. Crie um admin de teste
npx tsx scripts/create-admin-user.ts
# Email: test@admin.com
# Password: TestAdmin123!

# 2. Teste login
# Navegue: http://localhost:3000/admin/login
# Login com credenciais de teste

# 3. Teste gerenciamento (como super_admin)
# Navegue: http://localhost:3000/admin/admin-users
# Crie, edite, desative admins de teste

# 4. Teste proteção de rotas
# Faça logout e tente acessar /admin
# Deve redirecionar para /admin/login
```

## 🤝 Contribuindo

Para contribuir com melhorias:

1. Fork o repositório
2. Crie uma branch de feature
3. Faça suas alterações
4. Teste completamente
5. Envie um Pull Request

### Áreas para Melhoria Futura

- [ ] Two-Factor Authentication (2FA)
- [ ] Rate limiting nos endpoints de login
- [ ] Dashboard de segurança
- [ ] Logs de auditoria expandidos
- [ ] Permissões granulares por recurso
- [ ] Notificações por email
- [ ] API para integração externa

## 📞 Suporte

**Documentação:**
- 🚀 Setup rápido: `ADMIN_SETUP_GUIDE.md`
- 📚 Documentação completa: `ADMIN_USER_SYSTEM.md`
- 🏗️ Arquitetura: `ADMIN_ARCHITECTURE.md`

**Problemas Comuns:**
- Sessão expirada → Faça login novamente
- Sem permissão → Verifique se é super_admin
- Erro ao criar admin → Verifique variáveis de ambiente

## 📝 Changelog

### v1.0.0 (Janeiro 2025)
- ✅ Sistema administrativo independente
- ✅ Dois níveis de acesso (admin/super_admin)
- ✅ Interface de gerenciamento completa
- ✅ Autenticação segura com bcrypt
- ✅ Sessões com HTTP-only cookies
- ✅ Documentação completa
- ✅ CLI tools para administração

## 📄 Licença

Este projeto é parte do sistema Moncoy Finance.

## 👏 Créditos

Desenvolvido para proporcionar uma camada de segurança adicional e flexibilidade no gerenciamento administrativo da plataforma Moncoy Finance.

---

**Status:** ✅ Production Ready  
**Versão:** 1.0.0  
**Última Atualização:** Janeiro 2025

Para mais informações, consulte os outros arquivos de documentação na raiz do projeto.
