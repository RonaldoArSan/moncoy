-- Adds Stripe customer id to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Optional: index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON public.users (stripe_customer_id);
