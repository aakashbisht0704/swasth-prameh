# Fix Database Errors - Step by Step

## The Problem
You're getting a permission error with the `ALTER DATABASE` command, and you have existing tables that need to be replaced.

## Solution: Drop and Recreate Tables

### Step 1: Run the Quick Fix
1. Go to your Supabase SQL Editor
2. Copy and paste the contents of `quick-table-recreate.sql`
3. Click **Run**

This will:
- Drop existing `users`, `user_profiles`, and `onboarding` tables
- Create fresh tables with the correct structure
- Set up Row Level Security (RLS) policies
- Configure proper permissions

### Step 2: Verify the Setup
After running the script, check your Table Editor in Supabase:
- You should see 3 tables: `users`, `user_profiles`, `onboarding`
- Each table should have proper columns and relationships

### Step 3: Test Authentication
1. Start your Next.js app: `npm run dev`
2. Go to `http://localhost:3000/auth`
3. Try signing up with email/password
4. Verify you get redirected to onboarding

## Alternative: Full Setup (if you want all features)

If you want the complete setup with automatic triggers and functions:

1. Use `drop-and-recreate-tables.sql` instead
2. This includes automatic user creation triggers
3. Has more comprehensive error handling

## What's Fixed

### ❌ Before (Issues):
- Permission error with `ALTER DATABASE`
- Existing tables with wrong structure
- Missing `users` table causing auth failures

### ✅ After (Fixed):
- Clean table structure matching your code
- Proper RLS policies for security
- Working authentication system
- Correct redirects based on onboarding status

## Table Structure Created

### `users` table:
- `id` (UUID, primary key, references auth.users)
- `email` (TEXT, unique)
- `full_name` (TEXT)
- `phone` (TEXT, nullable)
- `onboarding_completed` (BOOLEAN)
- `created_at`, `updated_at` (timestamps)

### `user_profiles` table:
- `id` (UUID, primary key)
- `user_id` (UUID, references users.id)
- `full_name` (TEXT)
- `gender` (TEXT)
- `dob` (DATE, nullable)
- `created_at`, `updated_at` (timestamps)

### `onboarding` table:
- `id` (UUID, primary key)
- `user_id` (UUID, references users.id, unique)
- `age` (INTEGER)
- `gender` (TEXT)
- `diabetes_type` (TEXT)
- `diagnosis_date` (DATE)
- `current_medications` (TEXT array)
- `ayurvedic_experience` (BOOLEAN)
- `created_at`, `updated_at` (timestamps)

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Policies** ensure users can only access their own data
- **Foreign key constraints** maintain data integrity
- **Cascade deletes** clean up related data when users are removed

## Next Steps After Setup

1. **Test email/password authentication**
2. **Test phone OTP authentication** (if configured)
3. **Test Google OAuth** (if configured)
4. **Verify onboarding flow works**
5. **Check that completed users go to dashboard**
6. **Verify new users go to onboarding**

Your authentication system should now work perfectly!
