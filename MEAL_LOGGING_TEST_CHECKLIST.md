# Meal Logging Component - Pre-Production Test Checklist

## Critical Bug Fixes Applied
✅ Fixed auto-generation logic to use actual loaded values instead of stale state
✅ Improved error handling to not show "no onboarding" on API errors
✅ Added fallback queries for missing database columns
✅ Made all queries use `maybeSingle()` to avoid errors

---

## Test Scenarios

### 1. **Existing User with Plan** ⭐ CRITICAL
**Setup:** User has completed onboarding, has prakriti, and has an existing plan

**Steps:**
1. Log in as existing user
2. Navigate to Dashboard → Meal Logging tab
3. Check browser console for errors

**Expected:**
- ✅ Plan displays correctly
- ✅ No "Complete your Prakriti Assessment" message
- ✅ No console errors (406/400/500)
- ✅ Meals show from the plan
- ✅ Day selector works
- ✅ "Mark Eaten" button works

**Status:** ⬜ Pass / ⬜ Fail

---

### 2. **Existing User without Plan** ⭐ CRITICAL
**Setup:** User has completed onboarding, has prakriti, but NO plan exists

**Steps:**
1. Log in as user with prakriti but no plan
2. Navigate to Dashboard → Meal Logging tab
3. Wait 2-3 seconds

**Expected:**
- ✅ Shows "Apply Your [Prakriti] Diet Plan" card (NOT "Complete your Prakriti Assessment")
- ✅ Auto-generation happens in background (or shows CTA)
- ✅ If auto-generation succeeds, plan appears automatically
- ✅ If auto-generation fails, CTA buttons are available
- ✅ No console errors

**Status:** ⬜ Pass / ⬜ Fail

---

### 3. **New User (No Onboarding)**
**Setup:** Brand new user, no onboarding data

**Steps:**
1. Create new account
2. Navigate to Dashboard → Meal Logging tab

**Expected:**
- ✅ Shows "Complete your Prakriti Assessment" message
- ✅ "Go to Prakriti Assessment" button works
- ✅ No console errors
- ✅ No auto-generation attempted

**Status:** ⬜ Pass / ⬜ Fail

---

### 4. **Database Migration Not Run (Backward Compatibility)**
**Setup:** Database doesn't have new columns (`is_active`, `plan_type`, `prakriti`)

**Steps:**
1. Use existing database without migration
2. Log in as existing user
3. Navigate to Meal Logging

**Expected:**
- ✅ Page loads without crashing
- ✅ Shows existing plans (if any) using fallback queries
- ✅ No 500 errors
- ✅ Console shows warnings but page still works
- ✅ User can manually apply/generate plans

**Status:** ⬜ Pass / ⬜ Fail

---

### 5. **Auto-Generation Flow**
**Steps:**
1. User with prakriti but no plan
2. Navigate to Meal Logging
3. Observe auto-generation

**Expected:**
- ✅ Shows "Generating your personalized meal plan..." message
- ✅ Auto-generates sample plan based on prakriti
- ✅ Plan appears automatically after generation
- ✅ No duplicate generation (only happens once)
- ✅ If generation fails, shows CTA buttons

**Status:** ⬜ Pass / ⬜ Fail

---

### 6. **Error Handling**
**Steps:**
1. Simulate network error (disable network temporarily)
2. Navigate to Meal Logging
3. Re-enable network

**Expected:**
- ✅ Shows loading state
- ✅ Doesn't show "Complete your Prakriti Assessment" on network errors
- ✅ Gracefully handles errors
- ✅ Retries or shows appropriate message

**Status:** ⬜ Pass / ⬜ Fail

---

### 7. **Manual Plan Actions**
**Steps:**
1. User with prakriti but no plan
2. Click "Apply 7-Day Sample Plan"
3. Verify plan appears
4. Click "Regenerate Plan (AI)"
5. Verify new plan appears

**Expected:**
- ✅ Sample plan applies successfully
- ✅ Plan displays correctly
- ✅ AI plan generation works
- ✅ Old plan is deactivated
- ✅ New plan is active

**Status:** ⬜ Pass / ⬜ Fail

---

### 8. **Meal Marking**
**Steps:**
1. User with active plan
2. Click "Mark Eaten" on a meal
3. Check database

**Expected:**
- ✅ Success toast appears
- ✅ Meal log entry created in database
- ✅ Entry has correct: `user_id`, `plan_id`, `meal_slot`, `source='plan'`
- ✅ No errors

**Status:** ⬜ Pass / ⬜ Fail

---

### 9. **Allergy Warnings**
**Setup:** User has allergies in investigation data

**Steps:**
1. User with allergies and active plan
2. View meals that contain allergy items

**Expected:**
- ✅ Warning icon appears on meals with allergies
- ✅ Tooltip shows "Check with doctor: contains [allergy]"
- ✅ Meal text is grayed/strikethrough
- ✅ Card has warning border

**Status:** ⬜ Pass / ⬜ Fail

---

## Console Error Checks

### Before Testing:
Open browser DevTools → Console tab

### During Testing:
Check for these errors (should NOT appear):
- ❌ `Failed to load resource: the server responded with a status of 406`
- ❌ `Failed to load resource: the server responded with a status of 400`
- ❌ `Failed to load resource: the server responded with a status of 500`
- ❌ `Error loading user_profiles`
- ❌ `Error loading onboarding`
- ❌ `Error loading plan`

### Acceptable Warnings:
- ⚠️ `is_active column might not exist` (if migration not run - this is handled)
- ⚠️ `Error loading user_profiles prakriti` (if column doesn't exist - handled gracefully)

---

## Database Verification

### Check Plans Table:
```sql
SELECT id, user_id, plan_type, prakriti, is_active, start_date, end_date 
FROM plans 
WHERE user_id = '<test_user_id>' 
ORDER BY created_at DESC;
```

### Check User Profiles:
```sql
SELECT id, prakriti 
FROM user_profiles 
WHERE id = '<test_user_id>';
```

### Check Onboarding:
```sql
SELECT user_id, dominant_dosha, prakriti_summary 
FROM onboarding 
WHERE user_id = '<test_user_id>';
```

---

## Performance Checks

1. **Initial Load:** Page loads in < 3 seconds
2. **Auto-Generation:** Completes in < 5 seconds
3. **Plan Display:** Renders immediately after load
4. **Meal Marking:** Response in < 1 second

---

## Edge Cases

### Test These Scenarios:
1. ✅ User with dual-dosha prakriti (e.g., "Vata-Kapha")
2. ✅ User with expired plan (end_date in past)
3. ✅ User with multiple plans (should show only active)
4. ✅ Rapid navigation (clicking between tabs quickly)
5. ✅ Page refresh during auto-generation
6. ✅ Network interruption during load

---

## Sign-off

**Tester:** _________________  
**Date:** _________________  
**Overall Status:** ⬜ Pass / ⬜ Fail  
**Critical Issues Found:** _________________  
**Notes:** _________________

---

## Quick Smoke Test (2 minutes)

1. ✅ Log in as existing user
2. ✅ Navigate to Meal Logging
3. ✅ Verify no "Complete your Prakriti Assessment" message appears
4. ✅ Check console for errors (should be clean)
5. ✅ If plan exists, verify it displays
6. ✅ If no plan, verify CTA or auto-generation works

**If all pass → Safe to deploy**  
**If any fail → Fix before deploying**

