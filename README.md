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
   - **Guias de configuração**:
     - 🚀 [Supabase - Guia Rápido](SUPABASE-QUICK-REFERENCE.md)
     - 🔧 [Configurar Supabase Dashboard](docs/SUPABASE-DASHBOARD-CONFIG.md)
     - 🌐 [Configurar Google OAuth](GOOGLE-OAUTH-QUICK-SETUP.md)
4. Rode o projeto:
   ```bash
   pnpm run dev
   ```
5. Acesse `http://localhost:3000`

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

## 📖 Guias de Configuração

### Autenticação e OAuth
- 🚀 **[Supabase - Guia Rápido](SUPABASE-QUICK-REFERENCE.md)** - Acesso rápido a links e configurações
- 🔧 **[Configurar Supabase Dashboard](docs/SUPABASE-DASHBOARD-CONFIG.md)** - Onde encontrar Redirect URLs
- 🌐 **[Configurar Google OAuth](GOOGLE-OAUTH-QUICK-SETUP.md)** - URLs para Google Console
- 🔐 **[Configuração Completa Google Console](docs/GOOGLE-CONSOLE-URLS.md)** - Guia detalhado
- 🚨 **[Corrigir Erros OAuth](docs/FIX-GOOGLE-OAUTH-ERROR.md)** - Solução de problemas

### Desenvolvimento
- 📋 **[Produção](docs/README-PRODUCTION.md)** - Deploy e variáveis de ambiente
- 🧪 **[Alterações Realizadas](docs/ALTERACOES-REALIZADAS.md)** - Histórico de mudanças
- 📊 **[Análise de Código](docs/ANALISE-CODIGO.md)** - Estrutura e padrões

## Contribuição
Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## Licença
MIT
