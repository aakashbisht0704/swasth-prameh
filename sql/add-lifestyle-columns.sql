-- Add lifestyle and medical_history columns to onboarding table
-- These should be JSONB columns to store structured data

ALTER TABLE onboarding
ADD COLUMN IF NOT EXISTS lifestyle jsonb,
ADD COLUMN IF NOT EXISTS medical_history jsonb;

-- Add comments to document the columns
COMMENT ON COLUMN onboarding.lifestyle IS 'Stores lifestyle assessment data (diet, exercise, sleep, stress)';
COMMENT ON COLUMN onboarding.medical_history IS 'Stores medical history questionnaire data';

