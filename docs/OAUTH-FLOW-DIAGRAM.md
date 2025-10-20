# Fluxo do Google OAuth 2.0 com Supabase

## 🔄 Diagrama do Fluxo Completo

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUXO DE AUTENTICAÇÃO GOOGLE                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   Usuário    │
│ (Navegador)  │
└──────┬───────┘
       │
       │ 1. Acessa /login
       ▼
┌─────────────────────────┐
│   MoncoyFinance App     │
│  (moncoyfinance.com)    │
│                         │
│  [Continuar com Google] │◄── Botão de Login
└──────────┬──────────────┘
           │
           │ 2. Clica no botão
           │    supabase.auth.signInWithOAuth({ provider: 'google' })
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                      │
│         (dxdbpppymxfiojszrmir.supabase.co)                          │
│                                                                      │
│  1. Recebe requisição de OAuth                                      │
│  2. Redireciona para Google OAuth                                   │
└──────────┬──────────────────────────────────────────────────────────┘
           │
           │ 3. Redireciona para Google
           │    com client_id e redirect_uri
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GOOGLE OAUTH 2.0                                  │
│               (accounts.google.com)                                  │
│                                                                      │
│  ┌────────────────────────────────────────┐                         │
│  │  Fazer login no MoncoyFinance          │                         │
│  │                                        │                         │
│  │  [x] Acesso ao seu email               │                         │
│  │  [x] Informações básicas do perfil     │                         │
│  │                                        │                         │
│  │  [ Cancelar ]  [ Permitir ]            │                         │
│  └────────────────────────────────────────┘                         │
└──────────┬──────────────────────────────────────────────────────────┘
           │
           │ 4. Usuário autoriza
           │
           │ 5. Google redireciona para redirect_uri ⚠️ CRÍTICO!
           │    redirect_uri = https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SUPABASE CALLBACK                                │
│       https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback     │◄─┐
│                                                                      │  │
│  1. Recebe authorization code do Google                             │  │
│  2. Troca code por access_token e refresh_token                     │  │
│  3. Busca informações do usuário no Google                          │  │
│  4. Cria/atualiza sessão no Supabase                                │  │
│  5. Cria cookies de autenticação                                    │  │
└──────────┬──────────────────────────────────────────────────────────┘  │
           │                                                              │
           │ 6. Redireciona de volta para a app                          │
           │    com código de autenticação                                │
           ▼                                                              │
┌─────────────────────────────────────────────────────────────────────┐  │
│                MoncoyFinance /auth/callback                          │  │
│            (moncoyfinance.com/auth/callback)                         │  │
│                                                                      │  │
│  1. Recebe code da URL                                               │  │
│  2. Chama supabase.auth.exchangeCodeForSession(code)                │  │
│  3. Estabelece sessão local                                          │  │
└──────────┬──────────────────────────────────────────────────────────┘  │
           │                                                              │
           │ 7. Redireciona para dashboard                                │
           ▼                                                              │
┌─────────────────────────┐                                             │
│   MoncoyFinance App     │                                             │
│  Dashboard (/)          │                                             │
│                         │                                             │
│  ✅ Usuário Autenticado │                                             │
└─────────────────────────┘                                             │
                                                                         │
════════════════════════════════════════════════════════════════════════│══
                         ❌ AQUI OCORRE O ERRO!                         │
════════════════════════════════════════════════════════════════════════│══
                                                                         │
Se a URI https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback ────┘
NÃO estiver registrada no Google Cloud Console:

┌─────────────────────────────────────────────────────────────────────┐
│                        ❌ ERRO                                       │
│                                                                      │
│  Não é possível fazer login no app porque ele não obedece à         │
│  política do OAuth 2.0 do Google.                                   │
│                                                                      │
│  Se você é o desenvolvedor do app, registre o URI de                │
│  redirecionamento no Console do Google Cloud.                       │
│                                                                      │
│  redirect_uri=https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
└─────────────────────────────────────────────────────────────────────┘
```

## 🔑 Pontos Críticos

### 1. Authorized JavaScript Origins
São as origens de onde a requisição OAuth pode ser iniciada:
```
✅ http://localhost:3000              (desenvolvimento)
✅ https://moncoyfinance.com          (produção)
✅ https://www.moncoyfinance.com      (produção com www)
```

### 2. Authorized Redirect URIs
São as URIs para onde o Google pode redirecionar após autenticação:
```
✅ http://localhost:3000/auth/callback              (dev - callback da app)
✅ https://moncoyfinance.com/auth/callback          (prod - callback da app)
✅ https://www.moncoyfinance.com/auth/callback      (prod - callback da app)
🔴 https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback  (CRÍTICA!)
```

### 3. Por que a URI do Supabase é crítica?

O Google **NUNCA** redireciona diretamente para a aplicação. O fluxo é:

```
Google → Supabase (/auth/v1/callback) → App (/auth/callback)
         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         Esta URI DEVE estar registrada!
```

Se a URI do Supabase não estiver registrada, o Google bloqueia no passo 5 do fluxo.

## 📝 Configuração no Google Cloud Console

### Passo 1: Acessar Credentials
```
Google Cloud Console → APIs & Services → Credentials
```

### Passo 2: Selecionar OAuth 2.0 Client ID
```
Clique no Client ID existente ou crie um novo (Web application)
```

### Passo 3: Adicionar Authorized JavaScript Origins
```
[+ ADD URI]
http://localhost:3000
https://moncoyfinance.com
https://www.moncoyfinance.com
```

### Passo 4: Adicionar Authorized Redirect URIs
```
[+ ADD URI]
http://localhost:3000/auth/callback
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback  ⬅️ MAIS IMPORTANTE!
```

### Passo 5: Salvar
```
[SAVE] ← Não esqueça de salvar!
```

## ⏱️ Tempo de Propagação

Após salvar as mudanças:
- **Tempo mínimo**: 5 minutos
- **Tempo médio**: 10-15 minutos
- **Tempo máximo**: até 24 horas (raro)

**Dica**: Limpe o cache do navegador ou use modo incógnito para testar.

## 🧪 Como Testar

### Teste 1: Verificar Configuração
```bash
npm run check-oauth
```
Deve listar todas as URIs necessárias.

### Teste 2: Testar Login
1. Acesse: http://localhost:3000/login
2. Clique em "Continuar com Google"
3. Verifique se aparece a tela de consentimento do Google
4. Autorize
5. Verifique se é redirecionado para o dashboard

### Teste 3: Verificar Console
Abra o DevTools (F12) e verifique:
- Não deve haver erros no console
- Cookies de autenticação devem estar presentes
- Sessão do Supabase deve estar ativa

## 🔍 Debug

### Se o erro persistir:

1. **Verificar URIs no Google Cloud Console**
   - Todas as 4 redirect URIs estão cadastradas?
   - Não há espaços extras ou typos?

2. **Verificar Supabase**
   - Provider Google está habilitado?
   - Client ID e Client Secret estão corretos?
   - Site URL está configurada?

3. **Verificar Aplicação**
   - Arquivo `.env.local` existe?
   - Variáveis estão corretas?
   - Servidor foi reiniciado após mudanças?

4. **Aguardar Propagação**
   - Esperou pelo menos 10 minutos após salvar no Google?
   - Tentou em modo incógnito?
   - Limpou cache do navegador?

## 📚 Documentação Relacionada

- [CONFIGURACAO-GOOGLE-OAUTH.md](../CONFIGURACAO-GOOGLE-OAUTH.md) - Solução rápida
- [GOOGLE-OAUTH-SETUP.md](./GOOGLE-OAUTH-SETUP.md) - Guia completo
- [OAUTH-PROBLEM-RESOLUTION.md](./OAUTH-PROBLEM-RESOLUTION.md) - Detalhes da resolução

---

**Última atualização**: 2025-10-20  
**Versão**: 1.0.0
