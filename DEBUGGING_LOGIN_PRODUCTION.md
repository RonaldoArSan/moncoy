# 🔧 Guia de Debug: Erro de Login em Produção

## 📋 Resumo do Problema
Usuários não conseguem fazer login com credenciais registradas no Supabase. O erro "Email ou senha incorretos" aparece mesmo com credenciais corretas.

## ✅ Mudanças Implementadas

### 1. Logging Detalhado
Agora todos os passos do login são registrados nos logs do Vercel:

- `🔐 Server Action: signInAction called` - Início da tentativa de login
- `✅ Supabase client created successfully` - Cliente criado com sucesso
- `📡 Attempting sign in with Supabase...` - Tentando autenticar
- `✅ Sign in successful` - Login bem-sucedido
- `🔍 Session check` - Verificação de sessão

### 2. Validações de Ambiente
O sistema agora valida:
- Presença de `NEXT_PUBLIC_SUPABASE_URL`
- Presença de `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Tamanho e formato das variáveis

### 3. Mensagens de Erro Específicas
Erros agora identificam o problema real:
- ✅ "Email ou senha incorretos. Verifique suas credenciais."
- ✅ "Email não confirmado. Verifique sua caixa de entrada."
- ✅ "Usuário não encontrado. Verifique o email digitado."
- ✅ "Muitas tentativas de login. Aguarde alguns minutos."
- ✅ "Sessão não criada. Tente novamente ou limpe os cookies do navegador."
- ✅ "Erro de configuração do servidor. Contate o suporte."

## 🔍 Como Debugar em Produção

### Passo 1: Verificar Logs do Vercel
1. Acesse: https://vercel.com/[seu-projeto]/moncoy/logs
2. Filtre por "Runtime Logs"
3. Tente fazer login na aplicação
4. Procure pelos seguintes indicadores nos logs:

**Se você ver:**
```
🚨 CRITICAL: Missing Supabase environment variables
```
**Ação:** Adicione as variáveis de ambiente no Vercel (ver Passo 2)

**Se você ver:**
```
❌ Sign in error: Invalid login credentials
```
**Ação:** Verifique se:
- O email está correto (sem espaços extras)
- A senha está correta
- O usuário existe no Supabase Auth (ver Passo 3)

**Se você ver:**
```
✅ Sign in successful
⚠️ Login successful but session not created
```
**Ação:** Problema com cookies. Verifique:
- Domínio está correto no Supabase
- Usuário tem cookies habilitados
- HTTPS está funcionando corretamente

### Passo 2: Configurar Variáveis de Ambiente no Vercel

1. Acesse: https://vercel.com/[seu-projeto]/moncoy/settings/environment-variables

2. Adicione as seguintes variáveis:
```env
NEXT_PUBLIC_SUPABASE_URL=https://dxdbpppymxfiojszrmir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-chave-anon-aqui]
```

3. **IMPORTANTE:** Após adicionar/modificar, faça **Redeploy**:
   - Vá em "Deployments"
   - Clique no último deployment
   - "..." → "Redeploy"

### Passo 3: Verificar Usuários no Supabase

1. Acesse: https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/auth/users

2. Procure pelo email que está tentando fazer login

3. Verifique o status:
   - ✅ **Email Confirmed**: Usuário pode fazer login
   - ❌ **Email Not Confirmed**: Usuário precisa confirmar email
   
4. Se o usuário não existir, crie um novo:
   ```sql
   -- No SQL Editor do Supabase
   -- Este é apenas um exemplo, use o dashboard para criar usuários
   ```

### Passo 4: Testar Localmente Primeiro

Antes de debugar produção, teste localmente:

```bash
# 1. Clone o repositório
git clone https://github.com/RonaldoArSan/moncoy.git
cd moncoy

# 2. Crie arquivo .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://dxdbpppymxfiojszrmir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[sua-chave-anon]
EOF

# 3. Instale dependências
npm install --legacy-peer-deps

# 4. Execute em modo desenvolvimento
npm run dev

# 5. Acesse http://localhost:3000/login
# 6. Tente fazer login com suas credenciais
# 7. Veja os logs no terminal
```

Se funcionar localmente mas não em produção:
- ❌ Problema é com as variáveis de ambiente no Vercel
- ❌ Problema é com domínio/HTTPS
- ❌ Problema é com configuração do Supabase

### Passo 5: Verificar Configuração do Supabase

1. **URL Configuration**  
   https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/auth/url-configuration

   - **Site URL:** `https://moncoyfinance.com`
   - **Redirect URLs:**
     ```
     https://moncoyfinance.com/auth/callback
     https://www.moncoyfinance.com/auth/callback
     http://localhost:3000/auth/callback
     ```

2. **Email Templates**  
   https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/auth/templates

   - Verifique se o template de confirmação está ativo
   - Verifique se o link de confirmação aponta para `{{ .SiteURL }}/auth/callback`

3. **Rate Limits**  
   https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/auth/rate-limits

   - Se muitas tentativas: aguarde alguns minutos
   - Ajuste o rate limit se necessário

## 🐛 Erros Comuns e Soluções

### Erro: "Email ou senha incorretos"

**Possíveis Causas:**
1. Credenciais realmente incorretas
2. Usuário não existe no Supabase
3. Email não confirmado
4. Problema de comunicação com Supabase

**Como Verificar:**
```bash
# Nos logs do Vercel, procure por:
❌ Sign in error: [mensagem específica]
```

**Solução:**
- Se "Invalid login credentials": Senha/email errados
- Se "Email not confirmed": Confirme o email
- Se "User not found": Crie o usuário no Supabase

### Erro: "Sessão não criada"

**Possível Causa:**
Cookies não estão sendo salvos/lidos corretamente

**Solução:**
1. Limpe cookies do navegador: `Ctrl+Shift+Delete`
2. Tente em modo anônimo/incógnito
3. Verifique se `Site URL` no Supabase está correta
4. Verifique se HTTPS está ativo

### Erro: "Erro de configuração do servidor"

**Causa:**
Variáveis de ambiente faltando no Vercel

**Solução:**
1. Configure variáveis (ver Passo 2)
2. Faça redeploy
3. Aguarde 2-3 minutos
4. Teste novamente

## 📊 Informações dos Logs

Quando você reportar um problema, inclua:

1. **Logs do Vercel** (últimas 50 linhas com o erro)
2. **Email que está tentando usar** (sem senha!)
3. **Screenshot do console do navegador** (F12 → Console)
4. **Screenshot do Network tab** (F12 → Network → Filtrar por "auth")

### Como Capturar Logs Completos

```bash
# No console do navegador (F12 → Console)
# Copie todas as mensagens que começam com:
🔐 Server Action
📡 Attempting
❌ ou ✅
🔍 Session check
```

## 🆘 Checklist de Troubleshooting

Use esta checklist para debugar:

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Redeploy feito após configurar variáveis
- [ ] Usuário existe no Supabase Auth
- [ ] Email do usuário está confirmado
- [ ] Site URL está correta no Supabase (`https://moncoyfinance.com`)
- [ ] Redirect URLs incluem `https://moncoyfinance.com/auth/callback`
- [ ] Testado em modo anônimo (sem cache/cookies)
- [ ] Logs do Vercel verificados
- [ ] Console do navegador verificado (F12)
- [ ] Testado localmente (funciona?)

## 💡 Próximos Passos

Após fazer deploy desta versão:

1. ✅ **Imediatamente:** Verifique se as variáveis de ambiente estão configuradas
2. ✅ **Tente login:** Use um usuário conhecido do Supabase
3. ✅ **Capture logs:** Veja os logs do Vercel durante a tentativa
4. ✅ **Reporte:** Compartilhe os logs específicos encontrados

## 📞 Suporte

Se após seguir todos os passos ainda não funcionar, compartilhe:

1. Logs do Vercel (seção com erro)
2. Screenshot do console (F12)
3. Screenshot do Network tab (F12 → Network)
4. Email que tentou usar (sem senha)
5. Confirmação de que variáveis estão no Vercel
6. Confirmação de que usuário existe no Supabase

---

**Última atualização:** 23 de outubro de 2025  
**Versão:** 1.0 - Enhanced Login Error Handling
