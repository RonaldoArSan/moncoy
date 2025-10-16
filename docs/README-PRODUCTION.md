# Deploy de Produção (Moncoy)

Este workspace contém dois apps Next.js:
- moncoy (app principal) — porta 3000
- moncoy-finance-landing-page (landing) — porta 3001

Passos rápidos:
1. Crie arquivos .env (copie de .env.example em cada pasta)
2. Build local:
   - moncoy: pnpm i; pnpm build; pnpm start
   - landing: pnpm i; pnpm build; pnpm start
3. Docker (opcional):
   - moncoy: docker build -t moncoy:prod ./moncoy
   - landing: docker build -t moncoy-landing:prod ./moncoy-finance-landing-page

Variáveis:
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (apenas moncoy)

Observações:
- next output: standalone ativo
- Ajuste domínios/URLs públicos conforme sua infra (Vercel, Render, etc.)
