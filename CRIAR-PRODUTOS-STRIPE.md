# 🎯 Guia Rápido - Criar Produtos no Stripe

## Erro Atual
```
No such price: 'price_...'
```

Isso significa que o Price ID não existe no seu Stripe.

## ✅ Solução Rápida (5 minutos)

### Opção 1: Via Dashboard do Stripe (Manual)

1. **Acesse:** https://dashboard.stripe.com/test/products

2. **Clique em "+ Criar produto"**

3. **Plano Básico:**
   - Nome: `MoncoyFinance - Básico`
   - Descrição: `Funcionalidades essenciais`
   - Preço: `19.90` BRL
   - Tipo de cobrança: `Recorrente`
   - Período: `Mensal`
   - Clique em **"Salvar produto"**
   - ✅ **COPIE O PRICE ID** (começa com `price_...`)

4. **Repita para os outros planos:**
   - **Pro:** R$ 49,90/mês
   - **Premium:** R$ 59,90/mês

5. **Adicione os IDs no `.env.local`:**
```env
STRIPE_PRICE_BASIC=price_COLE_AQUI_O_ID_DO_BASICO
STRIPE_PRICE_PRO=price_COLE_AQUI_O_ID_DO_PRO
STRIPE_PRICE_PREMIUM=price_COLE_AQUI_O_ID_DO_PREMIUM
```

6. **Reinicie o servidor:**
```bash
pnpm dev
```

### Opção 2: Via Script (Automático)

```bash
# Certifique-se que STRIPE_SECRET_KEY está no .env.local
node scripts/create-stripe-products.js
```

O script vai:
- ✅ Criar os 3 produtos automaticamente
- ✅ Criar os preços para cada produto
- ✅ Mostrar os Price IDs para você copiar

---

## 🧪 Solução Temporária (Teste Rápido)

Se quiser apenas testar AGORA sem criar produtos:

1. **Crie UM produto de teste qualquer:**
   - Acesse: https://dashboard.stripe.com/test/products
   - Crie um produto com qualquer preço (ex: R$ 10/mês)
   - Copie o PRICE ID

2. **Adicione no `.env.local`:**
```env
# Use o MESMO price ID para todos (temporário)
STRIPE_PRICE_BASIC=price_SEU_ID_AQUI
STRIPE_PRICE_PRO=price_SEU_ID_AQUI
STRIPE_PRICE_PREMIUM=price_SEU_ID_AQUI
```

3. **Reinicie e teste!**

⚠️ **Atenção:** Com essa solução temporária, todos os planos terão o mesmo preço. Use apenas para testar o fluxo.

---

## 📸 Como Encontrar o Price ID

Quando você cria um produto no Stripe:

1. Vai para a página do produto
2. Na seção **"Preços"**, você verá algo como:
   ```
   R$ 19,90/mês
   price_1ABC123XYZ...  ← Este é o Price ID
   ```
3. Copie este ID completo

---

## ✅ Checklist

- [ ] STRIPE_SECRET_KEY configurada no `.env.local`
- [ ] Produtos criados no Stripe (ou script executado)
- [ ] Price IDs copiados
- [ ] Price IDs adicionados no `.env.local`
- [ ] Servidor reiniciado
- [ ] Testado no navegador

---

## 🚀 Após Configurar

Teste clicando em qualquer botão "Assinar" na landing page!

Se funcionar, você verá a página de checkout do Stripe. 🎉

---

## ❓ Dúvidas?

Veja o guia completo em `STRIPE-SETUP.md`
