# Onboarding Schema Fix

## Error: "Could not find the 'akriti' column of 'onboarding' in the schema cache"

This error occurs because your onboarding process collects many more fields than what exists in your current database schema.

## What's Missing

Your onboarding steps collect these fields that aren't in your database:

### From PrakritiStep:
- `prakriti_vata` - Vata dosha assessment
- `prakriti_pitta` - Pitta dosha assessment  
- `prakriti_kapha` - Kapha dosha assessment

### From MedicalHistoryStep:
- `medical_history` - Medical history description

### From ParikshaStep (Ashtvidha Pariksha):
- `nadi` - Pulse assessment
- `mutra` - Urine assessment
- `mala` - Stool assessment
- `jihwa` - Tongue assessment
- `shabda` - Voice assessment
- `sparsha` - Touch assessment
- `drik` - Vision assessment
- `akriti` - Build assessment (this is the missing field causing the error)

### From LifestyleStep:
- `diet` - Diet description
- `exercise` - Exercise routine
- `sleep` - Sleep pattern

### From ReportUploadStep:
- `report_url` - Medical report file URL

## Quick Fix

### Step 1: Update Database Schema
1. Go to **Supabase SQL Editor**
2. Copy and paste contents of `complete-onboarding-schema.sql`
3. Click **Run**

This adds all 16 missing columns to your `onboarding` table.

### Step 2: Verify the Fix
After running the script:
1. Go to **Table Editor** → `onboarding` table
2. You should see all the new columns listed
3. Try completing the onboarding process again

## Complete Onboarding Flow

Your onboarding process has 6 steps:

1. **Profile Details** → `full_name`, `gender`
2. **Prakriti Assessment** → `prakriti_vata`, `prakriti_pitta`, `prakriti_kapha`
3. **Medical History** → `medical_history`
4. **Report Upload** → `report_url`
5. **Ashtvidha Pariksha** → `nadi`, `mutra`, `mala`, `jihwa`, `shabda`, `sparsha`, `drik`, `akriti`
6. **Lifestyle** → `diet`, `exercise`, `sleep`

## Database Schema After Fix

```sql
onboarding table:
├── id (UUID, primary key)
├── user_id (UUID, references users.id)
├── age, gender, diabetes_type, diagnosis_date
├── current_medications (array)
├── ayurvedic_experience (boolean)
├── report_url (TEXT, nullable) ← NEW
├── prakriti_vata (TEXT, nullable) ← NEW
├── prakriti_pitta (TEXT, nullable) ← NEW
├── prakriti_kapha (TEXT, nullable) ← NEW
├── medical_history (TEXT, nullable) ← NEW
├── nadi (TEXT, nullable) ← NEW
├── mutra (TEXT, nullable) ← NEW
├── mala (TEXT, nullable) ← NEW
├── jihwa (TEXT, nullable) ← NEW
├── shabda (TEXT, nullable) ← NEW
├── sparsha (TEXT, nullable) ← NEW
├── drik (TEXT, nullable) ← NEW
├── akriti (TEXT, nullable) ← NEW (this was causing the error)
├── diet (TEXT, nullable) ← NEW
├── exercise (TEXT, nullable) ← NEW
├── sleep (TEXT, nullable) ← NEW
├── created_at, updated_at (timestamps)
```

## What Gets Fixed

### Before (Issues):
- ❌ Missing `akriti` column causing save failures
- ❌ Missing 15 other onboarding fields
- ❌ Incomplete data collection
- ❌ TypeScript types don't match database

### After (Fixed):
- ✅ All onboarding fields exist in database
- ✅ Complete data collection works
- ✅ TypeScript types match database schema
- ✅ Onboarding completion works properly

## Testing After Fix

1. **Go to your onboarding page**
2. **Complete all 6 steps:**
   - Profile Details
   - Prakriti Assessment (select answers for Vata, Pitta, Kapha)
   - Medical History (enter some text)
   - Upload a medical report
   - Ashtvidha Pariksha (select answers for all 8 assessments including Akriti)
   - Lifestyle (enter diet, exercise, sleep descriptions)
3. **Click "Finish"**
4. **Should save successfully and redirect to dashboard**

## TypeScript Types Updated

The `database.types.ts` file has been updated to include all the new fields, so your TypeScript code will have proper type checking.

Your complete onboarding system should now work perfectly! 🎉
