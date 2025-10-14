# Fix for Multiple GoTrueClient Instances Warning

## Problem
The application was showing a warning: "Multiple GoTrueClient instances detected in the same browser context."

This was caused by creating multiple Supabase client instances in different files:
- `lib/supabase.ts` - Used `createClient` from `@supabase/supabase-js`
- `lib/supabase/client.ts` - Used `createBrowserClient` from `@supabase/ssr`

Different parts of the application imported from both sources, creating multiple GoTrueClient instances.

## Solution
Implemented a **singleton pattern** in both browser client files to ensure only one instance is created:

### Changes Made:

1. **`lib/supabase.ts`** - Now imports and uses the singleton from `lib/supabase/client`:
   ```typescript
   import { createClient } from './supabase/client'
   
   // Use the same singleton instance from supabase/client to prevent multiple GoTrueClient instances
   const supabase = createClient()
   ```

2. **`lib/supabase/client.ts`** - Updated to use same singleton pattern:
   ```typescript
   import { createBrowserClient } from '@supabase/ssr'
   
   let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null
   
   export const createClient = () => {
     if (!supabaseInstance) {
       supabaseInstance = createBrowserClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL!,
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
       )
     }
     return supabaseInstance
   }
   ```

## How It Works

Both `lib/supabase.ts` and `lib/supabase/client.ts` now share the same singleton instance:
- Files importing `supabase` from `@/lib/supabase` get the singleton instance
- Files calling `createClient()` from `@/lib/supabase/client` get the same singleton instance
- Server-side code continues to use `createServerClient` from `@/lib/supabase/server` (not affected)

## Files Affected

### Browser-side imports (now using singleton):
- `components/auth-guard.tsx`
- `components/auth-provider.tsx`
- `components/profile-debug.tsx`
- `hooks/use-settings.ts`
- `hooks/use-user.ts`
- `hooks/use-notifications.ts`
- `lib/api.ts`
- `app/auth/callback/page.tsx`

### Server-side imports (unchanged):
- `lib/admin-utils.ts`
- `app/api/stripe/billing-portal/route.ts`
- `app/api/stripe/webhook/route.ts`
- `app/admin/support/actions.ts`
- `app/admin/users/actions.ts`
- `app/admin/actions.ts`
- `app/admin/page.tsx`

## Result

✅ Only one GoTrueClient instance is created in the browser context
✅ All browser-side code uses the same singleton instance
✅ Server-side code continues to work correctly with `createServerClient`
✅ No breaking changes to existing functionality
