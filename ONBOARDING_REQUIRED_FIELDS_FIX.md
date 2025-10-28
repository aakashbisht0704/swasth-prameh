# Onboarding Required Fields Fix

## Error: "null value in column 'age' of relation 'onboarding' violates not-null constraint"

This error occurs because the database requires certain fields that weren't being collected in the onboarding process.

## What Was Missing

The database schema requires these fields as NOT NULL:
- `age` (INTEGER)
- `diabetes_type` (TEXT) 
- `diagnosis_date` (DATE)

But the `ProfileDetailsStep` was only collecting:
- `full_name`
- `gender`

## What Was Fixed

### Updated ProfileDetailsStep.tsx

The Profile Details step now collects all required fields:

1. **Full Name** - Text input
2. **Age** - Number input (1-120)
3. **Gender** - Select dropdown (Male/Female/Other)
4. **Type of Diabetes** - Select dropdown:
   - Type 1 Diabetes
   - Type 2 Diabetes
   - Gestational Diabetes
   - Prediabetes
   - Other
5. **Diagnosis Date** - Date picker

### Form Validation

All fields are now marked as `required`, so users must fill them out before proceeding to the next step.

## Database Fields Status

### Required Fields (NOT NULL) - ✅ Now Collected:
- `age` - Collected in ProfileDetailsStep
- `diabetes_type` - Collected in ProfileDetailsStep  
- `diagnosis_date` - Collected in ProfileDetailsStep

### Required Fields (NOT NULL) - ✅ Already Working:
- `user_id` - Set automatically from auth
- `gender` - Collected in ProfileDetailsStep

### Optional Fields (with defaults) - ✅ Working:
- `current_medications` - Defaults to empty array `[]`
- `ayurvedic_experience` - Defaults to `false`

## Complete Onboarding Flow

Now your onboarding process collects all required data:

1. **Profile Details** → `full_name`, `age`, `gender`, `diabetes_type`, `diagnosis_date`
2. **Prakriti Assessment** → `prakriti_vata`, `prakriti_pitta`, `prakriti_kapha`
3. **Medical History** → `medical_history`
4. **Report Upload** → `report_url`
5. **Ashtvidha Pariksha** → `nadi`, `mutra`, `mala`, `jihwa`, `shabda`, `sparsha`, `drik`, `akriti`
6. **Lifestyle** → `diet`, `exercise`, `sleep`

## Testing the Fix

1. **Go to your onboarding page**
2. **Fill out the Profile Details step:**
   - Enter your full name
   - Select your age
   - Choose your gender
   - Select your diabetes type
   - Pick your diagnosis date
3. **Complete all remaining steps**
4. **Click "Finish"**
5. **Should save successfully and redirect to dashboard**

## Form Improvements

### Age Field:
- Number input with min/max validation (1-120)
- Converts to integer before saving

### Diabetes Type:
- Comprehensive dropdown with common diabetes types
- Includes options for different conditions

### Diagnosis Date:
- HTML5 date picker for easy date selection
- Validates date format automatically

## Data Validation

The form now ensures:
- ✅ All required fields are filled
- ✅ Age is a valid number
- ✅ Diagnosis date is a valid date
- ✅ Diabetes type is selected from predefined options
- ✅ Data types match database expectations

Your onboarding process should now work completely without any database constraint errors! 🎉
