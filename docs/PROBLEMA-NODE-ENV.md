# Problema: NODE_ENV em Produção no Ambiente de Desenvolvimento

## Diagnóstico

A aplicação não carregava em localhost devido ao erro:

```
EvalError: Code generation from strings disallowed for this context
```

Erro ocorria no middleware do Next.js devido a restrições de segurança do Edge Runtime quando `NODE_ENV=production` está definido no ambiente local.

## Causa Raiz

A variável de ambiente `NODE_ENV` estava configurada como "production" no sistema local, provavelmente em:
- Variável de ambiente do sistema
- Configuração do shell (~/.bashrc, ~/.profile, ~/.zshrc)
- Variável de sessão do terminal

Isso causava conflito porque:
1. Next.js Edge Runtime tem restrições de segurança mais rígidas em produção
2. O middleware usa recursos que são bloqueados em modo produção no Edge Runtime
3. Durante desenvolvimento, Next.js espera `NODE_ENV=development`

## Solução Aplicada

### 1. Alteração no package.json

```json
"scripts": {
  "dev": "NODE_ENV=development next dev -p 3000"
}
```

Agora o script `pnpm dev` sempre força `NODE_ENV=development`, independentemente de configurações do sistema.

### 2. Validação da Solução

Ambos os ambientes foram testados e funcionam corretamente:

**Desenvolvimento (localhost):**
```bash
pnpm dev
# ✓ Servidor iniciado em http://localhost:3000
# ✓ Status HTTP 200
# ✓ Sem erros de middleware
```

**Produção:**
```bash
pnpm build
pnpm start
# ✓ Build completo: 31 rotas geradas
# ✓ Middleware: 34 kB
# ✓ Status HTTP 200 com cache headers
```

## Prevenção

Para evitar este problema no futuro:

1. **Nunca defina NODE_ENV=production no ambiente local**
2. Use o script `pnpm dev` que já força o ambiente correto
3. Para testes de produção, use: `pnpm build && pnpm start`
4. Em Docker/deploy, NODE_ENV=production é automaticamente definido pelo Next.js

## Comandos Úteis

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Servidor de produção (após build)
NODE_ENV=production pnpm start

# Limpar cache e rebuild
rm -rf .next && pnpm build
```

## Referências

- [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
