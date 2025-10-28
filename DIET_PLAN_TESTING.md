# Diet Plan Integration Testing

## What Was Changed

### 1. **Created Diet Plans Data**
- **File:** `src/lib/ai/dietPlans.ts`
- Contains 3 complete weekly meal plans for:
  - Kaphaj (Kapha-dominant)
  - Pittaj (Pitta-dominant) 
  - Vataja (Vata-dominant)
- Each plan includes 7 days with breakfast, mid-morning, lunch, evening, and dinner

### 2. **Updated System Prompts**
- **Files:** `src/lib/ai/systemPrompts.ts` and `src/lib/ai/systemPrompts.js`
- Added comprehensive food lists for each dosha type
- LLM must now use ONLY foods from these approved lists
- Can modify for allergies while maintaining dosha balance

## How to Test

### Step 1: Restart Next.js Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 2: Generate a New Diet Plan
1. Go to the Dashboard
2. Click "Generate Diagnosis & 15-Day Plan" button
3. Wait for the plan to be generated

### Step 3: Verify the Plan Contains Approved Foods Only
Check that the generated plan includes ONLY foods from these lists:

**Kaphaj Foods:**
- Grains: Barley roti, Bajra roti, Jowar roti, Ragi rotis, Old red rice
- Vegetables: Ridge gourd, Bottle gourd, Bitter gourd, Lauki, Ash gourd, Spinach, Tindora
- Legumes: Moong dal, Masoor dal, Black gram dal, Toor dal, Sprouted lentils
- Fruits: Apple, Papaya, Orange, Guava, Pomegranate, Sweet lime, Jamun
- Breakfast: Moong dal chila, Besan chila, Light poha, Oats chilla, Ragi upma, Moong dal dosa, Daliya

**Pittaj Foods:**
- Grains: Brown rice, Red rice, Ragi chapati, Rotis, Chapatis, Barley khichdi
- Vegetables: Ridge gourd, Ivy gourd, Ash gourd, Pumpkin, Bottle gourd, Spinach, Snake gourd
- Legumes: Moong dal, Chana dal, Masoor dal, Toor dal, Horse gram
- Fruits: Papaya, Grapes, Guava, Watermelon, Pomegranate, Apple, Sweet lime
- Drinks: Coconut water, Sweet lime juice, Amla juice, Fennel seed tea

**Vataja Foods:**
- Grains: Wheat chapati, Brown rice, Jowar roti, Makai roti, Bajra roti, Rice, Foxtail millets
- Vegetables: Bottle gourd, Ridge gourd, Pumpkin, Lauki, Ash gourd, Spinach, Ivy gourd, Lauki leaves
- Legumes: Moong dal, Masoor dal, Chana dal, Urad dal (soft), Toor dal
- Fruits: Apple, Dates, Pomegranate, Guava, Black grapes (soaked), Jamun
- Additions: Ghee, Warm milk, Warm ginger tea, Turmeric milk, Herbal tea, Nutmeg

### Step 4: Test Allergy Modifications
Ask the LLM in the chat: "I'm allergic to peanuts, what should I eat for breakfast?"

The LLM should:
- Use foods from your dosha's approved list
- Substitute peanuts with similar foods
- Maintain Ayurvedic principles

## Expected Behavior

✅ **DO:**
- Use only approved foods from the dosha-specific lists
- Follow the weekly meal pattern structure
- Substitute allergenic foods with similar approved foods
- Maintain Ayurvedic cooking principles (warm, easy-to-digest, etc.)

❌ **DON'T:**
- Recommend foods not in the approved lists
- Use processed or packaged foods
- Suggest random generic "healthy" foods
- Ignore dosha-specific requirements

## Troubleshooting

### If plans still show wrong foods:
1. **Verify LLM server is restarted:** Check if it's running on port 8002
2. **Clear browser cache:** Hard refresh (Ctrl+Shift+R)
3. **Check console for errors:** Look for any API errors
4. **Regenerate plan:** Delete old plan and create new one

### To manually verify the system prompt:
```bash
# In the LLM server terminal, you should see logs when generating plans
# The prompt should include the food lists for the user's dosha
```

## Files Modified
- ✅ `src/lib/ai/dietPlans.ts` (NEW)
- ✅ `src/lib/ai/systemPrompts.ts` (UPDATED)
- ✅ `src/lib/ai/systemPrompts.js` (UPDATED)
- ⚠️ LLM server needs restart (DONE)

