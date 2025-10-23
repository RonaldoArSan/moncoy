# Diagnóstico: Fluxo de Reset de Senha

## Problema Atual
O usuário não consegue resetar a senha. Sempre volta para `/login` independente do método usado.

## Fluxo Esperado do Supabase

### Como o Supabase funciona:

1. **Email de Reset** contém um link como:
   ```
   https://moncoyfinance.com/auth/callback?token_hash=HASH&type=recovery&redirect_to=REDIRECT_URL
   ```
   
   OU (dependendo da configuração):
   ```
   https://moncoyfinance.com/auth/callback?code=CODE
   ```

2. **Middleware** (`middleware.ts`) deve interceptar e:
   - Se tem `type=recovery` + tokens → redirecionar para `/reset-password`
   - Se tem `code` → deixar passar para route handler

3. **Route Handler** (`app/auth/callback/route.ts`) processa:
   - Troca `code` por sessão
   - Redireciona para destino

## Possíveis Problemas

### 1. Middleware vs Route Handler - Ordem de Execução
- ✅ Middleware executa ANTES do route handler
- ❌ MAS: Se middleware não retornar NextResponse.redirect, o route handler executa

### 2. Supabase pode estar enviando `code` em vez de tokens diretos
- Password reset pode usar OAuth flow (com `code`)
- Middleware espera `access_token` + `refresh_token`
- Se vier como `code`, middleware não intercepta

### 3. Route handler não trata `type=recovery`
- Route handler só processa `code` ou `error`
- Se vier `type=recovery` sem `code`, cai no else final → redireciona para `/login`

## Análise do Código Atual

### middleware.ts (linhas 54-81)
```typescript
if (req.nextUrl.pathname === '/auth/callback') {
  const type = searchParams.get('type')
  const accessToken = searchParams.get('access_token')
  const refreshToken = searchParams.get('refresh_token')
  
  // Só redireciona se:
  // 1. type === 'recovery' OU
  // 2. (accessToken && refreshToken && !error)
  
  // ❌ PROBLEMA: Supabase pode enviar type=recovery + CODE (não tokens)
}
```

### app/auth/callback/route.ts (linhas 94-136)
```typescript
if (code) {
  // Troca code por sessão
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  
  if (error) {
    // ❌ AQUI: Redireciona para /login com erro
    return NextResponse.redirect(`/login?error=...`)
  }
  
  // Redireciona para 'next' parameter (default: '/')
  return NextResponse.redirect(next)
  
  // ❌ PROBLEMA: Não verifica se é password reset!
  // Deveria redirecionar para /reset-password se type=recovery
}
```

## Solução

O route handler precisa detectar `type=recovery` e redirecionar para `/reset-password` após criar a sessão com sucesso.

### Fluxo Correto:

1. Email → `https://moncoyfinance.com/auth/callback?token_hash=...&type=recovery`
2. Middleware verifica `type=recovery` → **MAS pode não ter tokens ainda**
3. Route handler recebe, troca code/hash por sessão
4. **Route handler verifica `type=recovery`** → redireciona para `/reset-password`
5. Usuário redefine senha
6. Redireciona para `/login`
7. Login com nova senha → Dashboard

## Próxima Ação

Modificar `app/auth/callback/route.ts` para:
1. Detectar parâmetro `type=recovery`
2. Após criar sessão com sucesso, redirecionar para `/reset-password` (não para `next`)
