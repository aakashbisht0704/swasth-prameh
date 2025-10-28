# Storage RLS Policy Troubleshooting

## Error: "Upload failed: new row violates row-level security policy"

This error occurs because the storage bucket's Row Level Security (RLS) policies don't match your file upload structure.

## Quick Fix (Recommended)

### Option 1: Minimal Setup (Should work immediately)
1. Go to **Supabase SQL Editor**
2. Copy and paste contents of `minimal-storage-setup.sql`
3. Click **Run**

This creates the simplest possible policies that should work with your upload structure.

### Option 2: Simple Policies
1. Copy and paste contents of `simple-storage-policies.sql`
2. Click **Run**

This creates more explicit policies but still simple enough to work.

## Why This Happened

Your code uploads files like this:
```typescript
const filePath = `reports/${Date.now()}_${file.name}`;
```

But the original policies expected files organized by user ID:
```
reports/{user_id}/filename
```

## File Structure Comparison

### What Your Code Does:
```
reports/
├── 1703123456789_lab_report.pdf
├── 1703123456790_blood_test.jpg
└── 1703123456791_scan_results.png
```

### What Original Policies Expected:
```
reports/
├── user-uuid-1/
│   ├── lab_report.pdf
│   └── blood_test.jpg
└── user-uuid-2/
    └── scan_results.png
```

## Alternative: Fix the Code Instead

If you prefer to keep user-specific folders, update your `ReportUploadStep.tsx`:

```typescript
// Change this line:
const filePath = `reports/${Date.now()}_${file.name}`;

// To this:
const { data: { user } } = await supabase.auth.getUser();
const filePath = `reports/${user.id}/${Date.now()}_${file.name}`;
```

Then use the original `storage-bucket-setup.sql` policies.

## Verification

After running the fix:

1. **Go to your onboarding page**
2. **Navigate to Reports step**
3. **Try uploading a file**
4. **Should upload successfully**

## Security Considerations

### Minimal Setup (Public Access):
- ✅ Simple and works immediately
- ⚠️ Any authenticated user can upload/delete any file
- ✅ Files are timestamped, so conflicts are unlikely

### User-Specific Folders (More Secure):
- ✅ Each user can only access their own files
- ✅ Better isolation between users
- ⚠️ Requires code changes

## Which Approach to Choose?

### Use Minimal Setup If:
- You want to fix it quickly
- File conflicts are unlikely due to timestamps
- You trust your authenticated users

### Use User-Specific Folders If:
- You want maximum security
- Multiple users might upload files with similar names
- You prefer strict data isolation

## Next Steps

1. **Run the minimal setup script**
2. **Test file upload**
3. **If it works, you're done!**
4. **If you want more security later, switch to user-specific folders**

The minimal setup should resolve your upload issue immediately! 🎉
