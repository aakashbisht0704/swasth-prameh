# Meal Plan System QA Checklist

## Overview
This document provides a comprehensive QA checklist for the new canonical meal plan system. The system ensures that all meals come exclusively from authorized prakriti-based diet plans.

## Pre-requisites
1. Run the database migration: `sql/create-meal-plan-system.sql` in Supabase SQL Editor
2. Ensure `content/sample-plans.json` exists with canonical plans
3. Install dependencies: `npm install` (includes `@radix-ui/react-tooltip`)

---

## Test Cases

### 1. Onboarding → Meal Flow
**Objective:** Verify that users must complete onboarding before accessing meal plans.

**Steps:**
1. Create a new user account
2. Log in without completing onboarding
3. Navigate to Dashboard → Meal Logging tab

**Expected Result:**
- ✅ Shows CTA: "Complete your Prakriti Assessment to generate a personalized diet plan"
- ✅ Button links to `/onboarding`
- ✅ No default meals displayed
- ✅ No meal plan visible

**Status:** ⬜ Pass / ⬜ Fail

---

### 2. Apply Sample Plan
**Objective:** Verify that users can apply canonical 7-day sample plans based on their prakriti.

**Steps:**
1. Complete onboarding with prakriti assessment (e.g., Kapha)
2. Navigate to Dashboard → Meal Logging tab
3. Click "Apply 7-Day Sample Plan" button
4. Verify plan is displayed

**Expected Result:**
- ✅ CTA shows "Apply 7-Day Sample Plan" button
- ✅ Plan applies successfully (no errors)
- ✅ Plan displays 7 days of meals
- ✅ All meals match the canonical Kapha plan from `content/sample-plans.json`
- ✅ Plan metadata shows: "Sample Plan", prakriti type, date range
- ✅ Plan is saved to database with `plan_type='sample'`

**Status:** ⬜ Pass / ⬜ Fail

---

### 3. Plan Display - No Default Meals
**Objective:** Verify that no default/fallback meals are shown when no plan exists.

**Steps:**
1. Complete onboarding
2. Navigate to Meal Logging without applying a plan
3. Check what is displayed

**Expected Result:**
- ✅ Shows CTA to apply sample plan or generate AI plan
- ✅ NO default meals displayed
- ✅ NO fallback plan shown
- ✅ Clear messaging about needing to apply a plan

**Status:** ⬜ Pass / ⬜ Fail

---

### 4. Meal Marking
**Objective:** Verify that users can mark meals as eaten and they are logged.

**Steps:**
1. Apply a sample plan
2. Navigate to a specific day
3. Click "Mark Eaten" on a meal
4. Check database for meal_log entry

**Expected Result:**
- ✅ "Mark Eaten" button works
- ✅ Success toast appears
- ✅ Meal log entry created in `meal_logs` table
- ✅ Entry has correct: `user_id`, `plan_id`, `meal_slot`, `menu_text`, `source='plan'`
- ✅ Entry has `created_via='meal_logging_ui'`

**Database Check:**
```sql
SELECT * FROM meal_logs 
WHERE user_id = '<test_user_id>' 
ORDER BY created_at DESC 
LIMIT 1;
```

**Status:** ⬜ Pass / ⬜ Fail

---

### 5. AI Plan Generation Constraint
**Objective:** Verify that AI-generated plans only use canonical meal items.

**Steps:**
1. Complete onboarding with Kapha prakriti
2. Click "Generate AI Plan (15 Days)"
3. Wait for plan generation
4. Review generated plan meals
5. Check server logs for validation warnings

**Expected Result:**
- ✅ Plan generates successfully
- ✅ All meal items in the plan exist in the canonical Kapha plan list
- ✅ No invented or modified meal items
- ✅ If validation finds invalid items, they are logged (but plan still saves)
- ✅ Plan saved with `plan_type='ai'`

**Validation Check:**
- Manually verify each meal item against `content/sample-plans.json` for the user's prakriti
- Check server console for any validation warnings

**Status:** ⬜ Pass / ⬜ Fail

---

### 6. Allergy Warning
**Objective:** Verify that meals containing user allergies are flagged.

**Steps:**
1. Complete onboarding with investigation data
2. Set allergies in investigation (e.g., "nuts, dairy")
3. Apply a sample plan that includes items with those allergies
4. View meals in the plan

**Expected Result:**
- ✅ Meals containing allergy items show warning icon (⚠️)
- ✅ Tooltip appears on hover: "Check with doctor: contains [allergy]"
- ✅ Meal text is grayed out/strikethrough
- ✅ Card has warning border color

**Test Cases:**
- Allergy: "nuts" → Should flag meals with "almonds", "walnuts"
- Allergy: "dairy" → Should flag meals with "milk", "ghee" (if applicable)

**Status:** ⬜ Pass / ⬜ Fail

---

### 7. Mixed Prakriti Behavior
**Objective:** Verify behavior for dual-dosha users.

**Steps:**
1. Complete onboarding with dual-dosha result (e.g., "Vata-Kapha")
2. Try to apply sample plan
3. Check which plan is applied

**Expected Result:**
- ✅ System uses the dominant dosha (highest score) or first dosha in combination
- ✅ Plan applied matches the selected prakriti
- ✅ No errors occur

**Note:** Current implementation uses the first matching prakriti. Document this behavior.

**Status:** ⬜ Pass / ⬜ Fail

---

### 8. Chat Integration - Meal Suggestions
**Objective:** Verify that LLM chat only suggests canonical meal items.

**Steps:**
1. Complete onboarding with Kapha prakriti
2. Apply sample plan
3. Open LLM chat
4. Ask: "Show my week's meals" or "What should I eat for breakfast?"
5. Review chat response

**Expected Result:**
- ✅ Chat reads from `plans.payload` if active plan exists
- ✅ Chat suggests meals from canonical Kapha list only
- ✅ No invented meal items
- ✅ If no plan exists, chat prompts user to apply sample plan

**Status:** ⬜ Pass / ⬜ Fail

---

### 9. Edge Cases

#### 9a. Missing Prakriti
**Steps:**
1. User has onboarding but no prakriti calculated
2. Navigate to Meal Logging

**Expected Result:**
- ✅ Shows CTA to complete Prakriti assessment
- ✅ No plan can be applied

**Status:** ⬜ Pass / ⬜ Fail

#### 9b. Expired Plan
**Steps:**
1. Apply a plan
2. Manually set `end_date` to past date in database
3. Navigate to Meal Logging

**Expected Result:**
- ✅ UI should detect expired plan (optional enhancement)
- ✅ Or show current plan regardless (current behavior)

**Status:** ⬜ Pass / ⬜ Fail

#### 9c. Multiple Plans
**Steps:**
1. Apply sample plan
2. Generate AI plan
3. Check which plan is active

**Expected Result:**
- ✅ Only one plan is active (`is_active=true`)
- ✅ Previous plan is deactivated
- ✅ Latest plan is displayed

**Status:** ⬜ Pass / ⬜ Fail

---

## Database Verification

### Check Plans Table
```sql
SELECT id, user_id, plan_type, prakriti, is_active, start_date, end_date, created_at
FROM plans
WHERE user_id = '<test_user_id>'
ORDER BY created_at DESC;
```

### Check Meal Logs
```sql
SELECT id, user_id, plan_id, date, meal_slot, menu_text, source, created_via
FROM meal_logs
WHERE user_id = '<test_user_id>'
ORDER BY created_at DESC;
```

### Check User Profiles Prakriti
```sql
SELECT id, prakriti
FROM user_profiles
WHERE id = '<test_user_id>';
```

---

## Performance Checks

1. **Plan Loading:** Meal Logging page loads in < 2 seconds
2. **Plan Application:** Sample plan applies in < 3 seconds
3. **AI Generation:** AI plan generates in < 30 seconds (depends on LLM)
4. **Meal Marking:** Meal log created in < 1 second

---

## Security Checks

1. ✅ Users can only see their own plans (RLS)
2. ✅ Users can only log meals for themselves (RLS)
3. ✅ Users cannot modify sample plans (RLS prevents updates to `plan_type='sample'`)
4. ✅ API endpoints validate `user_id` matches authenticated user

---

## Documentation

- ✅ `content/sample-plans.json` contains canonical plans
- ✅ `sql/create-meal-plan-system.sql` migration script documented
- ✅ API endpoints documented in code comments
- ✅ README updated with meal plan system overview

---

## Known Limitations

1. **Dual-Dosha:** Currently uses first matching prakriti. Future enhancement: merge plans or allow selection.
2. **Allergy Detection:** Simple text matching. May have false positives/negatives.
3. **Plan Expiration:** UI doesn't automatically prompt for renewal (future enhancement).

---

## Sign-off

**Tester:** _________________  
**Date:** _________________  
**Overall Status:** ⬜ Pass / ⬜ Fail  
**Notes:** _________________

