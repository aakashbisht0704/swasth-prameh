-- Quick diagnostic check for meal_logs table
-- Run this in Supabase SQL Editor to verify the table exists and has correct schema

-- Check if meal_logs table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'meal_logs'
) AS meal_logs_exists;

-- If table exists, show its structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'meal_logs'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'meal_logs';

-- If table doesn't exist, create it (minimal version)
-- Uncomment and run if needed:
/*
CREATE TABLE IF NOT EXISTS public.meal_logs (
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

-- Enable RLS
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "meal_logs_select_own" ON public.meal_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "meal_logs_insert_own" ON public.meal_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "meal_logs_update_own" ON public.meal_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "meal_logs_delete_own" ON public.meal_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_id ON public.meal_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_plan_id ON public.meal_logs(plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_date ON public.meal_logs(date);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON public.meal_logs(user_id, date);

-- Grant permissions
GRANT ALL ON public.meal_logs TO authenticated;
*/

