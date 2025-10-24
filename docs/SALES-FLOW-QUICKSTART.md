# 🚀 Fluxo de Vendas - Guia Rápido

## ✅ O que foi implementado

Fluxo completo de vendas integrado:
**Landing Page → Stripe → Cadastro → Confirmação Email → Login → Aplicação**

## 🎯 Como funciona

1. **Usuário clica em "Assinar"** na landing page
2. **Stripe captura pagamento** + email + 30 dias grátis
3. **Redirecionamento automático** para cadastro com dados pré-preenchidos
4. **Cadastro simplificado** (email já vem do Stripe)
5. **Confirmação de email** com instruções claras
6. **Login** e acesso imediato ao plano pago

## 📁 Arquivos Principais

### Novos:
- `/app/api/stripe/verify-session/route.ts` - Busca dados da sessão
- `/app/auth/confirm-email/page.tsx` - Página de confirmação
- `/app/api/auth/resend-confirmation/route.ts` - Reenvio de email

### Modificados:
- `/app/api/stripe/create-checkout-session/route.ts` - Trial de 30 dias
- `/app/success/page.tsx` - Redirect automático
- `/app/register/page.tsx` - Integração com Stripe
- `/components/auth-provider.tsx` - Customer ID
- `/app/api/stripe/webhook/route.ts` - Vinculação customer

## 🔧 Configuração Necessária

### 1. Variáveis de Ambiente
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SITE_URL=https://moncoyfinance.com
```

### 2. Webhook do Stripe
- **URL**: `https://seudominio.com/api/stripe/webhook`
- **Eventos**:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### 3. Supabase
- Confirmação de email habilitada
- Redirect URLs configuradas

## 🧪 Testar o Fluxo

```bash
# 1. Iniciar servidor local
pnpm dev

# 2. Abrir landing page
http://localhost:3000/landingpage

# 3. Usar cartão de teste do Stripe
4242 4242 4242 4242
Data: Qualquer data futura
CVC: Qualquer 3 dígitos

# 4. Acompanhar o fluxo completo
Landing → Stripe → Success → Register → Confirm Email → Login → Dashboard
```

## 📊 Métricas a Acompanhar

- Taxa de conversão no checkout
- Taxa de conclusão de cadastro
- Taxa de confirmação de email
- Tempo médio do fluxo
- Taxa de primeiro login

## 🐛 Troubleshooting

### Email não chega
- Verificar spam
- Clicar em "Reenviar email"
- Verificar configuração do Supabase

### Session ID inválido
- Verificar se webhook está configurado
- Checar logs do Stripe Dashboard
- Verificar STRIPE_SECRET_KEY

### Customer ID não vincula
- Verificar webhook do Stripe
- Checar logs em `/api/stripe/webhook`
- Verificar RLS policies no Supabase

## 📖 Documentação Completa

- [Fluxo Detalhado](./FLUXO-VENDAS-COMPLETO.md)
- [Diagrama Visual](./DIAGRAMA-FLUXO-VENDAS.md)

## 🎉 Status

✅ **Implementado e funcional**

---
Criado em: 23/10/2025
