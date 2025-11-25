# Complete Schema Fix Guide

## 🚨 Problem
Multiple schema conflicts causing errors:
- `null value in column "user_id" violates not-null constraint`
- `Could not find the 'email' column`
- `infinite recursion detected in policy`

## 🔍 Root Cause
Your database has **TWO different schemas** for `user_profiles`:

**Old Schema:**
- `id` = auto-generated UUID (primary key)
- `user_id` = UUID NOT NULL (references users.id)
- Has `gender`, `dob`
- Missing `email`, `role`, `phone`, `avatar_url`

**New Schema (what code expects):**
- `id` = UUID (references auth.users.id directly, primary key)
- NO `user_id` column
- Has `email`, `role`, `phone`, `avatar_url`
- Optional `gender`, `dob` for backward compatibility

## ✅ Solution: Run Complete Migration

### Step 1: Run Comprehensive Schema Fix

Go to **Supabase Dashboard → SQL Editor** and run:

**File:** `sql/fix-user-profiles-schema-complete.sql`

This script will:
1. ✅ Detect which schema you have
2. ✅ Migrate from old to new schema if needed
3. ✅ Add all missing columns (email, role, phone, avatar_url)
4. ✅ Fix all foreign key relationships
5. ✅ Fix RLS policies (no recursion)
6. ✅ Preserve existing data
7. ✅ Create proper indexes

### Step 2: Verify Migration

After running, verify with:

```sql
-- Check schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

-- Check data migrated correctly
SELECT id, email, role, full_name 
FROM user_profiles 
LIMIT 5;

-- Check no user_id column exists
SELECT column_name 
FROM information_schema.columns
WHERE table_name = 'user_profiles' AND column_name = 'user_id';
-- Should return 0 rows
```

### Step 3: Deploy Code

```bash
git pull origin main
docker compose build --no-cache web && docker compose up -d
```

## 📋 What Gets Fixed

### Schema Changes:
- ✅ Removes `user_id` column (if exists)
- ✅ Makes `id` reference `auth.users(id)` directly
- ✅ Adds `email` column
- ✅ Adds `role` column (default: 'user')
- ✅ Adds `phone` column
- ✅ Adds `avatar_url` column
- ✅ Keeps `gender`, `dob` for compatibility

### Foreign Keys:
- ✅ `support_chats.user_id` → `user_profiles.id`
- ✅ `support_messages.sender_id` → `user_profiles.id`
- ✅ All other references updated

### RLS Policies:
- ✅ No recursion (uses security definer functions)
- ✅ Users can view/update own profile
- ✅ Support/admin can view all profiles
- ✅ Admins can update any profile

### Data Migration:
- ✅ Preserves all existing user data
- ✅ Populates email from auth.users
- ✅ Sets default role to 'user'
- ✅ Maintains created_at/updated_at

## ⚠️ Important Notes

1. **Backup First:** The migration preserves data, but backup your database first if possible.

2. **Downtime:** The migration should be quick (< 1 minute), but there may be brief downtime.

3. **Test After:** Test login and user creation after migration.

4. **If Migration Fails:** Check the error message. Common issues:
   - Foreign key constraints (tables referencing user_profiles)
   - Existing data conflicts
   - Permission issues

## 🐛 Troubleshooting

### If migration fails:

1. **Check current schema:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'user_profiles';
   ```

2. **Check foreign key dependencies:**
   ```sql
   SELECT 
     tc.table_name, 
     kcu.column_name,
     ccu.table_name AS foreign_table_name
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
     ON ccu.constraint_name = tc.constraint_name
   WHERE tc.constraint_type = 'FOREIGN KEY'
     AND ccu.table_name = 'user_profiles';
   ```

3. **Manual fix if needed:**
   - Drop foreign keys temporarily
   - Run migration
   - Recreate foreign keys

## ✅ Success Criteria

After migration, you should be able to:
- ✅ Login without errors
- ✅ Create new users
- ✅ View user profiles
- ✅ Use support chat system
- ✅ Access admin panel (if admin)

## 📝 Alternative: Quick Fix (If Migration Too Complex)

If the comprehensive migration is too complex, you can:

1. **Just add missing columns:**
   ```sql
   ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email TEXT;
   ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
   ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
   ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
   ```

2. **Make user_id nullable (temporary):**
   ```sql
   ALTER TABLE user_profiles ALTER COLUMN user_id DROP NOT NULL;
   ```

3. **Then run RLS fix:**
   ```sql
   -- Run sql/fix-user-profiles-rls-recursion.sql
   ```

But the comprehensive migration is recommended for a clean fix.

