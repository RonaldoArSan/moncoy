/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produção: empacotamento standalone para facilitar deploy (Docker/Serverless)
  // Ativado somente quando STANDALONE=true para evitar problemas de symlink no Windows local
  ...(process.env.STANDALONE === 'true' ? { output: 'standalone' } : {}),
  eslint: {
    // Mantido por enquanto para evitar que o build quebre; ideal revisar e remover depois
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mantido por enquanto; ideal corrigir erros e desabilitar isso mais tarde
    ignoreBuildErrors: true,
  },
  images: {
    // Ajuste conforme sua infra de imagens; manter "true" evita otimização em runtime
    unoptimized: true,
  },
}

export default nextConfig
