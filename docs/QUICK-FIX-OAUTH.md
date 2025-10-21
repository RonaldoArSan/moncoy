# 🚀 GUIA RÁPIDO: Corrigir Erro OAuth Google

## ⚡ Solução em 3 Passos

### 📍 **PASSO 1: Google Cloud Console**

1. **Acesse**: https://console.cloud.google.com/apis/credentials

2. **Crie ou edite OAuth 2.0 Client ID**

3. **Adicione esta URL EXATA** em "Authorized redirect URIs":
   ```
   https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
   ```
   
   ⚠️ **IMPORTANTE**: Copie e cole EXATAMENTE como está acima!

4. **Copie**:
   - ✅ Client ID
   - ✅ Client Secret

---

### 📍 **PASSO 2: Supabase Dashboard**

1. **Acesse**: https://supabase.com/dashboard/project/dxdbpppymxfiojszrmir/auth/providers

2. **Clique em "Google"**

3. **Configure**:
   - ✅ Ative o toggle "Enable Google provider"
   - ✅ Cole o **Client ID** do Google
   - ✅ Cole o **Client Secret** do Google

4. **Clique em "Save"**

---

### 📍 **PASSO 3: Testar**

1. **Inicie o servidor**:
   ```bash
   cd /home/ronald/moncoyfinance/moncoy
   pnpm dev
   ```

2. **Acesse**: http://localhost:3000/login

3. **Clique em "Continuar com Google"**

4. **Deve funcionar!** ✨

---

## 🎯 URL de Callback (Copie Exato)

```
https://dxdbpppymxfiojszrmir.supabase.co/auth/v1/callback
```

---

## 🔧 Comandos Úteis

**Verificar configuração**:
```bash
./scripts/verify-google-oauth.sh
```

**Iniciar servidor**:
```bash
pnpm dev
```

**Ver logs em tempo real**:
```bash
tail -f .next/server/app/auth/callback/page.js
```

---

## ❓ Ainda com erro?

Execute a verificação:
```bash
./scripts/verify-google-oauth.sh
```

Consulte o guia completo:
```bash
cat docs/FIX-GOOGLE-OAUTH-ERROR.md
```

---

**Última atualização**: 20/10/2025
