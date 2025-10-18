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
   ```
3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` com as chaves do Supabase e Stripe.
4. Rode o projeto:
   ```bash
   pnpm run dev
   ```
5. Acesse `http://localhost:3000`

## Configuração Adicional

### OAuth do Google
Para personalizar o nome que aparece durante o login com Google (ao invés de mostrar a URL do Supabase), consulte o guia completo:
- [Configuração do OAuth do Google](./docs/SUPABASE_OAUTH_CONFIG.md)

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
