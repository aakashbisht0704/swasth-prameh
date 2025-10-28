-- Complete fix for plans table including missing column
-- Run this in Supabase SQL Editor

-- First, add updated_at if it doesn't exist
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Drop ALL existing policies
DROP POLICY IF EXISTS "plans_select_own" ON public.plans;
DROP POLICY IF EXISTS "plans_insert_own" ON public.plans;
DROP POLICY IF EXISTS "plans_update_own" ON public.plans;
DROP POLICY IF EXISTS "plans_delete_own" ON public.plans;
DROP POLICY IF EXISTS "plans_admin_read" ON public.plans;
DROP POLICY IF EXISTS "plans_select_policy" ON public.plans;
DROP POLICY IF EXISTS "plans_insert_policy" ON public.plans;
DROP POLICY IF EXISTS "plans_update_policy" ON public.plans;
DROP POLICY IF EXISTS "plans_delete_policy" ON public.plans;

-- Create permissive policies for development
CREATE POLICY "plans_select_policy" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "plans_insert_policy" ON public.plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "plans_update_policy" ON public.plans
  FOR UPDATE USING (true);

CREATE POLICY "plans_delete_policy" ON public.plans
  FOR DELETE USING (true);

-- Grant permissions
GRANT ALL ON public.plans TO authenticated;
GRANT ALL ON public.plans TO anon;

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'plans' 
AND table_schema = 'public';

-- Verify the policies
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'plans';

