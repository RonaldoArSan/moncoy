# 🔧 Authentication Debugging Guide

## Overview
This guide helps diagnose and fix authentication issues in production. Follow these steps to identify and resolve common authentication problems.

## Quick Diagnostics Checklist

### 1. Check Environment Variables

**In Vercel Dashboard** → Settings → Environment Variables

Required variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
NEXT_PUBLIC_SITE_URL=https://moncoyfinance.com
```

⚠️ **Critical**: After adding/modifying environment variables, you MUST redeploy!

### 2. Check Browser Console Logs

When testing login, look for these log messages:

#### ✅ Expected Success Flow:
```
🔐 Server Action: signInAction called
🔍 Environment check: { hasUrl: true, hasKey: true, ... }
📡 Attempting sign in with Supabase...
✅ Sign in successful: { userId: "...", email: "..." }
🔍 Session check after login: { hasSession: true, ... }
🔍 [Middleware] Session check: { path: "/", hasSession: true, ... }
🔄 Initializing auth...
🔍 getSession result: { hasSession: true, userId: "...", ... }
✅ Session found: user@example.com
✅ [API] User profile found: { id: "...", email: "...", plan: "..." }
```

#### ❌ Common Error Patterns:

**Pattern 1: Missing Environment Variables**
```
🚨 Missing Supabase environment variables!
❌ Login error: Erro de configuração do servidor
```
**Fix**: Add environment variables in Vercel and redeploy.

---

**Pattern 2: Invalid Credentials**
```
❌ Sign in error: { message: "Invalid login credentials", ... }
❌ Login error: Email ou senha incorretos
```
**Fix**: Verify user exists in Supabase Auth dashboard, check password is correct.

---

**Pattern 3: Session Not Created**
```
✅ Sign in successful
⚠️ WARNING: Login succeeded but no session was created!
```
**Fix**: Check cookie settings, ensure sameSite=lax and secure=true in production.

---

**Pattern 4: Session Not Found After Redirect**
```
🔄 Initializing auth...
🔍 getSession result: { hasSession: false, ... }
❌ No session found
⚠️ No session in cookies, trying getUser...
🔍 getUser result: { hasUser: false, ... }
```
**Fix**: 
- Check middleware is running on all routes
- Verify cookies are being set (check Application → Cookies in DevTools)
- Check for domain/path mismatches in cookies

### 3. Check Supabase Dashboard

**URL Configuration**
1. Go to: `https://supabase.com/dashboard/project/[project-id]/auth/url-configuration`
2. Verify:
   - **Site URL**: `https://moncoyfinance.com`
   - **Redirect URLs**: Include both production and localhost:
     ```
     http://localhost:3000/auth/callback
     https://moncoyfinance.com/auth/callback
     ```

**User Management**
1. Go to: `https://supabase.com/dashboard/project/[project-id]/auth/users`
2. Find the user having issues
3. Check:
   - ✅ Email is confirmed (green checkmark)
   - ✅ User is not banned
   - ✅ Last sign-in date

### 4. Check Network Tab

Open DevTools → Network tab, then try to login:

1. **POST to `/api/_next/data/.../login/actions.js`**
   - Status should be 200
   - Check if cookies are set in response headers
   
2. **Cookies set**:
   - `sb-[project-ref]-auth-token`
   - `sb-[project-ref]-auth-token.0` (if token is large)
   - Verify `Domain`, `Path`, `SameSite`, `Secure` attributes

3. **GET requests after redirect**:
   - Check if cookies are sent in request headers
   - Verify `Cookie` header contains Supabase auth tokens

## Common Issues and Solutions

### Issue 1: "Email ou senha incorretos" for valid credentials

**Symptoms**:
- User exists in Supabase
- Password is correct
- Login still fails

**Possible Causes**:
1. **Wrong Supabase project** - Check NEXT_PUBLIC_SUPABASE_URL matches the project where user exists
2. **Email not confirmed** - User must confirm email before login
3. **User disabled** - Check user status in Supabase dashboard
4. **Network issues** - Check if Supabase API is reachable from server

**Debug Steps**:
```bash
# Check environment variables in production
# In Vercel: Settings → Environment Variables
# Verify NEXT_PUBLIC_SUPABASE_URL matches your project

# Check user in Supabase Dashboard
# Auth → Users → Search for email
# Verify: Confirmed = true, Banned = false

# Check server logs in Vercel
# Deployments → [Latest] → Functions → View Logs
# Look for "Sign in error" messages
```

### Issue 2: Login succeeds but user not authenticated after redirect

**Symptoms**:
- Login action returns success
- Redirect happens
- Dashboard shows not authenticated
- Console logs "No session found"

**Possible Causes**:
1. **Cookies not being set** - Check server cookie configuration
2. **Middleware not refreshing session** - Should run on all routes
3. **Cookie domain mismatch** - Cookies set for wrong domain
4. **SameSite/Secure issues** - Cookie settings incompatible with production

**Debug Steps**:
1. Check console logs for "Session check after login"
   - If `hasSession: false`, cookies aren't being set on server

2. Check middleware logs for "Session check"
   - If not appearing, middleware might not be running

3. Check Application → Cookies in DevTools
   - Should see `sb-*-auth-token` cookies
   - Verify domain matches your site

4. Check cookie attributes:
   - `SameSite` should be `Lax`
   - `Secure` should be `true` in production
   - `HttpOnly` should be `true`

**Fix**:
- Ensure middleware runs on all routes (not just /auth/)
- Verify cookie settings in server.ts and middleware.ts
- Check NEXT_PUBLIC_SITE_URL matches actual domain

### Issue 3: Password reset link redirects to login instead of reset page

**Symptoms**:
- User requests password reset
- Email received with link
- Clicking link goes to login page instead of reset-password page

**Possible Causes**:
1. **Middleware not detecting recovery type** - Check URL parameters
2. **Tokens missing from URL** - Supabase didn't include tokens
3. **Wrong redirect URL configured** - Check forgot-password page

**Debug Steps**:
1. Check middleware logs for "/auth/callback hit"
   - Should show `type: "recovery"`
   - Should show `hasAccessToken: true`, `hasRefreshToken: true`

2. Inspect the reset link in email:
   - Should contain `access_token=...` and `refresh_token=...`
   - Should contain `type=recovery`

3. Check redirect URL in forgot-password page (line 27):
   ```typescript
   redirectTo: `${window.location.origin}/reset-password`
   ```

**Fix**:
- Verify middleware checks for `type === 'recovery'`
- Ensure tokens are present in URL before redirecting
- Check Supabase email templates have correct redirect URL

### Issue 4: OAuth (Google) login not working

**Symptoms**:
- Clicking "Continue with Google" does nothing
- Or redirects to login with error

**Possible Causes**:
1. **OAuth state parameter missing** - PKCE flow interrupted
2. **Redirect URI not configured in Google Console**
3. **Cookie blocked by browser** - Third-party cookies disabled
4. **Wrong Google credentials** - Client ID/Secret mismatch

**Debug Steps**:
1. Check browser console for OAuth errors
2. Check middleware logs for "OAuth error in callback"
3. Verify Google Console redirect URIs include:
   ```
   https://[project-ref].supabase.co/auth/v1/callback
   ```

**Fix**:
- Add correct redirect URI in Google Console
- Enable third-party cookies in browser (for testing)
- Verify Google Client ID/Secret in Supabase dashboard

## Testing Checklist

Before deploying to production, verify:

- [ ] All environment variables are set in Vercel
- [ ] Site URL and Redirect URLs correct in Supabase
- [ ] Google OAuth configured (if using)
- [ ] Test user can login with email/password
- [ ] Test user stays logged in after page refresh
- [ ] Test password reset flow works
- [ ] Test logout works correctly
- [ ] Check browser console has no errors
- [ ] Verify session persists across tabs

## Advanced Debugging

### Enable Detailed Logging

All authentication flows now include detailed console logging. To view:

**In Browser Console**:
- Filter by `🔍`, `✅`, `❌`, `🔄` to see auth events
- Look for patterns in the log sequence

**In Vercel Function Logs**:
1. Go to: Deployments → [Latest] → Functions
2. Look for logs from server actions
3. Check for "Sign in error" or "Session check" messages

### Check Database State

Sometimes the issue is in the `public.users` table:

```sql
-- Connect to Supabase SQL Editor
SELECT * FROM auth.users WHERE email = 'user@example.com';
SELECT * FROM public.users WHERE email = 'user@example.com';
```

Verify:
- User exists in both `auth.users` and `public.users`
- `id` matches in both tables
- `registration_date` is set
- `plan` is set correctly

### Inspect Supabase Session

In browser console, run:

```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)

const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)
```

This will show if session exists client-side.

## Getting Help

If issues persist after following this guide:

1. **Collect diagnostic information**:
   - Browser console logs
   - Network tab showing failed requests
   - Vercel function logs
   - Screenshots of Supabase configuration

2. **Check documentation**:
   - `docs/AUTHENTICATION-FIX-README.md` - Previous auth fixes
   - `docs/DIAGNOSTICO-PRODUCAO.md` - Production diagnostics
   - Supabase docs: https://supabase.com/docs/guides/auth

3. **Verify configuration**:
   - Environment variables match in Vercel and .env.local
   - Supabase URLs in dashboard match code
   - All redirect URLs are whitelisted

## Success Indicators

Authentication is working correctly when you see:

✅ Login → Session created → Redirect → Session found → Profile loaded → Dashboard visible

Console logs should show:
```
🔐 Server Action: signInAction called
✅ Sign in successful
🔍 Session check after login: { hasSession: true }
🔍 [Middleware] Session check: { hasSession: true }
🔄 Initializing auth...
✅ Session found
✅ [API] User profile found
```

And in Application → Cookies:
- `sb-*-auth-token` cookies present
- Cookies have correct domain and attributes
- Cookies sent with subsequent requests

## Related Documentation

- [Authentication Performance Fix](./AUTHENTICATION-FIX-README.md)
- [Production Diagnostics](./DIAGNOSTICO-PRODUCAO.md)
- [Production Deployment Guide](./README-PRODUCTION.md)
