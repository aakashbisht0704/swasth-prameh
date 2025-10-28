-- Add Prakriti scoring fields to onboarding table
-- Run this in your Supabase SQL editor

ALTER TABLE public.onboarding
ADD COLUMN IF NOT EXISTS prakriti_scores jsonb,
ADD COLUMN IF NOT EXISTS prakriti_totals jsonb,
ADD COLUMN IF NOT EXISTS prakriti_summary jsonb;

-- Add comments for documentation
COMMENT ON COLUMN public.onboarding.prakriti_scores IS 'Raw scores for each dosha question (0-6 scale)';
COMMENT ON COLUMN public.onboarding.prakriti_totals IS 'Calculated totals for each dosha group';
COMMENT ON COLUMN public.onboarding.prakriti_summary IS 'Computed prakriti classification and explanation';
