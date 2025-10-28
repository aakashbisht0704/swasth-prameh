# Quick Fix for Database Migration Error

## The Problem
You got this error:
```
ERROR: 42704: data type text has no default operator class for access method "gin"
```

This happened because the migration tried to create GIN indexes on JSONB columns incorrectly.

## The Solution

### Step 1: Run the Cleanup Script
1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `sql/fix-lifestyle-columns.sql`:
```sql
-- Fix lifestyle and medical_history columns in onboarding table
-- This script handles the case where previous migration failed

-- First, drop any failed indexes that might exist
DROP INDEX IF EXISTS idx_onboarding_lifestyle;
DROP INDEX IF EXISTS idx_onboarding_medical_history;

-- Add the columns (safe if they already exist)
ALTER TABLE onboarding
ADD COLUMN IF NOT EXISTS lifestyle jsonb,
ADD COLUMN IF NOT EXISTS medical_history jsonb;

-- Add comments to document the columns
COMMENT ON COLUMN onboarding.lifestyle IS 'Stores lifestyle assessment data (diet, exercise, sleep, stress)';
COMMENT ON COLUMN onboarding.medical_history IS 'Stores medical history questionnaire data';
```
3. Click **Run**

### Step 2: Verify the Fix
Run this query to verify the columns were added:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'onboarding'
  AND column_name IN ('lifestyle', 'medical_history');
```

You should see:
- `lifestyle` (jsonb, nullable)
- `medical_history` (jsonb, nullable)

### Step 3: Test the Application
1. Restart your Next.js dev server:
   ```bash
   # Press Ctrl+C to stop, then:
   npm run dev
   ```
2. Try completing the onboarding form again
3. The lifestyle and medical history data should now save correctly

## What Changed
- **Removed:** GIN index creation (causing the error)
- **Kept:** Column creation and documentation
- **Result:** Clean migration that just adds the necessary columns

The columns are now JSONB type without indexes. If you need indexes later for performance, they can be added with the proper operator class specification.

