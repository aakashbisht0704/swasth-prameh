-- Add report_url field to onboarding table
-- Run this in your Supabase SQL editor

-- Add report_url column to the onboarding table
ALTER TABLE public.onboarding 
ADD COLUMN IF NOT EXISTS report_url TEXT;

-- Add comment to document the field
COMMENT ON COLUMN public.onboarding.report_url IS 'URL to the uploaded medical report file';
