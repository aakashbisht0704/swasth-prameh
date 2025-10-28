-- Debug script to check plans table
-- Run this in Supabase SQL Editor

-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'plans'
);

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check ALL policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'plans';

-- Check if RLS is enabled
SELECT relname, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'plans';

-- Try to see existing data
SELECT id, user_id, summary, created_at 
FROM public.plans 
LIMIT 5;

