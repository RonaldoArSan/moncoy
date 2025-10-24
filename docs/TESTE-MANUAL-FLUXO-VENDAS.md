# 🧪 Testes Manuais - Fluxo de Vendas

## ✅ Checklist de Testes

### 1. Landing Page

- [ ] Página carrega corretamente em `/landingpage`
- [ ] Todos os preços estão corretos:
  - [ ] Básico: R$ 19,90/mês
  - [ ] Pro: R$ 49,90/mês
  - [ ] Premium: R$ 59,90/mês
- [ ] Botões "Assinar" funcionam
- [ ] Botão "Comece com 30 dias Grátis" funciona
- [ ] Navegação suave entre seções
- [ ] FAQ expande/recolhe
- [ ] Footer tem links corretos

### 2. Stripe Checkout

- [ ] Redirecionamento para Stripe funciona
- [ ] Página de checkout carrega
- [ ] Formulário aceita dados de teste:
  - Card: `4242 4242 4242 4242`
  - Data: Qualquer futura
  - CVC: 123
- [ ] Campo de email é obrigatório
- [ ] Campo de cupom está visível
- [ ] Mensagem de trial "30 dias grátis" aparece
- [ ] Botão "Pagar" funciona

### 3. Página de Sucesso (`/success`)

- [ ] Redireciona automaticamente após pagamento
- [ ] URL contém `session_id` query param
- [ ] Mostra animação de carregamento
- [ ] Mensagem "Processando pagamento..." aparece
- [ ] Após 3 segundos, mostra "Redirecionando para cadastro..."
- [ ] Redireciona para `/register?session_id=...`

### 4. Página de Registro (`/register`)

#### 4.1. Com session_id (fluxo pós-pagamento)
- [ ] URL contém `?session_id=...`
- [ ] Banner azul "Verificando dados do pagamento..." aparece
- [ ] Banner verde "✅ Pagamento confirmado!" aparece
- [ ] Email é pré-preenchido
- [ ] Email está bloqueado (disabled/readonly)
- [ ] Mensagem "Email vinculado ao pagamento do Stripe" aparece
- [ ] Plano correto é pré-selecionado (Pro ou Premium)

#### 4.2. Sem session_id (fluxo normal)
- [ ] Email não é pré-preenchido
- [ ] Email é editável
- [ ] Sem banner de pagamento confirmado

#### 4.3. Formulário - Passo 1
- [ ] Campo nome funciona
- [ ] Campo email funciona (se não bloqueado)
- [ ] Campo telefone funciona (formatação BR)
- [ ] Campo senha funciona
- [ ] Campo confirmar senha funciona
- [ ] Botão "mostrar senha" funciona
- [ ] Validação: senhas diferentes → erro
- [ ] Validação: senha < 8 caracteres → erro
- [ ] Validação: campos vazios → erro
- [ ] Botão "Continuar" avança para passo 2

#### 4.4. Formulário - Passo 2
- [ ] Opção "Pessoal" selecionável
- [ ] Opção "Empresarial" selecionável
- [ ] Card Básico clicável
- [ ] Card Pro clicável (pré-selecionado se veio do Stripe)
- [ ] Indicador visual de seleção funciona
- [ ] Botão "Voltar" retorna ao passo 1
- [ ] Botão "Continuar" avança para passo 3

#### 4.5. Formulário - Passo 3
- [ ] Resumo mostra dados corretos
- [ ] Nome está correto
- [ ] Email está correto
- [ ] Tipo de conta está correto
- [ ] Plano está correto (Pago se veio do Stripe)
- [ ] Campo OpenAI Key aparece se plano Pro
- [ ] Botão "Voltar" retorna ao passo 2
- [ ] Botão "Criar conta" funciona
- [ ] Loading aparece durante criação

#### 4.6. Após submissão
- [ ] Redireciona para `/auth/confirm-email?email=...`
- [ ] Não mostra erro

### 5. Página de Confirmação de Email (`/auth/confirm-email`)

- [ ] URL contém `?email=...` com email correto
- [ ] Email é exibido corretamente
- [ ] Ícone de email aparece
- [ ] Instruções passo a passo visíveis
- [ ] Alerta sobre spam aparece
- [ ] Botão "Reenviar email" funciona
  - [ ] Mostra loading
  - [ ] Banner verde "✅ Email reenviado" aparece
  - [ ] Banner desaparece após 5 segundos
- [ ] Botão "Ir para Login" redireciona para `/login`
- [ ] Link "Voltar à página inicial" funciona

### 6. Email de Confirmação

- [ ] Email chega (verificar caixa de entrada)
- [ ] Email chega em até 2 minutos
- [ ] Se não chegar, verificar spam
- [ ] Email tem remetente correto (Supabase)
- [ ] Email tem assunto claro
- [ ] Link de confirmação está visível
- [ ] Link de confirmação funciona
- [ ] Após clicar, redireciona para aplicação

### 7. Callback de Confirmação (`/auth/callback`)

- [ ] URL contém token de confirmação
- [ ] Loading aparece brevemente
- [ ] Redireciona para dashboard ou login
- [ ] Não mostra erro

### 8. Página de Login (`/login`)

- [ ] Formulário de login aparece
- [ ] Campo email funciona
- [ ] Campo senha funciona
- [ ] Botão "Entrar" funciona
- [ ] Login com credenciais corretas funciona
- [ ] Login com credenciais incorretas → erro
- [ ] Email não confirmado → erro claro
- [ ] Botão "Continuar com Google" funciona
- [ ] Link "Esqueceu senha" funciona

### 9. Dashboard (após login)

- [ ] Usuário é redirecionado para dashboard
- [ ] Plano correto aparece na UI
- [ ] Badge de plano correto (Pro/Premium)
- [ ] Recursos do plano estão liberados
- [ ] Dados do usuário aparecem
- [ ] Não há erros no console

### 10. Integração Stripe ↔ Supabase

#### 10.1. Verificar no Stripe Dashboard
- [ ] Customer foi criado
- [ ] Email do customer está correto
- [ ] Subscription foi criada
- [ ] Status da subscription: "trialing" ou "active"
- [ ] Trial end date está correta (30 dias)
- [ ] Plano correto está vinculado

#### 10.2. Verificar no Supabase
- [ ] Usuário existe na tabela `auth.users`
- [ ] Usuário existe na tabela `public.users`
- [ ] Campo `stripe_customer_id` está preenchido
- [ ] Campo `plan` está correto (professional/premium)
- [ ] Campo `email` está correto
- [ ] Campo `registration_date` está preenchido

### 11. Webhook do Stripe

- [ ] Webhook está configurado no Stripe
- [ ] URL do webhook está correta
- [ ] Eventos estão selecionados:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
- [ ] Webhook está ativo (não em modo disabled)
- [ ] Secret do webhook está no `.env`

#### 11.1. Testar webhook manualmente
- [ ] No Stripe Dashboard → Webhooks → Seu webhook
- [ ] Clicar em "Send test webhook"
- [ ] Selecionar `checkout.session.completed`
- [ ] Enviar
- [ ] Verificar logs em `/api/stripe/webhook`
- [ ] Status 200 retornado

### 12. Fluxo de Cancelamento

- [ ] Clicar em "Cancelar" no Stripe checkout
- [ ] Redireciona para `/cancel`
- [ ] Página de cancel aparece
- [ ] Botão "Voltar" funciona
- [ ] Sem erros

### 13. Testes de Erros

#### 13.1. Email já cadastrado
- [ ] Tentar registrar com email existente
- [ ] Erro "Email já cadastrado" aparece
- [ ] Formulário não é enviado

#### 13.2. Session ID inválido
- [ ] Acessar `/register?session_id=invalid123`
- [ ] Não mostra banner de pagamento
- [ ] Permite cadastro normal
- [ ] Email não é pré-preenchido

#### 13.3. Webhook falha
- [ ] Simular falha do webhook
- [ ] Cadastro ainda funciona
- [ ] Customer ID é vinculado durante o cadastro (fallback)

#### 13.4. Email não confirmado
- [ ] Tentar fazer login sem confirmar email
- [ ] Erro claro aparece
- [ ] Link para reenviar confirmação funciona

### 14. Testes Mobile

- [ ] Landing page responsiva
- [ ] Stripe checkout funciona no mobile
- [ ] Formulário de registro funciona
- [ ] Página de confirmação responsiva
- [ ] Login funciona
- [ ] Dashboard responsivo

### 15. Testes Cross-Browser

- [ ] Chrome ✅
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### 16. Performance

- [ ] Landing page carrega em < 3s
- [ ] Redirecionamento para Stripe é rápido
- [ ] Página de registro carrega em < 2s
- [ ] API verify-session responde em < 1s
- [ ] Login é instantâneo (< 1s)

### 17. SEO & Analytics

- [ ] Meta tags corretas na landing page
- [ ] OG image configurada
- [ ] Tracking de eventos (se implementado):
  - [ ] Click em CTA
  - [ ] Checkout iniciado
  - [ ] Pagamento concluído
  - [ ] Cadastro completo
  - [ ] Email confirmado
  - [ ] Primeiro login

---

## 🐛 Bugs Encontrados

### Durante os testes, anote bugs aqui:

**Bug #1:**
- **Descrição:**
- **Passos para reproduzir:**
- **Esperado:**
- **Atual:**
- **Prioridade:** 🔴 Alta / 🟡 Média / 🟢 Baixa

---

## ✅ Resultado Final

- **Data do teste:** ___/___/2025
- **Testado por:** _________________
- **Ambiente:** 🔴 Produção / 🟡 Staging / 🟢 Local
- **Status geral:** ✅ Aprovado / ⚠️ Com ressalvas / ❌ Reprovado

**Observações:**
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
