-- Create ai_usage table for tracking AI question limits per user
-- Migration: 20251016_create_ai_usage_table
-- Created: 2025-10-16

-- Drop table if exists (for clean re-runs during development)
DROP TABLE IF EXISTS public.ai_usage CASCADE;

-- Create ai_usage table
CREATE TABLE public.ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL CHECK (plan IN ('basic', 'professional', 'premium')),
  question_count INTEGER NOT NULL DEFAULT 0,
  last_reset_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_question_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one record per user
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_ai_usage_user_id ON public.ai_usage(user_id);
CREATE INDEX idx_ai_usage_last_reset ON public.ai_usage(last_reset_date);

-- Enable Row Level Security
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only read their own usage data
CREATE POLICY "Users can view their own AI usage"
  ON public.ai_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own usage record (auto-created on first AI question)
CREATE POLICY "Users can create their own AI usage record"
  ON public.ai_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own usage data
CREATE POLICY "Users can update their own AI usage"
  ON public.ai_usage
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all usage data
CREATE POLICY "Admins can view all AI usage"
  ON public.ai_usage
  FOR SELECT
  USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM auth.users 
      WHERE email IN ('admin@financeira.com', 'ronald@financeira.com')
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_ai_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER set_ai_usage_updated_at
  BEFORE UPDATE ON public.ai_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_usage_updated_at();

-- Function to check if reset is needed and perform it
CREATE OR REPLACE FUNCTION public.check_and_reset_ai_usage(
  p_user_id UUID,
  p_plan VARCHAR
)
RETURNS TABLE(should_reset BOOLEAN, days_since_reset INTEGER) AS $$
DECLARE
  v_last_reset TIMESTAMPTZ;
  v_days_diff INTEGER;
  v_reset_needed BOOLEAN := FALSE;
BEGIN
  -- Get last reset date
  SELECT last_reset_date INTO v_last_reset
  FROM public.ai_usage
  WHERE user_id = p_user_id;
  
  -- Calculate days since last reset
  v_days_diff := EXTRACT(DAY FROM NOW() - v_last_reset)::INTEGER;
  
  -- Check if reset is needed based on plan
  IF p_plan IN ('basic', 'professional') THEN
    -- Weekly reset (7 days)
    v_reset_needed := v_days_diff >= 7;
  ELSIF p_plan = 'premium' THEN
    -- Monthly reset (30 days)
    v_reset_needed := v_days_diff >= 30;
  END IF;
  
  -- If reset is needed, update the record
  IF v_reset_needed THEN
    UPDATE public.ai_usage
    SET 
      question_count = 0,
      last_reset_date = NOW(),
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
  
  RETURN QUERY SELECT v_reset_needed, v_days_diff;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.ai_usage TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_reset_ai_usage TO authenticated;

-- Add comment for documentation
COMMENT ON TABLE public.ai_usage IS 'Tracks AI question usage per user with automatic reset based on plan (weekly for basic/pro, monthly for premium)';
COMMENT ON COLUMN public.ai_usage.question_count IS 'Number of AI questions asked since last reset';
COMMENT ON COLUMN public.ai_usage.last_reset_date IS 'Date when the counter was last reset';
COMMENT ON COLUMN public.ai_usage.last_question_date IS 'Timestamp of the most recent AI question';
