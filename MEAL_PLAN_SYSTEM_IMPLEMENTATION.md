# Meal Plan System Implementation Summary

## Overview
This implementation enforces strict canonical meal plans based on prakriti (dosha) types. All meals must come exclusively from authorized diet plans stored in the system. No default or arbitrary meals are allowed.

---

## Key Changes

### 1. Canonical Meal Plans
**File:** `src/lib/canonical-plans.ts` and `content/sample-plans.json`

- Created canonical 7-day meal plans for:
  - **Kaphaj** (Kapha-dominant)
  - **Pittaj** (Pitta-dominant)
  - **Vataja** (Vata-dominant)
- Each plan includes: breakfast, 12pm snack, lunch, 6pm snack, dinner
- Plans are stored as TypeScript for type safety and Next.js compatibility

### 2. Database Schema Updates
**File:** `sql/create-meal-plan-system.sql`

**Updated `plans` table:**
- Added `plan_type` enum: 'sample' | 'ai'
- Added `prakriti` text field
- Added `start_date` and `end_date`
- Added `is_active` boolean
- Added `payload` JSONB (canonical plan data)

**Updated `meal_logs` table:**
- Complete redesign with new schema:
  - `plan_id` (references plans)
  - `meal_slot`: 'breakfast' | 'snack12' | 'lunch' | 'snack6' | 'dinner'
  - `menu_text` (exact meal text from plan)
  - `source`: 'plan' | 'user' | 'ai'
  - `created_via` (tracking)

**Updated `user_profiles` table:**
- Added `prakriti` field to store calculated prakriti

### 3. API Endpoints

#### `POST /api/plans/apply-sample`
- Applies canonical 7-day sample plan based on user's prakriti
- Deactivates existing active plans
- Creates plan with `plan_type='sample'`
- Returns plan ID and payload

#### `GET /api/plans/current`
- Fetches active plan for user
- Returns plan with normalized structure
- Returns `null` if no active plan

#### `POST /api/meals/log`
- Creates meal log entry
- Validates meal_slot and source
- Links to plan_id if from plan
- Tracks source and created_via

#### `POST /api/plans/generate` (Updated)
- **CRITICAL:** Now constrains AI generation to canonical meal items only
- Includes `allowed_meal_items` in LLM context
- Validates generated plan against canonical items
- Logs validation warnings
- Saves plan with `plan_type='ai'`

### 4. Meal Logging Component
**File:** `src/components/MealLogging.tsx`

**Complete rewrite with:**
- ✅ **No default meals** - removed `getDefaultPlan()`
- ✅ **CTA for missing prakriti** - prompts to complete assessment
- ✅ **CTA for missing plan** - shows "Apply Sample Plan" button
- ✅ **Plan display** - shows only meals from active plan
- ✅ **Day navigation** - select specific day to view meals
- ✅ **Meal marking** - "Mark Eaten" button creates meal log
- ✅ **Allergy warnings** - flags meals containing user allergies
- ✅ **Plan metadata** - shows plan type, prakriti, date range
- ✅ **Badge labels** - "From SwasthPrameh [Prakriti] Plan"

### 5. Meal Plan Utilities
**File:** `src/lib/meal-plan-utils.ts`

Utility functions:
- `getAllowedMealItems(prakriti)` - Get all allowed items for a prakriti
- `isAllowedMealItem(mealText, prakriti)` - Check if item is allowed
- `validateMealPlan(plan, prakriti)` - Validate entire plan
- `getCanonicalPlan(prakriti)` - Get canonical plan
- `normalizePrakriti(prakriti)` - Normalize prakriti string
- `getAllowedItemsPrompt(prakriti)` - Get items for LLM prompt

### 6. LLM Chat Integration
**File:** `src/app/api/assistant/chat/route.ts`

**Updated to:**
- Include canonical meal constraints in context
- Pass `allowed_meal_items` to LLM
- Instruct LLM to only use canonical items
- Read from active plan if user asks about meals

### 7. UI Components
**File:** `src/components/ui/tooltip.tsx`

- Created Tooltip component for allergy warnings
- Uses Radix UI primitives

---

## Data Flow

### Applying Sample Plan
```
User clicks "Apply Sample Plan"
  → POST /api/plans/apply-sample
  → Fetches user prakriti from user_profiles or onboarding
  → Normalizes prakriti (kaphaj/pittaj/vataja)
  → Loads canonical plan from canonical-plans.ts
  → Deactivates existing plans
  → Creates new plan with plan_type='sample'
  → Returns plan to frontend
  → MealLogging component displays plan
```

### Generating AI Plan
```
User clicks "Generate AI Plan"
  → POST /api/plans/generate
  → Fetches user onboarding data
  → Gets user prakriti
  → Loads allowed meal items for prakriti
  → Includes constraints in LLM context
  → Calls LLM with constraints
  → Validates generated plan
  → Saves plan with plan_type='ai'
  → Returns plan to frontend
```

### Marking Meal Eaten
```
User clicks "Mark Eaten"
  → POST /api/meals/log
  → Creates meal_log entry
  → Links to plan_id
  → Sets source='plan'
  → Returns success
  → Toast notification
```

---

## Security & RLS

### Plans Table
- Users can only read their own plans
- Users can insert their own plans
- Users **cannot** update sample plans (RLS policy)
- Only AI/system can create sample plans

### Meal Logs Table
- Users can only read/write their own meal logs
- Meal logs linked to plans via `plan_id`

---

## Validation & Constraints

### Server-Side Validation
1. **Plan Generation:** AI plans are validated against canonical items
2. **Meal Logging:** Validates meal_slot and source enum values
3. **Prakriti Normalization:** Converts various prakriti strings to canonical form

### Client-Side Validation
1. **Allergy Detection:** Simple text matching (can be enhanced)
2. **Plan Display:** Only shows meals from active plan
3. **CTA Logic:** Checks for prakriti and plan before showing options

---

## Testing

See `MEAL_PLAN_SYSTEM_QA.md` for comprehensive test checklist.

**Key Test Scenarios:**
1. Onboarding → Meal Flow
2. Apply Sample Plan
3. No Default Meals Displayed
4. Meal Marking
5. AI Plan Generation Constraint
6. Allergy Warnings
7. Mixed Prakriti Behavior
8. Chat Integration

---

## Migration Steps

1. **Run SQL Migration:**
   ```sql
   -- Run in Supabase SQL Editor
   -- File: sql/create-meal-plan-system.sql
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # Installs @radix-ui/react-tooltip
   ```

3. **Verify Files:**
   - ✅ `src/lib/canonical-plans.ts` exists
   - ✅ `content/sample-plans.json` exists (optional, for reference)
   - ✅ All API routes are in place
   - ✅ MealLogging component updated

4. **Test:**
   - Complete onboarding
   - Apply sample plan
   - Verify meals match canonical plan
   - Test meal marking
   - Test AI plan generation

---

## Known Limitations

1. **Dual-Dosha:** Currently uses first matching prakriti. Future: merge plans or allow selection.
2. **Allergy Detection:** Simple text matching. May have false positives.
3. **Plan Expiration:** UI doesn't automatically prompt for renewal (future enhancement).
4. **Meal Substitutions:** No automatic substitution for allergies (future enhancement).

---

## Future Enhancements

1. **Dual-Dosha Plans:** Merge or interleave plans for dual-dosha users
2. **Allergy Substitutions:** Automatic substitution with allowed alternatives
3. **Plan Expiration:** Auto-prompt to renew expired plans
4. **Meal History:** View past meal logs and statistics
5. **Export Plans:** PDF/download functionality
6. **Meal Notes:** Allow users to add personal notes to meals

---

## Files Created/Modified

### Created:
- `src/lib/canonical-plans.ts`
- `src/lib/meal-plan-utils.ts`
- `src/app/api/plans/apply-sample/route.ts`
- `src/app/api/plans/current/route.ts`
- `src/app/api/meals/log/route.ts`
- `src/components/ui/tooltip.tsx`
- `sql/create-meal-plan-system.sql`
- `MEAL_PLAN_SYSTEM_QA.md`
- `MEAL_PLAN_SYSTEM_IMPLEMENTATION.md`

### Modified:
- `src/components/MealLogging.tsx` (complete rewrite)
- `src/app/api/plans/generate/route.ts` (added constraints)
- `src/app/api/assistant/chat/route.ts` (added meal constraints)
- `package.json` (added @radix-ui/react-tooltip)

---

## Summary

✅ **All requirements met:**
- Meals only appear after plan is applied
- Meals come exclusively from canonical plans
- No default/fallback meals
- AI generation constrained to canonical items
- LLM chat uses canonical items
- Allergy warnings implemented
- Meal logging functional
- Database schema updated
- RLS policies in place

The system is now production-ready and enforces strict meal plan constraints as specified.

