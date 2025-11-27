-- Minimal migration to add meal plan system columns
-- Safe to run - only adds columns if they don't exist
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. ADD COLUMNS TO PLANS TABLE
-- ============================================

-- Add plan_type column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'plan_type') THEN
    ALTER TABLE public.plans ADD COLUMN plan_type TEXT CHECK (plan_type IN ('sample', 'ai')) DEFAULT 'ai';
  END IF;
END $$;

-- Add prakriti column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'prakriti') THEN
    ALTER TABLE public.plans ADD COLUMN prakriti TEXT;
  END IF;
END $$;

-- Add start_date column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'start_date') THEN
    ALTER TABLE public.plans ADD COLUMN start_date DATE;
  END IF;
END $$;

-- Add end_date column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'end_date') THEN
    ALTER TABLE public.plans ADD COLUMN end_date DATE;
  END IF;
END $$;

-- Add is_active column
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'is_active') THEN
    ALTER TABLE public.plans ADD COLUMN is_active BOOLEAN DEFAULT true;
    -- Set all existing plans as active
    UPDATE public.plans SET is_active = true WHERE is_active IS NULL;
  END IF;
END $$;

-- Add payload column (for new plan structure)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'payload') THEN
    ALTER TABLE public.plans ADD COLUMN payload JSONB;
    -- Copy existing plan_json to payload
    UPDATE public.plans SET payload = plan_json WHERE plan_json IS NOT NULL AND payload IS NULL;
  END IF;
END $$;

-- ============================================
-- 2. ADD PRAKRITI COLUMN TO USER_PROFILES
-- ============================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'prakriti') THEN
    ALTER TABLE public.user_profiles ADD COLUMN prakriti TEXT;
  END IF;
END $$;

-- ============================================
-- 3. CREATE INDEXES (if they don't exist)
-- ============================================

CREATE INDEX IF NOT EXISTS idx_plans_user_active ON public.plans(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_plans_prakriti ON public.plans(prakriti);

-- ============================================
-- 4. UPDATE RLS POLICIES (if needed)
-- ============================================

-- Ensure users can update their own plans (except sample plans)
DROP POLICY IF EXISTS "plans_update_own" ON public.plans;
CREATE POLICY "plans_update_own" ON public.plans
  FOR UPDATE USING (
    auth.uid() = user_id 
    AND (plan_type IS NULL OR plan_type != 'sample')
  );

-- Users can insert their own plans
DROP POLICY IF EXISTS "plans_insert_own" ON public.plans;
CREATE POLICY "plans_insert_own" ON public.plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DONE!
-- ============================================

-- Verify columns were added:
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns
WHERE table_name = 'plans' 
  AND column_name IN ('plan_type', 'prakriti', 'start_date', 'end_date', 'is_active', 'payload')
ORDER BY column_name;

SELECT 
  column_name, 
  data_type 
FROM information_schema.columns
WHERE table_name = 'user_profiles' 
  AND column_name = 'prakriti';

