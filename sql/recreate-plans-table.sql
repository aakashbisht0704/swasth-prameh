-- Completely recreate the plans table with correct structure
-- Run this in Supabase SQL Editor

-- DROP the table and all its dependencies
DROP TABLE IF EXISTS public.plans CASCADE;

-- CREATE the table with correct structure
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  diagnosis_id uuid,
  plan_json jsonb NOT NULL,
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Create INDEXES
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON public.plans(created_at);

-- Create permissive policies (for development)
CREATE POLICY "Allow all SELECT on plans" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "Allow all INSERT on plans" ON public.plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all UPDATE on plans" ON public.plans
  FOR UPDATE USING (true);

CREATE POLICY "Allow all DELETE on plans" ON public.plans
  FOR DELETE USING (true);

-- Grant permissions
GRANT ALL ON public.plans TO authenticated;
GRANT ALL ON public.plans TO anon;

-- Verify
SELECT 'plans table created successfully' as status;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'plans' 
AND table_schema = 'public'
ORDER BY ordinal_position;

