# Fix Meal Logging & Yoga Videos

## Problem
You're seeing **404 Not Found** errors when:
- Loading meals in the Meal Logging tab
- Adding new meal logs
- Loading yoga videos

This means the `meal_logs` and `yoga_videos` tables don't exist in your database.

## Quick Solution

### Run this SQL script in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy and paste the contents of `sql/fix-meal-yoga-tables.sql`
5. Click "Run" or press `Ctrl+Enter`

## What This Script Does

1. ✅ **Creates `meal_logs` table** with:
   - User ID reference
   - Meal type (breakfast/lunch/dinner/snack)
   - Food items
   - Quantity and notes
   - Timestamps

2. ✅ **Creates `yoga_videos` table** with:
   - Title, description
   - Video URL (YouTube embeds)
   - Duration
   - Difficulty level (beginner/intermediate/advanced)
   - Category

3. ✅ **Sets up permissive RLS policies** to avoid 403 errors

4. ✅ **Inserts 8 sample yoga videos** including:
   - Morning Yoga for Beginners
   - Diabetes-Friendly Yoga Flow
   - Evening Relaxation Yoga
   - Pranayama Breathing Exercises
   - Chair Yoga for Seniors
   - Advanced Vinyasa Flow
   - Yoga for Blood Sugar Control
   - Gentle Stretching for Diabetes

5. ✅ **Adds triggers** for automatic `updated_at` timestamp updates

## TypeScript Types Updated

The `src/lib/database.types.ts` file has been updated to include:
- `meal_logs` table types
- `yoga_videos` table types

This ensures TypeScript type safety when working with these tables.

## After Running the Script

1. Refresh your browser
2. Go to Dashboard → Meal Logging tab
3. Try adding a meal - it should save successfully
4. Go to Dashboard → Yoga Videos tab
5. You should see 8 sample videos

## Features Now Working

### Meal Logging Tab
- ✅ Log breakfast, lunch, dinner, and snacks
- ✅ Track food items and quantities
- ✅ Add notes for each meal
- ✅ View meal history
- ✅ Delete meal entries

### Yoga Videos Tab
- ✅ Browse yoga videos by category
- ✅ Filter by difficulty level
- ✅ Watch embedded YouTube videos
- ✅ See duration and description for each video

## Troubleshooting

If you still see 404 errors:
1. Verify the tables were created: Run `SELECT * FROM meal_logs LIMIT 1;`
2. Check permissions: Make sure the SQL script ran completely
3. Hard refresh your browser: `Ctrl+Shift+R`

If you see 403 errors instead:
1. The RLS policies should be permissive
2. Run the `sql/fix-all-rls-policies.sql` script as well






