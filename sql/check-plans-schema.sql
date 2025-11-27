-- Quick check to see if plans table has the new columns
-- Run this in Supabase SQL Editor to verify schema

SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'plans'
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if meal_logs table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'meal_logs'
) AS meal_logs_exists;

-- Check if user_profiles has prakriti column
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'user_profiles'
  AND column_name = 'prakriti'
) AS user_profiles_has_prakriti;

