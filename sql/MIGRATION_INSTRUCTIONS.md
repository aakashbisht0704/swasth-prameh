# Database Migration Instructions

## Issue
The `onboarding` table is missing the `lifestyle` and `medical_history` columns that are required for the new questionnaire features.

## Solution
Run the SQL migration to add the missing columns to your Supabase database.

## Steps to Apply Migration

### If you got an error about GIN indexes:
1. Run `sql/fix-lifestyle-columns.sql` first to clean up any failed indexes
2. Then run `sql/add-lifestyle-columns.sql`

### Option 1: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. If you got the GIN index error, run `sql/fix-lifestyle-columns.sql` first
4. Then open the file `sql/add-lifestyle-columns.sql`
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **Run**

### Option 2: Using Supabase CLI
```bash
supabase db push
```

### What the Migration Does
- Adds `lifestyle` column (JSONB) to store structured lifestyle assessment data
- Adds `medical_history` column (JSONB) to store structured medical history questionnaire data
- Creates GIN indexes for better query performance on these JSONB columns
- Adds helpful comments to document the columns

## Verification
After running the migration, verify the columns exist:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'onboarding'
  AND column_name IN ('lifestyle', 'medical_history');
```

Expected output:
- `lifestyle` (jsonb, nullable)
- `medical_history` (jsonb, nullable)

## Data Structure

### `lifestyle` Column
Stores data from the Lifestyle questionnaire (Sections 1-4):
```json
{
  "mealsPerDay": "2",
  "dietType": "vegetarian",
  "sweetsFrequency": "occasionally",
  "friedFoodFrequency": "weekly",
  "freshFruitsFrequency": "daily",
  "regularMealTimes": "yes",
  "digestiveCapacity": "medium",
  "exercisesRegularly": "yes",
  "exerciseType": "Yoga, Walking",
  "exerciseFrequency": "3-5_times",
  "hoursSitting": "4-6",
  "hoursOfSleep": "7-9",
  "feelsRested": "sometimes",
  "difficultySleeping": "no",
  "stressFrequency": "often",
  "stressManagement": "Meditation, Pranayama",
  "feelsAnxious": "yes"
}
```

### `medical_history` Column
Stores data from the Medical History questionnaire (Section 5):
```json
{
  "familyHistory": {
    "diabetes": true,
    "other": "Hypertension"
  },
  "pastHistory": "Hypertension diagnosed in 2015",
  "surgicalHistory": "Appendicectomy in 2010",
  "allergies": "None",
  "occupationalHistory": "Software Engineer, sedentary work",
  "chiefComplaint": "Difficulty managing blood sugar levels",
  "menstrualHistory": "Regular cycles, 28 days",
  "gestationalDiabetes": false
}
```

## Troubleshooting

### Error: Column already exists
If you see an error that the column already exists, it means the migration was already applied. You can safely ignore this or run:
```sql
-- Check if columns exist
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'onboarding' 
  AND column_name IN ('lifestyle', 'medical_history');
```

### Error: Permission denied
Make sure you're running the migration with the appropriate database role. Use the Supabase dashboard SQL Editor for the highest privileges.

## Next Steps
After running the migration:
1. Restart your Next.js development server
2. The onboarding form should now save lifestyle and medical history data correctly
3. Test by completing the onboarding process

