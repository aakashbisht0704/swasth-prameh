-- Fix lifestyle and medical_history columns in onboarding table
-- This script handles the case where previous migration failed

-- First, drop any failed indexes that might exist
DROP INDEX IF EXISTS idx_onboarding_lifestyle;
DROP INDEX IF EXISTS idx_onboarding_medical_history;

-- Add the columns (safe if they already exist)
ALTER TABLE onboarding
ADD COLUMN IF NOT EXISTS lifestyle jsonb,
ADD COLUMN IF NOT EXISTS medical_history jsonb;

-- Add comments to document the columns
COMMENT ON COLUMN onboarding.lifestyle IS 'Stores lifestyle assessment data (diet, exercise, sleep, stress)';
COMMENT ON COLUMN onboarding.medical_history IS 'Stores medical history questionnaire data';

