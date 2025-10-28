# Storage Bucket Setup Guide

## Issue: Missing Storage Bucket for Medical Reports

Your onboarding process includes a step where users upload medical reports, but the Supabase storage bucket doesn't exist yet.

## Bucket Details from Your Code

Based on your `ReportUploadStep.tsx` component, here are the required details:

### **Bucket Name:** `reports`
### **File Path Structure:** `reports/{timestamp}_{filename}`
### **Supported File Types:** PDF, JPG, JPEG, PNG
### **Access:** Public bucket with user-specific policies

## Quick Setup

### Option 1: Using SQL (Recommended)

1. **Go to your Supabase SQL Editor**
2. **Copy and paste the contents of `storage-bucket-setup.sql`**
3. **Click "Run"**

This will:
- ✅ Create the `reports` bucket
- ✅ Set up proper security policies
- ✅ Allow users to upload/view only their own reports
- ✅ Make the bucket public for easy access

### Option 2: Using Supabase Dashboard

1. **Go to Storage in your Supabase dashboard**
2. **Click "New bucket"**
3. **Name:** `reports`
4. **Public bucket:** ✅ Check this box
5. **Click "Create bucket"**
6. **Go to "Policies" tab**
7. **Create the following policies:**

```sql
-- Upload policy
CREATE POLICY "Users can upload their own reports" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- View policy
CREATE POLICY "Users can view their own reports" ON storage.objects
FOR SELECT USING (
  bucket_id = 'reports' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## How It Works in Your App

### File Upload Process:
1. User selects a medical report file (PDF, JPG, PNG)
2. File gets uploaded to `reports/{timestamp}_{filename}`
3. Public URL is generated and stored in the onboarding data
4. User can view the uploaded report via the generated URL

### Security Features:
- **User Isolation:** Each user can only access their own uploaded files
- **Authenticated Access:** Only logged-in users can upload files
- **Public URLs:** Uploaded files are accessible via public URLs for easy viewing

### File Organization:
```
reports/
├── 1703123456789_lab_report.pdf
├── 1703123456790_blood_test.jpg
└── 1703123456791_scan_results.png
```

## Code Reference

From your `ReportUploadStep.tsx`:

```typescript
// Upload file to reports bucket
const filePath = `reports/${Date.now()}_${file.name}`;
const { error } = await supabase.storage.from('reports').upload(filePath, file);

// Get public URL for the uploaded file
const { data } = supabase.storage.from('reports').getPublicUrl(filePath);
```

## Verification

After setting up the bucket:

1. **Go to Storage in Supabase dashboard**
2. **You should see the `reports` bucket listed**
3. **Test the onboarding flow:**
   - Go to your app's onboarding page
   - Navigate to the "Reports" step
   - Try uploading a test file
   - Verify it appears in the `reports` bucket

## Troubleshooting

### If upload fails:
- Check that the bucket exists and is public
- Verify RLS policies are set up correctly
- Ensure user is authenticated

### If files aren't accessible:
- Check that the bucket is marked as public
- Verify the public URL generation is working
- Check file permissions in the storage bucket

### If users can't upload:
- Ensure they're logged in
- Check that storage policies allow INSERT operations
- Verify the file types are supported (PDF, JPG, PNG)

## Storage Usage

### File Size Limits:
- Default Supabase limit: 50MB per file
- For larger files, you may need to increase limits in project settings

### Storage Costs:
- Supabase provides 1GB free storage
- Additional storage is billed based on usage

Your medical report upload feature should now work perfectly!
