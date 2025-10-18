# 🎯 GUIA RÁPIDO - Encontrar Organização Vercel

## ✨ Método Mais Rápido (30 segundos)

### 1. Acesse o Domínio de Produção
```
https://moncoyfinance.com
```

### 2. Abra o DevTools (F12)
- Network tab
- Recarregue a página (F5)
- Procure por: `_next/static` ou qualquer requisição
- Headers → Response Headers
- Procure por: `x-vercel-id` ou `server: Vercel`

### 3. Ou Acesse Direto
```
https://vercel.com/dashboard
```
- Faça login
- No topo, você verá seu nome/organização
- Clique para ver lista de organizações

## 🔍 Método Visual - Pelo GitHub

### Passo 1: Acesse o Repositório
```
https://github.com/RonaldoArSan/moncoy
```

### Passo 2: Procure por Deploy Badges
- No README
- Pode ter algo como: `Deployed on Vercel` com link

### Passo 3: Aba "Environments"
- Lado direito da página
- Se tiver integração, mostra: `Production - vercel`
- Clique → Vai para Vercel

## 📧 Método do Email

### Procure no seu email por:
- **De:** `notifications@vercel.com`
- **Assunto:** Qualquer coisa com "moncoy" ou "deployment"

### No email, procure:
```
Project: moncoy
Organization: [SEU-ORG]
URL: https://moncoy-abc123.vercel.app
```

## 🖥️ Instalar Vercel CLI e Linkar

```bash
# 1. Instalar
npm install -g vercel

# 2. Login
vercel login

# 3. Ir para pasta do projeto
cd /home/ronald/moncoyfinance/moncoy

# 4. Linkar
vercel link

# Vai aparecer:
# ? Set up "~/moncoyfinance/moncoy"? Y
# ? Which scope? → ESCOLHA A ORGANIZAÇÃO
# ? Link to existing project? Y
# ? Project name? moncoy
# ✅ Linked!

# 5. Ver info
vercel inspect
```

## 💡 Dicas Importantes

### Se você tem múltiplas contas
Tente fazer login com:
- [ ] GitHub (github.com/RonaldoArSan)
- [ ] Google (email pessoal)
- [ ] Google (email corporativo)
- [ ] Email direto

### Se não encontrar o projeto
Possibilidades:
1. **Projeto em outra conta** → Tente outras contas
2. **Projeto deletado** → Precisa redeployar
3. **Projeto não foi deployado ainda** → Fazer primeiro deploy

## ✅ Como Confirmar que Achou Certo

No painel da Vercel, você deve ver:

```
┌─────────────────────────────────────┐
│ 📦 moncoy                           │
│                                     │
│ 🌐 Production                       │
│    https://moncoyfinance.com       │
│    https://moncoy.vercel.app       │
│                                     │
│ 🔧 Framework: Next.js              │
│ 📁 Root: ./                        │
│ 🌿 Branch: main                    │
│ 📍 Git: RonaldoArSan/moncoy        │
│                                     │
│ 🏢 Organization: [AQUI!]           │
└─────────────────────────────────────┘
```

## 🚀 Após Encontrar

1. **Anote a organização:** `[nome-da-org]`

2. **Linkar localmente:**
   ```bash
   vercel link
   ```

3. **Ver variáveis de ambiente:**
   ```bash
   vercel env pull .env.production
   ```

4. **Fazer deploy (se necessário):**
   ```bash
   vercel --prod
   ```

## 📋 Checklist Final

- [ ] Acessei https://vercel.com
- [ ] Fiz login (conta correta)
- [ ] Encontrei projeto "moncoy"
- [ ] Anotei nome da organização
- [ ] Instalei Vercel CLI
- [ ] Linkei o projeto localmente
- [ ] Verifiquei que está correto (`vercel inspect`)

---

**Tempo total:** 2-5 minutos
**Prioridade:** Necessário para aplicar migração em produção

## 🆘 Ainda com Dúvidas?

Execute o script de ajuda:
```bash
bash scripts/find-vercel-info.sh
```

Ou veja a documentação completa:
```bash
cat docs/FIND-VERCEL-ORG.md
```
