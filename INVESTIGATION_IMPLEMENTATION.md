# Investigation Step Implementation

## Overview
A comprehensive Investigation step has been added to the onboarding flow, positioned after the Prakriti assessment and before Medical History. This step collects clinical details, medical history, and detailed dietary habits.

## Database Changes

### Migration
Run the SQL migration to add the `investigation` JSONB column:
```sql
-- File: sql/add-investigation-column.sql
ALTER TABLE onboarding 
ADD COLUMN IF NOT EXISTS investigation JSONB;

CREATE INDEX IF NOT EXISTS idx_onboarding_investigation 
ON onboarding USING GIN (investigation);
```

## Components Created

### 1. InvestigationWizard (`src/components/onboarding/InvestigationWizard.tsx`)
- Main orchestrator component
- Manages multi-step flow with progress indicator
- Handles data aggregation and submission

### 2. ClinicalDetailsStep (`src/components/onboarding/Investigation/ClinicalDetailsStep.tsx`)
- Collects HbA1c, FBS, PPBS values
- Diabetes type selection
- Validation: At least one clinical value required
- HbA1c range: 3.0-20.0
- FBS/PPBS range: 20-1000 mg/dL

### 3. MedicalHistoryStep (`src/components/onboarding/Investigation/MedicalHistoryStep.tsx`)
- Duration of diabetes (years)
- Current medications (Oral tablets, Insulin, Both, None)
- Recent sugar fluctuations (Yes/No)

### 4. DietaryHabitsStep (`src/components/onboarding/Investigation/DietaryHabitsStep.tsx`)
Comprehensive dietary assessment including:
- Daily meal pattern (meals per day, fixed timing, skip meals)
- Food composition (breakfast, lunch, dinner types, snack preferences)
- Sugar & carbohydrate intake (sweets, sugary drinks, refined foods)
- Oil, ghee & fat intake (cooking oil, deep-fried frequency)
- Salt & taste preferences
- Water & beverage habits
- Eating behaviors (speed, multitasking, appetite)
- Night routine & digestion
- Skin health (boils assessment)
- Diabetes medication (with name and dose if applicable)
- Others (optional free text)

**Required Fields:**
- meals_per_day
- water_intake
- cooking_oil
- on_diabetes_medication
- medication_name_and_dose (if on medication)

### 5. ReviewSubmitStep (`src/components/onboarding/Investigation/ReviewSubmitStep.tsx`)
- Displays summary of all entered data
- Allows editing any section
- Final submission

## API Endpoints

### POST `/api/investigation/save`
Saves investigation data to `onboarding.investigation` JSONB field.

**Request:**
```json
{
  "investigation": {
    "clinical": { ... },
    "medical_history": { ... },
    "dietary_habits": { ... },
    "meta": { ... }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### GET `/api/investigation/:userId`
Retrieves investigation data for a user.

## Integration Points

### 1. Dashboard (`src/app/dashboard/page.tsx`)
- Displays investigation dietary habits in Lifestyle section
- Shows water intake and cooking oil preferences
- Integrates with LifestyleAdvice component

### 2. Lifestyle Advice (`src/components/dashboard/LifestyleAdvice.tsx`)
- Updated to accept `investigation` prop
- Includes dietary habits and clinical data in AI prompt
- Provides personalized Ayurvedic insights

### 3. Plan Generation (`src/app/api/plans/generate/route.ts`)
- Investigation data included in context object
- LLM uses dietary habits for meal plan customization
- Considers cooking oil preferences, meal timings, snack preferences

### 4. Assistant Chat (`src/app/api/assistant/chat/route.ts`)
- Investigation data automatically included via onboarding context
- LLM server receives full context including investigation

### 5. Lifestyle Advice API (`src/app/api/lifestyle/advice/route.ts`)
- Updated to accept and use investigation data
- Includes dietary habits, clinical values in prompt
- Provides more comprehensive Ayurvedic recommendations

## Data Schema

The investigation data is stored as JSONB with the following structure:

```typescript
{
  clinical: {
    hba1c?: number | null
    hba1c_date?: string | null
    fbs?: number | null
    ppbs?: number | null
    diabetes_type?: 'Type 1' | 'Type 2' | 'Not diagnosed' | null
  },
  medical_history: {
    duration_years?: number | null
    current_medication?: 'Oral tablets' | 'Insulin' | 'Both' | 'None' | null
    recent_fluctuations?: boolean | null
  },
  dietary_habits: {
    // All dietary habit fields (see DietaryHabitsStep for full list)
  },
  meta: {
    created_at?: string
    updated_at?: string
  }
}
```

## Validation Rules

1. **Clinical Details:**
   - At least one of: HbA1c, FBS, or PPBS must be provided
   - HbA1c: 3.0-20.0 (if provided)
   - FBS/PPBS: 20-1000 mg/dL (if provided)
   - HbA1c date cannot be in the future

2. **Dietary Habits:**
   - meals_per_day: Required
   - water_intake: Required
   - cooking_oil: Required
   - on_diabetes_medication: Required
   - medication_name_and_dose: Required if on_diabetes_medication === 'Yes'

## Testing Checklist

- [ ] Complete Investigation wizard with all fields
- [ ] Verify data saves to `onboarding.investigation`
- [ ] Check dashboard displays investigation data
- [ ] Verify Lifestyle Advice includes investigation context
- [ ] Test plan generation includes investigation data
- [ ] Verify assistant chat has access to investigation
- [ ] Test validation for required fields
- [ ] Test validation for numeric ranges
- [ ] Test conditional medication field requirement
- [ ] Verify review step shows all entered data
- [ ] Test editing from review step

## Usage in LLM Context

The investigation data is automatically included in:
1. **Plan Generation:** Full investigation object in context
2. **Assistant Chat:** Via onboarding context object
3. **Lifestyle Advice:** Dietary habits and clinical data in prompt

Example LLM context snippet:
```json
{
  "prakriti": { ... },
  "lifestyle": { ... },
  "investigation": {
    "clinical": { "hba1c": 7.2, "diabetes_type": "Type 2" },
    "dietary_habits": { "meals_per_day": "3", "cooking_oil": "Mustard oil", ... }
  }
}
```

## Notes

- All fields are optional except those marked as required
- "I don't know" can be represented as null/empty
- Data is stored as JSONB for flexibility
- GIN index created for efficient querying
- Privacy: Investigation data is sensitive health information

