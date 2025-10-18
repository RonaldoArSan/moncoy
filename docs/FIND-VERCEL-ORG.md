# 🔍 Como Encontrar sua Organização Vercel

## 📋 Situação Atual

O projeto **não está linkado localmente** com a Vercel (pasta `.vercel` não existe).

Isso significa que você precisa encontrar o projeto diretamente no painel da Vercel.

## 🚀 Métodos para Encontrar

### Método 1: Pelo Painel da Vercel (Mais Fácil) ⭐

1. **Acesse a Vercel:**
   ```
   https://vercel.com/login
   ```

2. **Entre com sua conta:**
   - GitHub
   - GitLab
   - Bitbucket
   - Email

3. **Procure pelo projeto:**
   - No dashboard, você verá todos os projetos
   - Procure por: **"moncoy"** ou **"moncoyfinance"**

4. **Verificar domínio:**
   - Se estiver em produção, acesse: `https://moncoyfinance.com`
   - O domínio deve redirecionar para o projeto na Vercel

### Método 2: Pelo GitHub (Se conectado)

1. **Acesse o repositório no GitHub:**
   ```
   https://github.com/RonaldoArSan/moncoy
   ```

2. **Procure por:**
   - Badge da Vercel no README
   - Seção "Environments" (lado direito)
   - Aba "Actions" para ver deploys

3. **Clique em qualquer deployment:**
   - Vai abrir o projeto na Vercel
   - Você verá a organização no topo

### Método 3: Verificar Emails

1. **Procure emails da Vercel:**
   - Assunto: "Deployment succeeded"
   - Assunto: "Deployment ready"
   - De: notifications@vercel.com

2. **No email, procure:**
   - Link do projeto
   - Nome da organização
   - URL de produção

### Método 4: Pelo Domínio

Se você tem um domínio customizado:

1. **Acesse:**
   ```
   https://vercel.com/domains
   ```

2. **Procure por:**
   - moncoyfinance.com
   - Qualquer domínio relacionado

3. **Clique no domínio:**
   - Vai mostrar o projeto vinculado
   - E a organização

## 🔗 Linkar Projeto Localmente

Depois de encontrar o projeto na Vercel, linke-o localmente:

### Passo 1: Instalar Vercel CLI (se não tiver)
```bash
npm install -g vercel
```

### Passo 2: Fazer Login
```bash
vercel login
```

### Passo 3: Linkar o Projeto
```bash
# Na pasta do projeto
cd /home/ronald/moncoyfinance/moncoy

# Linkar
vercel link
```

**O comando vai perguntar:**
```
? Set up and deploy "~/moncoyfinance/moncoy"? [Y/n] Y
? Which scope do you want to deploy to? (Use arrow keys)
  ❯ Minha Conta (seu-usuario)
    Organização 1
    Organização 2
```

**Selecione a organização correta e depois:**
```
? Link to existing project? [Y/n] Y
? What's the name of your existing project? moncoy
✅ Linked to ronaldoarsan/moncoy (created .vercel and added it to .gitignore)
```

### Passo 4: Verificar Link
```bash
# Ver informações do projeto
vercel inspect

# Ver última deployment
vercel ls
```

## 📊 Informações que Você Encontrará

Quando encontrar o projeto na Vercel, você verá:

```
┌─────────────────────────────────────────┐
│ Projeto: moncoy                         │
│ Organização: [SEU-USUARIO ou ORG-NAME] │
│ URL: moncoy-xyz.vercel.app             │
│ Domínio: moncoyfinance.com             │
│ Framework: Next.js                      │
│ Git: github.com/RonaldoArSan/moncoy    │
└─────────────────────────────────────────┘
```

## 🎯 Identificando a Organização Certa

Se você tem **múltiplas organizações**, identifique pela:

1. **URL de produção:**
   - `moncoy-*.vercel.app`
   - `moncoyfinance.com`

2. **Último deploy:**
   - Data mais recente
   - Branch: `main`

3. **Configurações:**
   - Framework Detection: Next.js
   - Root Directory: `./`

## 🔧 Aplicar Migração SQL na Produção

Depois de encontrar a organização:

### Via Supabase Dashboard

1. **Identifique o projeto Supabase de produção:**
   ```bash
   # Verificar variáveis de ambiente do projeto na Vercel
   # Settings > Environment Variables
   # Procure por: NEXT_PUBLIC_SUPABASE_URL
   ```

2. **Acesse o projeto:**
   ```
   https://app.supabase.com/projects
   ```

3. **Execute a migração:**
   - SQL Editor > New Query
   - Cole: `supabase/migrations/QUICK_MIGRATION.sql`
   - Run

### Via CLI Supabase (Alternativa)

```bash
# 1. Linkar ao projeto de produção
supabase link --project-ref <production-project-id>

# 2. Aplicar migrações
supabase db push

# 3. Verificar
supabase db diff
```

## 📝 Checklist Rápido

- [ ] Acessei https://vercel.com/login
- [ ] Encontrei o projeto "moncoy"
- [ ] Identifiquei a organização (nome no topo)
- [ ] Linkei o projeto localmente (`vercel link`)
- [ ] Verifiquei variáveis de ambiente (Settings > Environment Variables)
- [ ] Identifiquei o Supabase de produção (NEXT_PUBLIC_SUPABASE_URL)
- [ ] Apliquei a migração SQL no Supabase de produção

## 🆘 Se Não Encontrar

### Possibilidade 1: Conta Diferente
- Você pode ter usado um email diferente
- Tente fazer login com todas as suas contas:
  - GitHub
  - Gmail
  - Email corporativo

### Possibilidade 2: Organização de Outra Pessoa
- O projeto pode estar em uma organização compartilhada
- Verifique com colaboradores do projeto

### Possibilidade 3: Projeto Não Deployado Ainda
- O projeto só existe localmente
- Você precisa fazer o primeiro deploy:
  ```bash
  vercel --prod
  ```

## 🎉 Próximos Passos

Após encontrar e linkar:

1. **Deploy da migração:**
   ```bash
   # Aplicar SQL no Supabase de produção
   ```

2. **Verificar em produção:**
   ```
   https://moncoyfinance.com
   ```

3. **Monitorar erros:**
   ```bash
   vercel logs <deployment-url>
   ```

---

**Dica:** Se você está vendo o projeto em `moncoyfinance.com`, então ele **definitivamente** está na Vercel. Use o Método 4 (pelo domínio) para encontrar a organização.
