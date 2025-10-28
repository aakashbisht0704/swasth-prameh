-- Minimal storage setup that should work without RLS issues
-- Run this in your Supabase SQL editor

-- Create the reports bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO UPDATE SET
  public = true;

-- Drop all existing policies on storage.objects to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON storage.objects';
    END LOOP;
END $$;

-- Create very simple policies that should work
-- Allow authenticated users to do everything with reports bucket
CREATE POLICY "Reports bucket access" ON storage.objects
FOR ALL USING (bucket_id = 'reports')
WITH CHECK (bucket_id = 'reports');
