# Fix: Missing Email Column in user_profiles

## Error
```
Could not find the 'email' column of 'user_profiles' in the schema cache
```

## Cause
The `user_profiles` table was created without the `email` column, or the schema cache is out of sync.

## Solution

### Option 1: Run the Updated RLS Fix (Recommended)
The RLS fix script now includes email column creation:

1. Go to **Supabase Dashboard → SQL Editor**
2. Run: `sql/fix-user-profiles-rls-recursion.sql`
   - This will:
     - Add email column if missing
     - Fix RLS recursion
     - Populate email from auth.users

### Option 2: Run Email Column Fix Only
If you only need to add the email column:

1. Go to **Supabase Dashboard → SQL Editor**
2. Run: `sql/add-email-to-user-profiles.sql`

### Option 3: Manual SQL
```sql
-- Add email column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Populate email from auth.users for existing records
UPDATE user_profiles up
SET email = au.email
FROM auth.users au
WHERE up.id = au.id AND up.email IS NULL;
```

## After Running SQL

1. **Wait 10-30 seconds** for schema cache to update
2. **Refresh your browser** or clear cache
3. **Test login** again

## Verify Fix

```sql
-- Check if email column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND column_name = 'email';

-- Check if emails are populated
SELECT id, email, full_name, role 
FROM user_profiles 
LIMIT 5;
```

## If Still Not Working

1. **Clear Supabase schema cache:**
   - Go to Settings → API
   - Click "Regenerate API types" or wait for auto-refresh

2. **Check table structure:**
   ```sql
   SELECT column_name, data_type, is_nullable
   FROM information_schema.columns
   WHERE table_name = 'user_profiles'
   ORDER BY ordinal_position;
   ```

3. **Verify RLS policies:**
   ```sql
   SELECT policyname, cmd, qual
   FROM pg_policies
   WHERE tablename = 'user_profiles';
   ```

