# Complete Database Fix Guide

Run these SQL scripts **in order** to fix all database-related errors:

## 1. Fix Chat Messages Table (Required)
**File:** `sql/chat-messages-fix.sql`

Fixes:
- ❌ Database insert error: {}
- ❌ Error fetching messages: {}
- ❌ 400 Bad Request on chat_messages

Creates the `chat_messages` table with all required columns including `admin_id`.

---

## 2. Fix RLS Policies (Required)
**File:** `sql/fix-all-rls-policies.sql`

Fixes:
- ❌ 403 Forbidden on chat_messages
- ❌ 403 Forbidden on plans
- ❌ Database connection test failed

Updates RLS policies to be permissive for development (you can tighten them later for production).

---

## 3. Fix Meal Logging & Yoga Videos (Required for Dashboard Tabs)
**File:** `sql/fix-meal-yoga-tables.sql`

Fixes:
- ❌ 404 Not Found on meal_logs
- ❌ Error loading meals
- ❌ Error adding meal

Creates:
- `meal_logs` table for tracking meals
- `yoga_videos` table with 8 sample videos
- Permissive RLS policies
- Automatic timestamp triggers

---

## Quick Setup (Run All 3 Scripts)

### Option A: Copy All Scripts Together
1. Go to Supabase Dashboard → SQL Editor
2. Click "New query"
3. Copy and paste all 3 files in order:
   - `sql/chat-messages-fix.sql`
   - `sql/fix-all-rls-policies.sql`
   - `sql/fix-meal-yoga-tables.sql`
4. Click "Run"

### Option B: Run Each Script Separately
1. Run `sql/chat-messages-fix.sql`
2. Wait for success
3. Run `sql/fix-all-rls-policies.sql`
4. Wait for success
5. Run `sql/fix-meal-yoga-tables.sql`
6. Done!

---

## Verify Everything Works

After running all scripts, test:

### ✅ Chat Messages
```sql
SELECT COUNT(*) FROM chat_messages;
-- Should return 0 (empty table)
```

### ✅ Plans Table
```sql
SELECT COUNT(*) FROM plans;
-- Should work without 403 error
```

### ✅ Meal Logs
```sql
SELECT COUNT(*) FROM meal_logs;
-- Should return 0 (empty table)
```

### ✅ Yoga Videos
```sql
SELECT COUNT(*) FROM yoga_videos;
-- Should return 8 (sample videos)
```

---

## After Running Scripts

1. **Hard refresh** your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Go to Dashboard
3. Test each feature:
   - ✅ Click "Get AI Recommendations" - should work
   - ✅ Go to Meal Logging tab - should load
   - ✅ Add a meal - should save
   - ✅ Go to Yoga Videos tab - should show 8 videos
   - ✅ Chat widget - should open and allow messages

---

## Code Changes Already Applied

TypeScript types have been updated in `src/lib/database.types.ts` to include:
- ✅ `chat_messages` table
- ✅ `meal_logs` table
- ✅ `yoga_videos` table
- ✅ `plans` table
- ✅ `diagnosis` table

Dashboard code has been fixed:
- ✅ ChatWidget now receives userId prop
- ✅ ErrorFallback has resetError function
- ✅ Enhanced error logging in assistant page

---

## If You Still See Errors

### 403 Forbidden
- Re-run `sql/fix-all-rls-policies.sql`
- Make sure you're logged in

### 404 Not Found
- Re-run the table creation script
- Check which table is missing
- Verify in Supabase Dashboard → Table Editor

### Empty Error Objects {}
- Check browser console for detailed error logs
- Look for "Error details:" logs with code/message/hint

---

## Production Security (Later)

These scripts use permissive RLS policies (`USING (true)`) for easy development.

For production, tighten them:
```sql
-- Example: Users can only see their own data
CREATE POLICY "users_own_data" ON meal_logs
  FOR SELECT USING (auth.uid() = user_id);
```

But for now, keep them permissive to get everything working!






