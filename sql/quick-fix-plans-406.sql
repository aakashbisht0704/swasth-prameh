-- Quick fix for 406 error on plans table
-- Run this in Supabase SQL Editor

-- Drop old restrictive policies
DROP POLICY IF EXISTS "plans_select_own" ON public.plans;
DROP POLICY IF EXISTS "plans_insert_own" ON public.plans;
DROP POLICY IF EXISTS "plans_update_own" ON public.plans;
DROP POLICY IF EXISTS "plans_delete_own" ON public.plans;
DROP POLICY IF EXISTS "plans_admin_read" ON public.plans;

-- Drop existing permissive policies first
DROP POLICY IF EXISTS "plans_select_policy" ON public.plans;
DROP POLICY IF EXISTS "plans_insert_policy" ON public.plans;
DROP POLICY IF EXISTS "plans_update_policy" ON public.plans;
DROP POLICY IF EXISTS "plans_delete_policy" ON public.plans;

-- Create permissive policies
CREATE POLICY "plans_select_policy" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "plans_insert_policy" ON public.plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "plans_update_policy" ON public.plans
  FOR UPDATE USING (true);

CREATE POLICY "plans_delete_policy" ON public.plans
  FOR DELETE USING (true);

-- Verify
SELECT * FROM pg_policies WHERE schemaname = 'public' AND tablename = 'plans';

