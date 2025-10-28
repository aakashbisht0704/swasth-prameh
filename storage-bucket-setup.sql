-- Storage bucket setup for medical reports
-- Run this in your Supabase SQL editor

-- Create the 'reports' bucket for medical report uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for the reports bucket
-- Allow authenticated users to upload their own reports
CREATE POLICY "Users can upload their own reports" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to view their own reports
CREATE POLICY "Users can view their own reports" ON storage.objects
FOR SELECT USING (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to update their own reports
CREATE POLICY "Users can update their own reports" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to delete their own reports
CREATE POLICY "Users can delete their own reports" ON storage.objects
FOR DELETE USING (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
