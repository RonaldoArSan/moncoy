/**
 * Configurações da marca MoncoyFinance
 * Centralizando informações da aplicação para consistência
 */

export const BRAND_CONFIG = {
  // Informações básicas da marca
  name: 'MoncoyFinance',
  fullName: 'MoncoyFinance - Sua Plataforma Financeira Inteligente',
  description: 'MoncoyFinance é a sua plataforma financeira inteligente para gerenciar suas finanças pessoais, investimentos e metas com o poder da IA.',
  tagline: 'Sua Plataforma Financeira Inteligente',
  
  // URLs e domínios
  domain: 'moncoyfinance.com',
  url: 'https://moncoyfinance.com',
  supportEmail: 'support@moncoyfinance.com',
  
  // Redes sociais e contato
  social: {
    twitter: '@moncoyfinance',
    linkedin: 'moncoyfinance',
    instagram: 'moncoyfinance',
    facebook: 'moncoyfinance'
  },
  
  // Imagens e assets
  images: {
    logo: '/logo.png',
    logoWhite: '/logo-white.png',
    favicon: '/favicon.ico',
    ogImage: '/og-image.png',
    appleTouchIcon: '/apple-touch-icon.png'
  },
  
  // SEO e metadados
  seo: {
    keywords: [
      'finanças pessoais',
      'investimentos', 
      'metas financeiras',
      'inteligência artificial',
      'IA',
      'gestão financeira',
      'planejamento financeiro',
      'controle de gastos',
      'orçamento',
      'moncoyfinance'
    ]
  },
  
  // Configurações do Google OAuth
  google: {
    applicationName: 'MoncoyFinance',
    supportEmail: 'support@moncoyfinance.com',
    privacyPolicy: 'https://moncoyfinance.com/privacy',
    termsOfService: 'https://moncoyfinance.com/terms',
    authorizedDomains: ['moncoyfinance.com', 'localhost']
  },
  
  // Cores da marca
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#7c3aed',
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444'
  }
} as const

export type BrandConfig = typeof BRAND_CONFIG