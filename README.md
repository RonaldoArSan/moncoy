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
git clone https://github.com/RonaldoArSan/moncoy.git
cd moncoy
```

### 2. Instale as dependências
```bash
npm install --legacy-peer-deps
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas credenciais:
```bash
cp .env.example .env.local
```

Edite `.env.local` e preencha:
- Credenciais do Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Credenciais do Stripe (opcional, para pagamentos)
- Chave da OpenAI (opcional, para IA)
- Email do admin (`NEXT_PUBLIC_ADMIN_EMAIL`)

**⚠️ IMPORTANTE**: Para o login com Google funcionar, você DEVE configurar o Google OAuth 2.0.
Consulte: **[CONFIGURACAO-GOOGLE-OAUTH.md](CONFIGURACAO-GOOGLE-OAUTH.md)**

### 4. Verifique a configuração do OAuth (Recomendado)
```bash
npm run check-oauth
```

Este comando verifica se todas as variáveis estão configuradas e lista as URIs que você deve registrar no Google Cloud Console.

### 5. Rode o projeto
```bash
npm run dev
```

### 6. Acesse a aplicação
Abra `http://localhost:3000` no navegador

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

## 🔧 Troubleshooting

### Erro: "Não é possível fazer login no app porque ele não obedece à política do OAuth 2.0 do Google"

Este erro ocorre quando a URI de redirecionamento do Supabase não está registrada no Google Cloud Console.

**Solução Rápida**:
1. Acesse: https://console.cloud.google.com
2. Vá para: APIs & Services → Credentials
3. Adicione esta URI nas Authorized Redirect URIs:
   ```
   https://[seu-projeto].supabase.co/auth/v1/callback
   ```

**Documentação Completa**: [CONFIGURACAO-GOOGLE-OAUTH.md](CONFIGURACAO-GOOGLE-OAUTH.md)

### Outros problemas comuns

- **Erro de dependências ao instalar**: Use `npm install --legacy-peer-deps`
- **Variáveis de ambiente não encontradas**: Certifique-se de criar `.env.local` baseado em `.env.example`
- **Verificar configuração OAuth**: Execute `npm run check-oauth`

## 📚 Documentação Adicional

- [Configuração do Google OAuth 2.0](CONFIGURACAO-GOOGLE-OAUTH.md) - Solução rápida
- [Guia Completo do Google OAuth](docs/GOOGLE-OAUTH-SETUP.md) - Instruções detalhadas
- [Customização do Google Auth](docs/GOOGLE_AUTH_CUSTOMIZATION.md) - Branding e personalização
- [Guia de Produção](docs/README-PRODUCTION.md) - Deploy e configuração de produção

## Licença
MIT
