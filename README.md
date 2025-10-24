# Moncoy Finance

Moncoy Finance é uma plataforma de gestão financeira pessoal com recursos de inteligência artificial, integração com Stripe, autenticação social (Google) e visual moderno com Tailwind CSS.

## Funcionalidades
- Análise inteligente de gastos e sugestões de orçamento via IA
- Gerenciamento de planos (Básico, Profissional, Premium)
- Upload e exibição de foto de perfil
- Autenticação com Google
- Portal de cobrança Stripe
- Interface responsiva e moderna

## Tecnologias
- Next.js (App Router)
- React
- Tailwind CSS
- Supabase (auth, storage, database)
- Stripe
- Lucide Icons
- PNPM

## Como rodar localmente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/moncoy-finance-landing-page.git
cd moncoy-finance-landing-page
```

### 2. Instale as dependências
```bash
npm install --legacy-peer-deps
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

#### 3.1. Crie o arquivo .env.local
```bash
cp .env.example .env.local
```

#### 3.2. Configure o Supabase
1. Acesse: https://supabase.com/dashboard/project/_/settings/api
2. Copie a **URL do projeto** e a **anon key**
3. Adicione no `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

#### 3.3. Configure o Stripe

⚠️ **IMPORTANTE**: O sistema não funcionará sem configurar os Price IDs do Stripe!

**Passo 1: Obtenha as chaves da API**
1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie sua **Publishable Key** (começa com `pk_test_`)
3. Copie sua **Secret Key** (começa com `sk_test_`)
4. Adicione no `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
STRIPE_SECRET_KEY=sk_test_sua_chave_secreta_aqui
```

**Passo 2: Crie os produtos e preços no Stripe**

Você tem duas opções:

**Opção A - Via Script (Recomendado):**
```bash
node scripts/create-stripe-products.js
```
O script criará automaticamente os 3 produtos e mostrará os Price IDs para você copiar.

**Opção B - Manual no Dashboard:**
1. Acesse: https://dashboard.stripe.com/test/products
2. Clique em **"+ Criar produto"**
3. Crie os 3 produtos:
   - **Básico**: R$ 19,90/mês
   - **Pro**: R$ 49,90/mês  
   - **Premium**: R$ 59,90/mês
4. Copie os **Price IDs** (começam com `price_`)

**Passo 3: Adicione os Price IDs no .env.local**
```env
STRIPE_PRICE_BASIC=price_XXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_PRO=price_XXXXXXXXXXXXXXXXXXXXX
STRIPE_PRICE_PREMIUM=price_XXXXXXXXXXXXXXXXXXXXX
```

📖 **Veja documentação completa**: 
- [STRIPE-SETUP.md](./STRIPE-SETUP.md) - Guia completo de configuração
- [CRIAR-PRODUTOS-STRIPE.md](./CRIAR-PRODUTOS-STRIPE.md) - Guia rápido de criação de produtos

### 4. Rode o projeto
```bash
npm run dev
# ou
pnpm run dev
```

### 5. Acesse a aplicação
Abra http://localhost:3000 no seu navegador

## Testando a Integração com Stripe

Para testar pagamentos, use os cartões de teste do Stripe:
- **Cartão de sucesso**: `4242 4242 4242 4242`
- **CVC**: Qualquer 3 dígitos
- **Data**: Qualquer data futura
- **CEP**: Qualquer CEP válido

📖 Mais cartões de teste: https://stripe.com/docs/testing#cards

## Estrutura do Projeto
```
moncoy-finance-landing-page/
  app/
    ai-advice/
    profile/
    ...
  components/
  contexts/
  hooks/
  lib/
  public/
  styles/
  ...
```

## Contribuição
Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## Licença
MIT
