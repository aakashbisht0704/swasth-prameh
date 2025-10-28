# Database Fix Summary

## Problem
Error: `Failed to save onboarding: Could not find the 'lifestyle' column of 'onboarding' in the schema cache.`

## Root Cause
The Supabase database schema was missing the `lifestyle` and `medical_history` columns in the `onboarding` table.

## Solution Applied

### 1. Created SQL Migration
**File:** `sql/add-lifestyle-columns.sql`
- Adds `lifestyle` column (JSONB) to store structured lifestyle assessment data
- Adds `medical_history` column (JSONB) to store medical history questionnaire data
- Creates GIN indexes for better query performance
- Includes helpful comments

### 2. Updated TypeScript Types
**File:** `src/lib/database.types.ts`
- Added `lifestyle: any | null` to Row type
- Added `medical_history: any | null` to Row type
- Updated Insert and Update types to include the new columns

### 3. Updated Service Layer
**File:** `src/lib/onboarding-service.ts`
- Added `lifestyle?: any` and `medical_history?: any` to `OnboardingInput` type
- Updated `saveOnboardingData` to include lifestyle and medical_history in the insert/update operation

## How to Apply the Fix

### Step 1: Run SQL Migration in Supabase
1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy the contents of `sql/add-lifestyle-columns.sql`
4. Paste and click **Run**

### Step 2: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 3: Test
Complete the onboarding form and verify that lifestyle and medical history data are being saved.

## Verification Query
Run this in Supabase SQL Editor to verify the columns were created:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'onboarding'
  AND column_name IN ('lifestyle', 'medical_history');
```

## Expected Structure

### `onboarding` Table After Migration
```sql
CREATE TABLE onboarding (
  -- ... existing columns ...
  lifestyle jsonb,              -- NEW
  medical_history jsonb,        -- NEW
  -- ... rest of columns ...
);
```

## Files Changed
1. ✅ `sql/add-lifestyle-columns.sql` (NEW)
2. ✅ `sql/MIGRATION_INSTRUCTIONS.md` (NEW)
3. ✅ `src/lib/database.types.ts` (UPDATED)
4. ✅ `src/lib/onboarding-service.ts` (UPDATED)

## Next Steps
After applying the migration:
- ✅ Database schema will be updated
- ✅ TypeScript types will match the database
- ✅ Onboarding service will save lifestyle and medical history data
- ✅ Users can complete the full onboarding process

