# Complete Storage Setup for Medical Reports

## What You Need to Set Up

Your onboarding process has a medical report upload step that requires:

1. **Storage Bucket**: `reports` bucket in Supabase Storage
2. **Database Field**: `report_url` column in the `onboarding` table
3. **Security Policies**: Proper access controls for file uploads

## Quick Setup (Run Both Scripts)

### Step 1: Add the Database Field
1. Go to **Supabase SQL Editor**
2. Copy and paste contents of `add-report-url-field.sql`
3. Click **Run**

### Step 2: Create the Storage Bucket
1. Copy and paste contents of `storage-bucket-setup.sql`
2. Click **Run**

## What Gets Created

### Database Changes:
- ✅ Adds `report_url TEXT` column to `onboarding` table
- ✅ Updates TypeScript types to include the new field

### Storage Bucket:
- ✅ Creates `reports` bucket (public access)
- ✅ Sets up security policies for user-specific file access
- ✅ Allows authenticated users to upload/view their own reports only

## How It Works

### File Upload Flow:
1. User selects a medical report file (PDF, JPG, PNG)
2. File gets uploaded to `reports/{timestamp}_{filename}`
3. Public URL is generated and stored in `onboarding.report_url`
4. User can view uploaded report via the stored URL

### Security:
- **User Isolation**: Each user can only access their own files
- **Authenticated Upload**: Only logged-in users can upload
- **Public URLs**: Files are accessible via public URLs for viewing

## File Structure

```
Supabase Storage:
reports/
├── 1703123456789_lab_report.pdf
├── 1703123456790_blood_test.jpg
└── 1703123456791_scan_results.png

Database:
onboarding table:
├── user_id
├── age, gender, diabetes_type, etc.
└── report_url (NEW FIELD)
```

## Verification Steps

### 1. Check Database:
- Go to **Table Editor** → `onboarding` table
- Verify `report_url` column exists

### 2. Check Storage:
- Go to **Storage** in Supabase dashboard
- Verify `reports` bucket exists and is public

### 3. Test Upload:
- Go to your app's onboarding page
- Navigate to "Reports" step
- Try uploading a test file
- Verify it appears in the `reports` bucket

## Code Reference

Your `ReportUploadStep.tsx` component expects:

```typescript
// Bucket name: 'reports'
const { error } = await supabase.storage.from('reports').upload(filePath, file);

// File path format: 'reports/{timestamp}_{filename}'
const filePath = `reports/${Date.now()}_${file.name}`;

// Stored in onboarding.report_url
onNext({ report_url: uploadedUrl });
```

## Troubleshooting

### Upload Fails:
- ✅ Bucket exists and is public
- ✅ User is authenticated
- ✅ File type is supported (PDF, JPG, PNG)
- ✅ Storage policies allow INSERT

### Can't View Files:
- ✅ Bucket is marked as public
- ✅ Public URL generation works
- ✅ File was uploaded successfully

### Database Errors:
- ✅ `report_url` column exists in `onboarding` table
- ✅ TypeScript types are updated
- ✅ User has permission to update onboarding data

## File Size & Limits

- **Max file size**: 50MB (default Supabase limit)
- **Supported formats**: PDF, JPG, JPEG, PNG
- **Storage quota**: 1GB free, then billed usage

## Next Steps

After running both setup scripts:
1. Test the complete onboarding flow
2. Upload a medical report
3. Verify it's accessible via the generated URL
4. Complete onboarding and check dashboard

Your medical report upload feature should now work perfectly! 🎉
