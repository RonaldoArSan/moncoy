# Diagrama do Fluxo de Vendas - MoncoyFinance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FLUXO DE VENDAS COMPLETO                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────┐
│  LANDING PAGE  │  👤 Usuário navega pelos planos
│  /landingpage  │     - Básico: R$ 19,90/mês
└────────┬───────┘     - Pro: R$ 49,90/mês (30 dias grátis)
         │             - Premium: R$ 59,90/mês
         │ [Clica em "Assinar"]
         ↓
┌────────────────┐
│ STRIPE CHECKOUT│  💳 Usuário preenche dados de pagamento
│                │     ✓ Email capturado
└────────┬───────┘     ✓ Customer ID criado
         │             ✓ Trial de 30 dias configurado
         │
    ┌────┴────┐
    │ PAGAMENTO│
    └────┬────┘
         │
    ┌────┴─────────┐
    │   SUCESSO?   │
    └──────┬───────┘
           │
     ┌─────┴──────┐
     │            │
   SIM          NÃO
     │            │
     │            ↓
     │      ┌──────────┐
     │      │  CANCEL  │  ❌ Pagamento falhou
     │      │ /cancel  │     Volta para landing page
     │      └──────────┘
     │
     ↓
┌─────────────────┐
│  SUCCESS PAGE   │  ⏳ "Processando pagamento..."
│  /success       │     Aguarda 3 segundos
│  ?session_id=XX │
└────────┬────────┘
         │ [Redirecionamento automático]
         ↓
┌─────────────────────────┐
│    REGISTER PAGE        │  📝 Cadastro do usuário
│  /register?session_id=XX│
│                         │  🔍 Sistema busca dados do Stripe:
│  API: verify-session    │     GET /api/stripe/verify-session
│  ├─ Email (pré-preenchido e bloqueado)
│  ├─ Plano (Pro/Premium)
│  └─ Customer ID
│                         │
│  Banner verde:          │  ✅ "Pagamento confirmado!"
│                         │
│  Formulário 3 passos:   │
│  1. Dados pessoais      │  👤 Nome, email, telefone, senha
│  2. Tipo de conta       │  🏢 Pessoal ou Empresarial
│  3. Configurações       │  ⚙️  Preferências finais
└────────┬────────────────┘
         │ [Submit do formulário]
         ↓
┌─────────────────────────┐
│   SUPABASE AUTH         │  🔐 Criação da conta
│   signUp()              │
│   ├─ Criar usuário auth │
│   ├─ Salvar metadata    │
│   ├─ Vincular stripe_customer_id
│   └─ Enviar email de confirmação
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│  CONFIRM EMAIL PAGE     │  📧 Instruções de confirmação
│  /auth/confirm-email    │
│  ?email=user@email.com  │
│                         │  Instruções:
│  📬 "Verifique seu email"│  1. Abrir email
│                         │  2. Clicar no link
│  [Reenviar Email]       │  3. Confirmar conta
│  [Ir para Login]        │
└────────┬────────────────┘  ⚠️  Verificar spam!
         │
         │ 👤 Usuário clica no link do email
         ↓
┌─────────────────────────┐
│   SUPABASE CALLBACK     │  ✓ Email confirmado
│   /auth/callback        │  ✓ Token validado
└────────┬────────────────┘
         │
         ↓
┌─────────────────────────┐
│    LOGIN PAGE           │  🔑 Usuário faz login
│    /login               │     com email e senha
│                         │     ou Google OAuth
└────────┬────────────────┘
         │ [Autenticação bem-sucedida]
         ↓
┌─────────────────────────┐
│    DASHBOARD            │  🎉 Acesso liberado!
│    /                    │
│  ✓ Plano ativo          │  Pro/Premium (30 dias trial)
│  ✓ Recursos liberados   │  Todos os recursos do plano
│  ✓ Customer ID vinculado│  Sincronizado com Stripe
└─────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                            FLUXOS PARALELOS
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                          STRIPE WEBHOOK                                      │
└─────────────────────────────────────────────────────────────────────────────┘

    Evento: checkout.session.completed
    ↓
┌────────────────────────────┐
│  /api/stripe/webhook       │  🔗 Vincula Customer ao Usuário
│                            │
│  1. Recebe customer_id     │  Busca usuário por email
│  2. Recebe email           │  Se existe → vincula customer_id
│  3. Recebe plano           │  Se não existe → aguarda cadastro
└────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                        PONTOS DE INTEGRAÇÃO
═══════════════════════════════════════════════════════════════════════════════

┌──────────────────┐          ┌──────────────────┐          ┌──────────────────┐
│     STRIPE       │◄────────►│   NEXT.JS API    │◄────────►│    SUPABASE      │
│                  │          │                  │          │                  │
│ • Checkout       │          │ • verify-session │          │ • Auth           │
│ • Customer       │          │ • webhook        │          │ • Users table    │
│ • Subscription   │          │ • resend-confirm │          │ • RLS policies   │
└──────────────────┘          └──────────────────┘          └──────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                        DADOS SINCRONIZADOS
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   STRIPE                          SUPABASE                                  │
│   ══════                          ════════                                  │
│                                                                              │
│   customer_id    ─────────────►   users.stripe_customer_id                 │
│   email          ─────────────►   users.email                              │
│   subscription   ─────────────►   users.plan                               │
│   trial_end      ─────────────►   users.trial_end_date (futuro)            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                        TRATAMENTO DE ERROS
═══════════════════════════════════════════════════════════════════════════════

    Erro no Pagamento?
    │
    ├──► /cancel ──► Volta para landing page
    │
    Session ID inválido?
    │
    ├──► Cadastro normal ──► Sem pré-preenchimento
    │
    Email já existe?
    │
    ├──► Mensagem de erro ──► "Email já cadastrado"
    │
    Email não confirmado?
    │
    ├──► Reenviar email ──► /api/auth/resend-confirmation
    │
    Webhook falha?
    │
    └──► Tenta vincular no cadastro ──► Fallback automático


═══════════════════════════════════════════════════════════════════════════════
                        ESTADOS DO USUÁRIO
═══════════════════════════════════════════════════════════════════════════════

┌──────────────────┐
│   VISITANTE      │  Navegando na landing page
└────────┬─────────┘
         ↓
┌──────────────────┐
│   PAGOU          │  Pagamento confirmado (Stripe)
└────────┬─────────┘
         ↓
┌──────────────────┐
│   CADASTRANDO    │  Preenchendo formulário
└────────┬─────────┘
         ↓
┌──────────────────┐
│   AGUARDANDO     │  Aguardando confirmação de email
│   CONFIRMAÇÃO    │
└────────┬─────────┘
         ↓
┌──────────────────┐
│   CONFIRMADO     │  Email confirmado, pode fazer login
└────────┬─────────┘
         ↓
┌──────────────────┐
│   ATIVO          │  Logado e usando a aplicação
└──────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                        MÉTRICAS DO FUNIL
═══════════════════════════════════════════════════════════════════════════════

    Landing Page Views              100%  │████████████████████│
            ↓
    Clicks no CTA                    15%  │███                 │
            ↓
    Checkout Iniciado                12%  │██                  │
            ↓
    Pagamento Concluído              10%  │██                  │
            ↓
    Cadastro Completado               9%  │██                  │
            ↓
    Email Confirmado                  8%  │█                   │
            ↓
    Primeiro Login                    7%  │█                   │
            ↓
    Usuário Ativo (D7)                5%  │█                   │


═══════════════════════════════════════════════════════════════════════════════
                    TEMPO MÉDIO DO FLUXO
═══════════════════════════════════════════════════════════════════════════════

    Landing → Checkout:          ~2 minutos
    Checkout → Pagamento:        ~3 minutos
    Pagamento → Cadastro:        ~5 segundos (automático)
    Cadastro → Envio Email:      ~30 segundos
    Envio Email → Confirmação:   ~5 minutos (depende do usuário)
    Confirmação → Login:         ~30 segundos
    
    TOTAL MÉDIO:                 ~10-15 minutos


═══════════════════════════════════════════════════════════════════════════════
```

## Legenda

- 📝 Formulário/Input
- 💳 Pagamento
- 🔐 Autenticação
- 📧 Email
- ✅ Sucesso
- ❌ Erro
- ⏳ Aguardando
- 🔍 Busca/Verificação
- 🔗 Integração
- 👤 Ação do usuário
- ⚙️ Configuração
- 🎉 Conclusão
