# MoncoyFinance - AI Agent Instructions

## Project Overview
MoncoyFinance is a Brazilian personal finance platform with AI-powered insights, tiered subscriptions (Stripe), and Google OAuth. Built with Next.js 15 App Router, Supabase (auth/database), and TypeScript.

## Core Architecture

### Client/Server Boundary Pattern
- **Server Components**: Default in `app/` routes. Use `async/await` for data fetching with `@/lib/supabase/server`
- **Client Components**: Mark with `"use client"` directive. Use `@/lib/supabase/client` (singleton instance)
- **Server Actions**: Mark with `"use server"`. Always `await createClient()` from `@/lib/supabase/server` (returns Promise)

**Critical**: In server actions, ALWAYS resolve the Supabase client promise:
```typescript
// ❌ WRONG
const supabase = createClient()
const { data } = await supabase.auth.admin.listUsers()

// ✅ CORRECT
const supabase = await createClient()
const { data } = await supabase.auth.admin.listUsers()
```

### Authentication Flow
1. **Multi-mode auth**: User mode (`/login`), Admin mode (`/admin/login`), Public pages
2. **Auth provider**: `@/components/auth-provider` - single source of truth. Import `useAuth()` from here, NOT from `/hooks/use-auth`
3. **Guards**: Wrap pages with `UserGuard`, `AdminGuard`, or `PublicGuard` from `@/components/auth-guards`
4. **Admin check**: Hardcoded emails in `ADMIN_EMAILS` array (should move to env config)
5. **Profile creation**: Auto-creates user profile in `public.users` on first auth via `userApi.createUserProfile()`

### Database Access Patterns
- **API Layer**: Use centralized APIs from `@/lib/api.ts` - `userApi`, `transactionsApi`, `goalsApi`, `investmentsApi`, `commitmentsApi`
- **Type Safety**: All types defined in `@/lib/supabase/types.ts`. Keep in sync with Supabase schema
- **Query Pattern**: Select with relations using embedded syntax: `.select('*, category:categories(*)')`
- **User Scoping**: All queries filter by `user_id` from authenticated session

### Tiered Plans & AI Features
- **Plans**: `basic`, `professional`, `premium` (stored in `users.plan` table)
- **Context Providers**: 
  - `UserPlanProvider`: Manages plan features/limits via `useUserPlan()` hook
  - `SettingsProvider`: User settings via `useSettingsContext()`

#### AI Access Restrictions
- **Basic Plan**: 
  - ✅ 22-day learning period: AI locked until `getDaysSinceRegistration() > 22`
  - ✅ Limit: 5 questions/week after unlock
  - Model: gpt-4o-mini
  - Check in `use-ai.ts`: throws error before 22 days
- **Pro Plan**: 
  - ✅ No learning period
  - ✅ Limit: 7 questions/week (1 per day)
  - Model: gpt-4o-mini
- **Premium Plan**: 
  - ✅ No learning period
  - ✅ Limit: 50 questions/month
  - Model: gpt-4o

#### AI Usage Tracking System
- **Storage**: Server-side in `ai_usage` table with RLS policies
- **API Endpoints**: `/api/ai/usage` (GET for checking, POST for incrementing)
- **Tracking Logic**: `@/lib/ai-limits.ts`
  - `checkAILimit()`: Server-side validation, returns remaining count & reset date
  - `incrementAIUsage()`: Server-side counter increment with transaction safety
  - Auto-resets: Weekly (Basic/Pro) or Monthly (Premium)
- **Implementation**: 
  - Hook `use-ai.ts` automatically checks limits before AI calls
  - Counter increments after successful AI response
  - Display remaining count via `usage` state
  - Migration utility in `@/lib/ai-usage-migration.ts` for localStorage → DB
- **✅ Features**: Database persistence, cross-device sync, admin analytics ready

### Payment Integration
- **Stripe Checkout**: Route at `/api/stripe/create-checkout-session`
- **Config**: Price IDs in `@/lib/stripe-config.ts`
- **Upgrade Flow**: `upgradeToProfessional()` in `UserPlanProvider` → Stripe → `/success` callback
- **Customer linking**: `users.stripe_customer_id` stores Stripe customer ID

### AI Question Tracking Implementation Details

**Current Implementation** (Server-Side):
```typescript
// 1. Hook automatically checks limits on mount
import { useAI } from '@/hooks/use-ai'

const { usage, loading, analyzeTransactions } = useAI()
// usage contains: { allowed, remaining, limit, used, resetDate, plan }

// 2. Call AI analysis (limits checked internally)
try {
  const analysis = await analyzeTransactions(transactions, 'monthly')
  // Counter automatically incremented on success
} catch (error) {
  // Error if limit reached or 22-day period not completed (basic plan)
}

// 3. Display remaining questions
{usage && (
  <p>Perguntas restantes: {usage.remaining}/{usage.limit}</p>
)}
```

**Database Schema** (`ai_usage` table):
- `user_id`: FK to auth.users
- `plan`: Current plan (basic/professional/premium)
- `question_count`: Current usage counter
- `last_reset_date`: Auto-reset based on plan (7 or 30 days)
- `last_question_date`: Timestamp of last question
- RLS policies: Users see own data, admins see all

**Migration from localStorage**:
- Auto-migrates on first use via `@/lib/ai-usage-migration.ts`
- Preserves existing counters if data exists
- Cleans up localStorage after successful migration

**Admin Analytics Ready**:
- Query `ai_usage` table for usage stats
- Track per-user consumption
- Identify heavy users for plan upgrades

## Development Workflows

### Running Locally
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server on port 3000
pnpm build            # Production build (sets STANDALONE=true for Docker)
pnpm lint             # ESLint check
```

### Docker Deployment
- **Dockerfile**: Multi-stage build using standalone output (see `output: 'standalone'` in `next.config.mjs`)
- **Env variable**: Set `STANDALONE=true` to enable standalone mode (avoids Windows symlink issues)
- **Base image**: Uses distroless Node.js 22 for security
- **Port**: Exposes 3000

### Known Issues & TypeScript Fixes
1. **Server actions**: Always await `createClient()` (see pattern above)
2. **Import standardization**: Use `@/components/auth-provider` for auth, NOT `/hooks/use-auth`
3. **Missing type fields**: `Goal` needs `deadline` & `priority` fields; `SupportSettings` needs phone/email fields
4. **Button variants**: Only use `default`, `outline`, `secondary`, `destructive`, `ghost`, `link` - NOT `success`

## File Conventions

### Component Structure
- **UI Components**: `@/components/ui/*` - shadcn/ui primitives, always `"use client"`
- **Feature Components**: `@/components/*` - business logic (modals, auth, layout)
- **Page Components**: `app/**/page.tsx` - route segments (Server Components by default)
- **Layouts**: `app/**/layout.tsx` - shared UI across routes

### Naming Patterns
- **Client layout**: `client-layout.tsx` wraps entire app with providers
- **Actions**: `actions.ts` in route folders contain server actions
- **API routes**: `app/api/**/route.ts` for REST endpoints

### Import Aliases
- `@/*` resolves to project root (configured in `tsconfig.json`)
- Always use absolute imports: `@/lib/api` not `../../lib/api`

## Critical Dependencies
- **Next.js**: v15.5.2 with App Router
- **React**: v19 (latest)
- **Supabase**: `@supabase/ssr` v0.7.0 for SSR-safe auth
- **Stripe**: v18.4.0 with API version `2024-06-20`
- **OpenAI**: v5.12.2 for AI features
- **Radix UI**: Unstyled primitives for components
- **Tailwind CSS**: v4.1.9 with `@tailwindcss/postcss`
- **Geist Font**: Sans/Mono fonts loaded in `layout.tsx`

## SEO & Metadata
- **Brand name**: "MoncoyFinance" (not "Moncoy Finance")
- **Domain**: moncoyfinance.com
- **Locale**: pt-BR (Brazilian Portuguese)
- **OG Images**: Use `/og-image.png` for social previews
- **Sitemap**: `/sitemap.xml` and `/robots.txt` in public folder

## Testing & Validation
- **Type check**: `npx tsc --noEmit`
- **Console logs**: 86+ instances exist - should use `@/lib/logger` instead
- **Error handling**: Most API calls use try/catch with toast notifications

## Middleware Pattern
- **File**: `middleware.ts` at root
- **Password reset**: Intercepts `/auth/callback?type=recovery` and redirects to `/reset-password`
- **WWW redirect**: Removes `www.` in production for SEO
- **Matcher**: Excludes `_next/static`, `_next/image`, `favicon.ico`

## Key Data Flows
1. **Dashboard**: Multiple hooks fetch data independently (not optimized) - `use-financial-summary`, `use-transactions`, `use-goals`
2. **Recurring transactions**: Generated monthly via `generateRecurringTransactions(month, year)` in `recurringTransactionsApi`
3. **Notifications**: Stored in `notifications` table, displayed in `NotificationsDropdown`
4. **Profile updates**: Sync between Supabase auth metadata and `public.users` table
5. **AI Access Gating**: 
   - Registration date stored in `users.registration_date` (from Supabase `auth.users.created_at`)
   - `getDaysSinceRegistration()` calculates: `Math.ceil((now - registration_date) / (1000 * 60 * 60 * 24))`
   - Basic plan: Shows countdown in `ai-status-card.tsx` and blocks in `use-ai.ts`
   - Professional/Premium: No waiting period, access immediately

## Common Patterns & Examples

### Checking AI Access (Basic Plan)
```typescript
// In hooks/use-ai.ts
if (currentPlan === 'basic' && user?.registration_date) {
  const registrationDate = new Date(user.registration_date)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 22) {
    throw new Error('As análises de IA estarão disponíveis após 22 dias de uso.')
  }
}
```

### Displaying Days Remaining (UI)
```typescript
// In components/ai-status-card.tsx
const daysRemaining = Math.max(0, 22 - getDaysSinceRegistration())

if (user.plan === 'basic' && daysRemaining > 0) {
  return (
    <Alert>
      <AlertDescription>
        Os recursos de IA serão liberados em {daysRemaining} dias.
        Durante este período, nossa IA aprende seus hábitos financeiros.
      </AlertDescription>
    </Alert>
  )
}
```

### Tracking AI Usage (Server-Side)
```typescript
// In component - usage tracking is automatic
import { useAI } from '@/hooks/use-ai'

const { usage, usageLoading, analyzeTransactions, refreshUsage } = useAI()

// Display current usage
if (usage && !usageLoading) {
  console.log(`${usage.remaining}/${usage.limit} perguntas restantes`)
  console.log(`Redefine em: ${new Date(usage.resetDate).toLocaleDateString()}`)
}

// Make AI request (limits checked + incremented automatically)
try {
  const result = await analyzeTransactions(transactions, 'spending_analysis')
  // Success - counter incremented server-side
} catch (error) {
  // Error if limit reached or not allowed yet
  toast.error(error.message)
}

// Manually refresh usage if needed
await refreshUsage()
```

## Documentation References
- Full change log: `docs/ALTERACOES-REALIZADAS.md`
- Code analysis: `docs/ANALISE-CODIGO.md`
- Google OAuth: `docs/GOOGLE_AUTH_CUSTOMIZATION.md`
- Production guide: `docs/README-PRODUCTION.md`
