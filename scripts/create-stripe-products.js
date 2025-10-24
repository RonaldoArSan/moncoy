#!/usr/bin/env node

/**
 * Script para criar produtos e preços no Stripe
 * 
 * Como usar:
 * 1. Configure STRIPE_SECRET_KEY no .env.local
 * 2. Execute: node scripts/create-stripe-products.js
 */

// Carregar variáveis de ambiente do .env.local
const fs = require('fs')
const path = require('path')

// Ler arquivo .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (key && !process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

const products = [
  {
    name: 'MoncoyFinance - Plano Básico',
    description: 'Funcionalidades essenciais para gerenciar suas finanças',
    price: 1990, // R$ 19,90 em centavos
    currency: 'brl',
    interval: 'month',
  },
  {
    name: 'MoncoyFinance - Plano Pro',
    description: 'IA e recursos avançados para otimizar suas finanças',
    price: 4990, // R$ 49,90 em centavos
    currency: 'brl',
    interval: 'month',
  },
  {
    name: 'MoncoyFinance - Plano Premium',
    description: 'Recursos completos e suporte prioritário',
    price: 5990, // R$ 59,90 em centavos
    currency: 'brl',
    interval: 'month',
  },
]

async function createProducts() {
  console.log('🚀 Criando produtos no Stripe...\n')

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY não encontrada no .env.local')
    console.error('Por favor, adicione sua chave secreta do Stripe no arquivo .env.local')
    process.exit(1)
  }

  const results = []

  for (const productData of products) {
    try {
      console.log(`📦 Criando produto: ${productData.name}...`)

      // Criar produto
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
      })

      console.log(`✅ Produto criado: ${product.id}`)

      // Criar preço
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productData.price,
        currency: productData.currency,
        recurring: {
          interval: productData.interval,
        },
      })

      console.log(`💰 Preço criado: ${price.id}`)
      console.log(`   Valor: R$ ${(productData.price / 100).toFixed(2)}/${productData.interval}`)
      console.log()

      results.push({
        product: productData.name,
        productId: product.id,
        priceId: price.id,
        amount: productData.price / 100,
      })
    } catch (error) {
      console.error(`❌ Erro ao criar ${productData.name}:`, error.message)
    }
  }

  console.log('\n📋 RESUMO DOS PREÇOS CRIADOS:\n')
  console.log('=' .repeat(70))
  console.log('\n✅ Produtos criados com sucesso!\n')
  
  console.log('📝 COPIE ESTAS LINHAS PARA O SEU ARQUIVO .env.local:\n')
  console.log('-'.repeat(70))
  
  if (results[0]) {
    console.log(`STRIPE_PRICE_BASIC=${results[0].priceId}`)
  }
  if (results[1]) {
    console.log(`STRIPE_PRICE_PRO=${results[1].priceId}`)
  }
  if (results[2]) {
    console.log(`STRIPE_PRICE_PREMIUM=${results[2].priceId}`)
  }
  
  console.log('-'.repeat(70))
  console.log('\n📋 OU atualize o arquivo lib/stripe-config.ts:\n')
  console.log('```typescript')
  console.log('export const STRIPE_CONFIG = {')
  console.log('  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || \'\',')
  console.log('  ')
  console.log('  prices: {')
  
  if (results[0]) {
    console.log(`    BASIC: '${results[0].priceId}',    // R$ ${results[0].amount.toFixed(2)}/mês`)
  }
  if (results[1]) {
    console.log(`    PRO: '${results[1].priceId}',      // R$ ${results[1].amount.toFixed(2)}/mês`)
  }
  if (results[2]) {
    console.log(`    PREMIUM: '${results[2].priceId}',  // R$ ${results[2].amount.toFixed(2)}/mês`)
  }
  
  console.log('  }')
  console.log('}')
  console.log('```\n')

  console.log('✅ Concluído! Atualize o arquivo .env.local com os IDs acima.')
  console.log('🔄 Depois reinicie o servidor: npm run dev')
  console.log('🔗 Ver no dashboard: https://dashboard.stripe.com/test/products\n')
}

createProducts().catch(console.error)
