# Deployment Fixes - RLS Recursion & Investigation Integration

## 🐛 Issue 1: Infinite Recursion in RLS Policy

**Error:** `infinite recursion detected in policy for relation "user_profiles"`

**Cause:** The RLS policies for `user_profiles` were checking user roles by querying `user_profiles` again, causing infinite recursion.

**Fix:** Use security definer functions to bypass RLS when checking roles.

### Steps to Fix:

1. **Go to Supabase Dashboard → SQL Editor**
2. **Run the fix script:**
   ```sql
   -- File: sql/fix-user-profiles-rls-recursion.sql
   ```
3. **Verify the fix:**
   ```sql
   -- Test that policies work
   SELECT * FROM user_profiles WHERE id = auth.uid();
   ```

## 🔄 Issue 2: Investigation Step Integration

**Change:** Investigation wizard is now part of the Prakriti step, shown before Prakriti questions.

**Implementation:**
- Investigation wizard appears first when user reaches Prakriti step
- After completing investigation, user proceeds to Prakriti questions
- Investigation data is saved along with Prakriti data
- Investigation does NOT affect Prakriti calculation

### Code Changes:
- `PrakritiMultiStepForm.tsx` - Now includes Investigation wizard
- `onboarding/index.tsx` - Removed Investigation as separate step

## 📋 Deployment Steps

### 1. Fix RLS Recursion (CRITICAL - Do First!)

```sql
-- Run in Supabase SQL Editor
-- File: sql/fix-user-profiles-rls-recursion.sql
```

### 2. Deploy Code Changes

```bash
# On your server
cd /root/swasth-prameh
git pull origin main
docker compose build --no-cache web
docker compose up -d
```

### 3. Verify Fixes

1. **Test Login:**
   - Sign in with email
   - Should NOT see recursion error
   - User profile should load correctly

2. **Test Onboarding:**
   - Start onboarding
   - Reach Prakriti step
   - Should see Investigation wizard first
   - Complete investigation
   - Then see Prakriti questions
   - Complete Prakriti assessment
   - Verify both investigation and prakriti data saved

## ✅ Verification Checklist

- [ ] RLS recursion error fixed (login works)
- [ ] Investigation appears before Prakriti questions
- [ ] Investigation data saves correctly
- [ ] Prakriti calculation works (not affected by investigation)
- [ ] Both investigation and prakriti data in database
- [ ] Dashboard shows investigation data correctly

## 🚨 Rollback Plan

If issues occur:

```sql
-- Rollback RLS policies (if needed)
-- Revert to original policies from create-support-system.sql
```

```bash
# Rollback code
git checkout HEAD~1
docker compose build --no-cache web
docker compose up -d web
```

