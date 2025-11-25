-- Add investigation JSONB column to onboarding table
-- This stores clinical details, medical history, and dietary habits

ALTER TABLE onboarding 
ADD COLUMN IF NOT EXISTS investigation JSONB;

-- Add index for faster queries on investigation data
CREATE INDEX IF NOT EXISTS idx_onboarding_investigation 
ON onboarding USING GIN (investigation);

-- Add comment for documentation
COMMENT ON COLUMN onboarding.investigation IS 'Stores clinical details, medical history, and dietary habits investigation data as JSONB';

