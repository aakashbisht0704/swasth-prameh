# Complete Fix for All Current Issues

## 🐛 Issues Found

1. ❌ `Could not find the 'avatar_url' column of 'onboarding'` - Code trying to save avatar_url to onboarding table
2. ❌ `null value in column "user_id" violates not-null constraint` - user_profiles using wrong column
3. ❌ `500 error on /api/support/user-chats` - Foreign key reference issue
4. ❌ `400 error on user_profiles` - Schema mismatch

## ✅ Fixes Applied

### 1. Fixed Onboarding Form (`src/components/onboarding-form.tsx`)
- ✅ Changed `user_id` to `id` for user_profiles upsert
- ✅ Filtered out invalid fields (avatar_url, email, phone, role) from onboarding data
- ✅ Only includes valid onboarding fields
- ✅ Properly handles investigation data

### 2. Fixed Onboarding Schema (`sql/fix-onboarding-schema.sql`)
- ✅ Removes `avatar_url` column from onboarding (if exists)
- ✅ Ensures all required columns exist
- ✅ Adds investigation column if missing

### 3. Fixed Support API (`src/app/api/support/user-chats/route.ts`)
- ✅ Fixed foreign key references
- ✅ Explicitly selects only needed fields from user_profiles

## 📋 Deployment Steps

### Step 1: Run SQL Fixes (Supabase Dashboard)

Run these in order:

1. **Fix user_profiles schema:**
   ```sql
   -- File: sql/fix-user-profiles-schema-complete.sql
   ```

2. **Fix onboarding schema:**
   ```sql
   -- File: sql/fix-onboarding-schema.sql
   ```

### Step 2: Deploy Code

```bash
git add .
git commit -m "Fix all schema issues: onboarding, user_profiles, support API"
git push origin main
```

On server:
```bash
git pull origin main
docker compose build --no-cache web && docker compose up -d
```

## ✅ Verification

After deployment, test:

1. **Login:**
   - Should work without errors
   - No user_profiles errors

2. **Onboarding:**
   - Complete onboarding flow
   - Should save without "avatar_url" error
   - Should save without "user_id" error

3. **Support Chat:**
   - Click chat bubble
   - Should load chats without 500 error

4. **Dashboard:**
   - Should load without errors
   - All data should display correctly

## 🔍 What Was Fixed

### Onboarding Form:
- **Before:** Used `user_id` for user_profiles, included invalid fields
- **After:** Uses `id` for user_profiles, filters invalid fields

### Onboarding Table:
- **Before:** Had `avatar_url` column (wrong)
- **After:** Removed `avatar_url`, has all correct columns

### Support API:
- **Before:** Foreign key references might be wrong
- **After:** Explicit field selection, proper foreign keys

All issues should now be resolved! 🎉

