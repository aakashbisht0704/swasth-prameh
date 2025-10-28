-- Simple storage policies for reports bucket
-- Run this in your Supabase SQL editor

-- Drop all existing policies on storage.objects
DROP POLICY IF EXISTS "Users can upload their own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload reports" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update reports" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete reports" ON storage.objects;

-- Create simple policies for the reports bucket
-- Since it's a public bucket with timestamped files, we can be more permissive

-- Allow authenticated users to upload to reports bucket
CREATE POLICY "Upload reports" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'reports' 
  AND auth.role() = 'authenticated'
);

-- Allow anyone to view files in reports bucket (public access)
CREATE POLICY "View reports" ON storage.objects
FOR SELECT USING (bucket_id = 'reports');

-- Allow authenticated users to update files in reports bucket
CREATE POLICY "Update reports" ON storage.objects
FOR UPDATE WITH CHECK (
  bucket_id = 'reports' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files in reports bucket
CREATE POLICY "Delete reports" ON storage.objects
FOR DELETE USING (
  bucket_id = 'reports' 
  AND auth.role() = 'authenticated'
);
