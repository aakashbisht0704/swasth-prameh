-- Fix RLS policies for yoga_vids bucket to allow public access

-- Step 1: Create a policy to allow ANYONE to list files in the bucket (even without auth)
CREATE POLICY "Public read access for yoga_vids"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'yoga_vids');

-- Step 2: Create a policy to allow ANYONE to get file info (even without auth)
CREATE POLICY "Public file info for yoga_vids"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'yoga_vids');

-- Step 3: Make sure the bucket is public (redundant if already done in UI)
-- This is usually done via Supabase dashboard, but we can check:
UPDATE storage.buckets
SET public = true
WHERE id = 'yoga_vids';

-- Verify the setup
SELECT name, public FROM storage.buckets WHERE name = 'yoga_vids';

