# ❓ Onde Encontro: Configurar Supabase Dashboard Redirect URLs

## 🎯 Resposta Direta

### Passo 1: Acesse o Supabase Dashboard

**URL Direta**: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration

OU

1. Acesse: https://supabase.com/dashboard
2. Selecione o projeto **moncoy** (ID: qlweowbsfpumojgibikk)
3. No menu lateral esquerdo, clique em: **Authentication**
4. Clique em: **URL Configuration**

---

## 📍 Localização Visual

```
┌─────────────────────────────────────────────────┐
│  Supabase Dashboard                              │
│  https://supabase.com/dashboard                  │
└─────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  Seus Projetos                                   │
│                                                  │
│  ┌─────────────────────────────┐                │
│  │  moncoy                      │ ◄── Clique aqui
│  │  qlweowbsfpumojgibikk        │                │
│  └─────────────────────────────┘                │
└─────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  Menu Lateral                                    │
│                                                  │
│  • Table Editor                                  │
│  • Authentication  ◄───────────────── Clique aqui
│    ├─ Users                                      │
│    ├─ Providers                                  │
│    └─ URL Configuration  ◄──────── AQUI! ⭐      │
│  • Storage                                       │
│  • Edge Functions                                │
│  • Settings                                      │
└─────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  URL Configuration                               │
├─────────────────────────────────────────────────┤
│                                                  │
│  Site URL                                        │
│  ┌─────────────────────────────────────────┐    │
│  │ https://moncoyfinance.com               │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  Redirect URLs  ◄──────────── CONFIGURE AQUI    │
│  ┌─────────────────────────────────────────┐    │
│  │ https://moncoyfinance.com/**            │    │
│  │ https://moncoyfinance.com/auth/callback │    │
│  │ http://localhost:3000/**                │    │
│  │                                         │    │
│  │ [ + Add another ]                       │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  [ SAVE ]  ◄──────────────────── Salve aqui     │
└─────────────────────────────────────────────────┘
```

---

## 🔗 Links Diretos

| Configuração | Link Direto |
|--------------|-------------|
| **Redirect URLs** | https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration |
| **Google Provider** | https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/providers |
| **Auth Logs** | https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/logs/auth-logs |
| **Projeto Principal** | https://supabase.com/dashboard/project/qlweowbsfpumojgibikk |

---

## ✅ URLs para Adicionar

### Produção
```
https://moncoyfinance.com/**
https://www.moncoyfinance.com/**
https://moncoyfinance.com/auth/callback
https://www.moncoyfinance.com/auth/callback
https://moncoyfinance.com/reset-password
```

### Desenvolvimento
```
http://localhost:3000/**
http://localhost:3001/**
http://localhost:3000/auth/callback
```

---

## 📖 Guias Completos

Para instruções detalhadas:
- **[Configurar Supabase Dashboard](SUPABASE-DASHBOARD-CONFIG.md)** - Guia passo a passo completo
- **[Guia Rápido Supabase](../SUPABASE-QUICK-REFERENCE.md)** - Todos os links diretos
- **[Mapa de Configuração](CONFIG-MAP.md)** - Diagrama visual completo
- **[Índice de Documentação](INDEX.md)** - Navegue toda a documentação

---

## 🚨 Problemas Comuns

### Erro: "Invalid Redirect URL"
1. Copie a URL exata do erro
2. Acesse: https://supabase.com/dashboard/project/qlweowbsfpumojgibikk/auth/url-configuration
3. Cole em "Redirect URLs"
4. Clique em "Save"
5. Aguarde 5 minutos
6. Limpe o cache do navegador
7. Tente novamente

### Configuração não está salvando
- Verifique se está logado no Supabase
- Verifique se tem permissões no projeto
- Tente em outro navegador
- Contate suporte: https://supabase.com/support

---

**Última atualização**: 21 de outubro de 2025
