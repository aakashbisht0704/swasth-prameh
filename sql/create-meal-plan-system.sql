-- Comprehensive migration for meal plan system
-- This script creates/updates tables for canonical meal plans, meal logging, and user prakriti

-- ============================================
-- 1. UPDATE PLANS TABLE
-- ============================================

-- Add new columns to plans table if they don't exist
DO $$ 
BEGIN
  -- Add plan_type column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'plan_type') THEN
    ALTER TABLE public.plans ADD COLUMN plan_type TEXT CHECK (plan_type IN ('sample', 'ai')) DEFAULT 'ai';
  END IF;

  -- Add prakriti column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'prakriti') THEN
    ALTER TABLE public.plans ADD COLUMN prakriti TEXT;
  END IF;

  -- Add start_date column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'start_date') THEN
    ALTER TABLE public.plans ADD COLUMN start_date DATE;
  END IF;

  -- Add end_date column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'end_date') THEN
    ALTER TABLE public.plans ADD COLUMN end_date DATE;
  END IF;

  -- Add is_active column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'is_active') THEN
    ALTER TABLE public.plans ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- Rename plan_json to payload if needed (keep both for backward compatibility)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'plans' AND column_name = 'payload') THEN
    ALTER TABLE public.plans ADD COLUMN payload JSONB;
    -- Copy existing plan_json to payload
    UPDATE public.plans SET payload = plan_json WHERE plan_json IS NOT NULL;
  END IF;
END $$;

-- Create index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_plans_user_active ON public.plans(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_plans_prakriti ON public.plans(prakriti);

-- ============================================
-- 2. UPDATE USER_PROFILES TABLE
-- ============================================

-- Add prakriti column to user_profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_profiles' AND column_name = 'prakriti') THEN
    ALTER TABLE public.user_profiles ADD COLUMN prakriti TEXT;
    COMMENT ON COLUMN public.user_profiles.prakriti IS 'Calculated prakriti type (kapha, pitta, vata, or combination)';
  END IF;
END $$;

-- ============================================
-- 3. UPDATE MEAL_LOGS TABLE
-- ============================================

-- Drop existing meal_logs table if it exists and recreate with new schema
DROP TABLE IF EXISTS public.meal_logs CASCADE;

CREATE TABLE public.meal_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_slot TEXT NOT NULL CHECK (meal_slot IN ('breakfast', 'snack12', 'lunch', 'snack6', 'dinner')),
  menu_text TEXT NOT NULL,
  notes TEXT,
  source TEXT NOT NULL CHECK (source IN ('plan', 'user', 'ai')) DEFAULT 'plan',
  created_via TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_meal_logs_user_id ON public.meal_logs(user_id);
CREATE INDEX idx_meal_logs_plan_id ON public.meal_logs(plan_id);
CREATE INDEX idx_meal_logs_date ON public.meal_logs(date);
CREATE INDEX idx_meal_logs_user_date ON public.meal_logs(user_id, date);

-- Enable RLS
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meal_logs
DROP POLICY IF EXISTS "meal_logs_select_own" ON public.meal_logs;
CREATE POLICY "meal_logs_select_own" ON public.meal_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "meal_logs_insert_own" ON public.meal_logs;
CREATE POLICY "meal_logs_insert_own" ON public.meal_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "meal_logs_update_own" ON public.meal_logs;
CREATE POLICY "meal_logs_update_own" ON public.meal_logs
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "meal_logs_delete_own" ON public.meal_logs;
CREATE POLICY "meal_logs_delete_own" ON public.meal_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 4. UPDATE PLANS TABLE RLS
-- ============================================

-- Ensure users can only update their own plans if they're not sample plans
-- Sample plans should be immutable by users
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
-- 5. TRIGGERS
-- ============================================

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to meal_logs
DROP TRIGGER IF EXISTS update_meal_logs_updated_at ON public.meal_logs;
CREATE TRIGGER update_meal_logs_updated_at 
  BEFORE UPDATE ON public.meal_logs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON public.meal_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.plans TO authenticated;

-- ============================================
-- 7. COMMENTS
-- ============================================

COMMENT ON TABLE public.meal_logs IS 'Tracks user meal consumption from plans or custom entries';
COMMENT ON COLUMN public.meal_logs.plan_id IS 'Reference to the plan this meal came from (nullable for user-added meals)';
COMMENT ON COLUMN public.meal_logs.meal_slot IS 'Meal timing: breakfast, snack12 (12pm snack), lunch, snack6 (6pm snack), dinner';
COMMENT ON COLUMN public.meal_logs.source IS 'Origin: plan (from canonical plan), user (user-added), ai (AI-generated)';
COMMENT ON COLUMN public.plans.plan_type IS 'Type: sample (canonical 7-day plan) or ai (AI-generated plan)';
COMMENT ON COLUMN public.plans.prakriti IS 'Prakriti type this plan is designed for (kapha, pitta, vata, or combination)';
COMMENT ON COLUMN public.plans.is_active IS 'Whether this is the currently active plan for the user';

