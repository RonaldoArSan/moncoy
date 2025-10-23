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
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/moncoy-finance-landing-page.git
   ```
2. Instale as dependências:
   ```bash
   pnpm install
   # ou
   npm install --legacy-peer-deps
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key-aqui
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   ⚠️ **IMPORTANTE**: Sem estas variáveis, o login com Google não funcionará e você verá erros de JSON parsing.
   
4. Rode o projeto:
   ```bash
   pnpm run dev
   # ou
   npm run dev
   ```
5. Acesse `http://localhost:3000`

## Variáveis de Ambiente Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase | `eyJhbGc...` |
| `NEXT_PUBLIC_SITE_URL` | URL do site (opcional em dev) | `https://moncoyfinance.com` |

**Onde encontrar**:
1. Acesse [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Settings → API
4. Copie "Project URL" e "anon/public" key

## Solução de Problemas

### Erro: "Unexpected token '<', "<!DOCTYPE "..."
Este erro ocorre quando as variáveis de ambiente não estão configuradas. Veja [FIX-JSON-PARSING-ERROR.md](./docs/FIX-JSON-PARSING-ERROR.md) para mais detalhes.

**Solução rápida**:
1. Verifique se `.env.local` existe e está configurado
2. Verifique se as variáveis começam com `NEXT_PUBLIC_`
3. Reinicie o servidor de desenvolvimento após configurar

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
