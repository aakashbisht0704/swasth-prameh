-- Fix storage policies to match the actual file upload structure
-- Run this in your Supabase SQL editor

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can upload their own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own reports" ON storage.objects;

-- Create new policies that work with the actual file structure
-- Files are uploaded as: reports/{timestamp}_{filename}
-- Since the bucket is public, we'll use simpler policies

-- Allow authenticated users to upload to reports bucket
CREATE POLICY "Authenticated users can upload reports" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'reports' 
  AND auth.role() = 'authenticated'
);

-- Allow anyone to view files in reports bucket (since it's public)
CREATE POLICY "Anyone can view reports" ON storage.objects
FOR SELECT USING (bucket_id = 'reports');

-- Allow authenticated users to update files in reports bucket
CREATE POLICY "Authenticated users can update reports" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'reports' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files in reports bucket
CREATE POLICY "Authenticated users can delete reports" ON storage.objects
FOR DELETE USING (
  bucket_id = 'reports' 
  AND auth.role() = 'authenticated'
);
