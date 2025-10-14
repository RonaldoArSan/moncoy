# Supabase Client Architecture

## Overview
This document explains how the Supabase client is structured to prevent multiple GoTrueClient instances.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Browser Context                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         lib/supabase/client.ts (Singleton Source)        │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  let supabaseInstance = null                       │  │   │
│  │  │                                                     │  │   │
│  │  │  export createClient() {                           │  │   │
│  │  │    if (!supabaseInstance) {                        │  │   │
│  │  │      supabaseInstance = createBrowserClient(...)   │  │   │
│  │  │    }                                                │  │   │
│  │  │    return supabaseInstance  ◄─────────────────┐    │  │   │
│  │  │  }                                             │    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                           ▲           │
│                          │                           │           │
│           ┌──────────────┘                           │           │
│           │                                          │           │
│  ┌────────┴─────────────┐               ┌───────────┴────────┐  │
│  │   lib/supabase.ts    │               │ Other Components   │  │
│  │                      │               │                    │  │
│  │  import {            │               │ auth-provider.tsx  │  │
│  │    createClient      │               │ profile-debug.tsx  │  │
│  │  } from              │               │                    │  │
│  │  './supabase/client' │               │ import {           │  │
│  │                      │               │   createClient     │  │
│  │  const supabase =    │               │ } from             │  │
│  │    createClient()    │               │ '@/lib/supabase/   │  │
│  └──────────────────────┘               │        client'     │  │
│           ▲                              └────────────────────┘  │
│           │                                                       │
│           │ (imports)                                            │
│           │                                                       │
│  ┌────────┴──────────────────────────────────────────────────┐  │
│  │              Files using lib/supabase                      │  │
│  │                                                             │  │
│  │  • hooks/use-settings.ts                                   │  │
│  │  • hooks/use-user.ts                                       │  │
│  │  • hooks/use-notifications.ts                              │  │
│  │  • components/auth-guard.tsx                               │  │
│  │  • lib/api.ts                                              │  │
│  │  • app/auth/callback/page.tsx                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

                    ✅ RESULT: Single Instance
```

## Server-Side (Separate, Not Affected)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Server Context                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         lib/supabase/server.ts                           │   │
│  │                                                           │   │
│  │  export createClient() {                                 │   │
│  │    return createServerClient(...)  ◄──────────────┐      │   │
│  │  }                                                 │      │   │
│  └────────────────────────────────────────────────────────────┘  │
│                                                       │           │
│                                                       │           │
│  ┌────────────────────────────────────────────────────┴──────┐  │
│  │              Server Actions & API Routes                  │  │
│  │                                                             │  │
│  │  • lib/admin-utils.ts                                      │  │
│  │  • app/api/stripe/billing-portal/route.ts                 │  │
│  │  • app/api/stripe/webhook/route.ts                        │  │
│  │  • app/admin/support/actions.ts                           │  │
│  │  • app/admin/users/actions.ts                             │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Key Points

1. **Single Browser Instance**: All browser-side code now uses the same Supabase client instance
2. **Singleton Pattern**: The `supabaseInstance` variable in `lib/supabase/client.ts` holds the single instance
3. **Unified Import Path**: `lib/supabase.ts` imports from `lib/supabase/client.ts`, ensuring they share the same instance
4. **Server-Side Separation**: Server-side code uses `createServerClient` from `@supabase/ssr`, which is separate and correct

## Benefits

✅ No multiple GoTrueClient warning  
✅ Consistent authentication state across the app  
✅ Better performance (single auth instance)  
✅ Cleaner architecture with centralized client management  
