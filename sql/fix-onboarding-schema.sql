-- Fix onboarding table schema - ensure it has all required columns and remove invalid ones

-- Step 1: Check and add missing columns
DO $$
BEGIN
  -- Add investigation column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'onboarding' AND column_name = 'investigation'
  ) THEN
    ALTER TABLE onboarding ADD COLUMN investigation JSONB;
  END IF;

  -- Remove avatar_url if it exists (doesn't belong in onboarding)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'onboarding' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE onboarding DROP COLUMN avatar_url;
  END IF;

  -- Ensure common columns exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'onboarding' AND column_name = 'prakriti_scores'
  ) THEN
    ALTER TABLE onboarding ADD COLUMN prakriti_scores JSONB;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'onboarding' AND column_name = 'prakriti_totals'
  ) THEN
    ALTER TABLE onboarding ADD COLUMN prakriti_totals JSONB;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'onboarding' AND column_name = 'prakriti_summary'
  ) THEN
    ALTER TABLE onboarding ADD COLUMN prakriti_summary JSONB;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'onboarding' AND column_name = 'lifestyle'
  ) THEN
    ALTER TABLE onboarding ADD COLUMN lifestyle JSONB;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'onboarding' AND column_name = 'medical_history'
  ) THEN
    ALTER TABLE onboarding ADD COLUMN medical_history JSONB;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'onboarding' AND column_name = 'report_url'
  ) THEN
    ALTER TABLE onboarding ADD COLUMN report_url TEXT;
  END IF;
END $$;

-- Step 2: Verify schema
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'onboarding'
ORDER BY ordinal_position;

