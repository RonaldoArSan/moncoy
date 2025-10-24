# Fluxo de Vendas Implementado - MoncoyFinance

## 📋 Resumo do Fluxo

Este documento descreve o fluxo completo de vendas implementado, desde a landing page até o acesso à aplicação.

## 🔄 Fluxo Passo a Passo

### 1. **Landing Page** (`/landingpage`)
- Usuário navega pela página de vendas
- Visualiza os 3 planos disponíveis:
  - **Básico**: R$ 19,90/mês
  - **Pro**: R$ 49,90/mês (com 30 dias grátis)
  - **Premium**: R$ 59,90/mês
- Clica em "Assinar" ou "Comece com 30 dias Grátis"

### 2. **Stripe Checkout**
- Sistema cria sessão de checkout via `/api/stripe/create-checkout-session`
- Usuário é redirecionado para página de pagamento do Stripe
- **Dados capturados:**
  - Email do cliente
  - Informações de pagamento
  - Criação do Customer ID no Stripe
- **Configurações:**
  - 30 dias de trial grátis
  - Cupons de desconto habilitados
  - Coleta automática de endereço de cobrança

### 3. **Página de Sucesso** (`/success`)
- Após pagamento confirmado, usuário é redirecionado com `session_id`
- Página mostra animação de "Processando pagamento..."
- **Redirecionamento automático** (após 3 segundos) para:
  - `/register?session_id=XXXXX`

### 4. **Página de Cadastro** (`/register`)
- Sistema busca dados da sessão do Stripe via `/api/stripe/verify-session`
- **Dados pré-preenchidos automaticamente:**
  - Email (bloqueado para edição - vinculado ao pagamento)
  - Plano (Professional/Premium)
  - Customer ID do Stripe (interno)
- **Banner de confirmação:**
  - "✅ Pagamento confirmado! Complete seu cadastro para acessar."
- **Formulário em 3 passos:**
  1. Dados básicos (nome, email, telefone, senha)
  2. Tipo de conta (pessoal/empresarial) e plano
  3. Configurações finais

### 5. **Criação da Conta**
- Sistema chama `signUp()` com todos os dados
- Cria usuário no Supabase Auth
- Vincula `stripe_customer_id` ao perfil do usuário
- **Supabase envia email de confirmação automaticamente**

### 6. **Página de Confirmação de Email** (`/auth/confirm-email`)
- Usuário é redirecionado para página de instruções
- **Instruções claras:**
  1. Abrir email
  2. Clicar no link de confirmação
  3. Será redirecionado para login
- **Opções disponíveis:**
  - Reenviar email de confirmação
  - Ir direto para página de login
  - Voltar à landing page
- **Alertas importantes:**
  - Verificar pasta de spam

### 7. **Confirmação de Email**
- Usuário clica no link do email
- Supabase confirma o email automaticamente
- Redirecionamento para `/login` ou dashboard (via callback)

### 8. **Login** (`/login`)
- Usuário faz login com email e senha
- Ou usa "Continuar com Google"
- Sistema valida credenciais

### 9. **Acesso à Aplicação**
- Usuário autenticado é redirecionado para dashboard
- **Plano já ativo:**
  - Trial de 30 dias começando
  - Recursos do plano Pro/Premium liberados
- **Dados disponíveis:**
  - Perfil completo
  - Customer ID do Stripe vinculado
  - Assinatura ativa

## 🔧 Arquivos Criados/Modificados

### Novos Arquivos:
1. `/app/api/stripe/verify-session/route.ts` - Verifica sessão do Stripe
2. `/app/auth/confirm-email/page.tsx` - Página de confirmação de email
3. `/app/api/auth/resend-confirmation/route.ts` - API para reenviar email

### Arquivos Modificados:
1. `/app/api/stripe/create-checkout-session/route.ts`
   - Adicionado trial de 30 dias
   - Habilitado cupons de desconto
   - Melhorada captura de dados do cliente

2. `/app/success/page.tsx`
   - Redirecionamento automático para registro
   - Estado de "redirecting"

3. `/app/register/page.tsx`
   - Integração com session_id do Stripe
   - Busca automática de dados da sessão
   - Email pré-preenchido e bloqueado
   - Banner de pagamento confirmado
   - Redirecionamento para confirm-email

4. `/components/auth-provider.tsx`
   - Suporte a `stripeCustomerId` no signUp
   - Vinculação automática do customer ID

5. `/types/auth.ts`
   - Adicionado campo `stripeCustomerId` ao RegisterData

6. `/app/api/stripe/webhook/route.ts`
   - Melhorada lógica de vinculação de customer
   - Busca por email para associação automática

## 🎯 Benefícios do Fluxo

### Para o Usuário:
- ✅ Experiência fluida e sem atritos
- ✅ Email pré-preenchido (menos digitação)
- ✅ Confirmação clara de pagamento
- ✅ Instruções claras em cada etapa
- ✅ 30 dias grátis para testar
- ✅ Fácil recuperação (reenvio de email)

### Para o Negócio:
- ✅ Conversão otimizada
- ✅ Menos abandono no cadastro
- ✅ Rastreamento completo do funil
- ✅ Vinculação automática Stripe ↔ Usuário
- ✅ Trial gratuito aumenta experimentação
- ✅ Dados consistentes entre sistemas

## 🔐 Segurança

- ✅ Email vinculado ao pagamento (não pode ser alterado)
- ✅ Customer ID do Stripe armazenado de forma segura
- ✅ Confirmação obrigatória de email
- ✅ Webhook do Stripe para sincronização
- ✅ RLS (Row Level Security) no Supabase

## 📊 Métricas Rastreáveis

1. **Taxa de conversão no Stripe** (checkout iniciado → pagamento)
2. **Taxa de conclusão de cadastro** (pagamento → registro completo)
3. **Taxa de confirmação de email** (registro → email confirmado)
4. **Taxa de primeiro login** (email confirmado → login)
5. **Tempo médio do fluxo completo**

## 🚀 Próximos Passos Recomendados

1. **Analytics:**
   - Implementar tracking de eventos em cada etapa
   - Google Analytics / Mixpanel

2. **Email Marketing:**
   - Email de boas-vindas após confirmação
   - Onboarding por email (dias 1, 3, 7, 14, 28)
   - Lembrete antes do fim do trial

3. **Notificações:**
   - Notificação in-app após primeiro login
   - Tour guiado pela aplicação

4. **Otimizações:**
   - A/B testing de landing page
   - Testes de copy nos CTAs
   - Otimização de formulário de cadastro

5. **Retenção:**
   - Dashboard de onboarding
   - Checklist de primeiros passos
   - Gamificação inicial

## 🐛 Tratamento de Erros

### Cenários Cobertos:
- ✅ Pagamento falha → Redireciona para `/cancel`
- ✅ Session_id inválido → Cadastro normal
- ✅ Email já existe → Mensagem de erro
- ✅ Confirmação não recebida → Botão de reenvio
- ✅ Webhook falha → Tentativa de associação no cadastro

### Cenários a Melhorar:
- ⚠️ Pagamento pendente (PIX, boleto)
- ⚠️ Assinatura cancelada durante trial
- ⚠️ Email confirmado mas nunca fez login

## 📝 Notas de Implementação

### Stripe:
- Testado em modo test
- Precisa configurar webhook em produção
- URL do webhook: `https://seudominio.com/api/stripe/webhook`
- Eventos necessários:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### Supabase:
- Confirmação de email habilitada
- Template de email configurado
- Redirect URLs configuradas:
  - `/auth/callback`
  - `/auth/confirm-email`

### Environment Variables:
```env
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# URLs
NEXT_PUBLIC_SITE_URL=https://moncoyfinance.com
```

## ✅ Checklist de Deploy

- [ ] Configurar webhook do Stripe em produção
- [ ] Testar fluxo completo em staging
- [ ] Verificar emails de confirmação chegando
- [ ] Validar redirecionamentos em produção
- [ ] Testar com diferentes navegadores
- [ ] Testar em mobile
- [ ] Configurar monitoramento de erros (Sentry)
- [ ] Documentar para equipe de suporte
- [ ] Criar FAQ para usuários
- [ ] Preparar scripts de suporte (reenviar email, etc)

---

**Implementado em:** 23 de outubro de 2025  
**Versão:** 1.0  
**Status:** ✅ Completo e funcional
