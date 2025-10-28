# Prakriti Scoring System - Testing Guide

## Overview
The SwasthPrameh app now uses a comprehensive Prakriti scoring system instead of ML diabetes prediction. Users complete a detailed questionnaire to determine their Ayurvedic constitution (Vata, Pitta, Kapha, or Mixed).

## Setup Instructions

### 1. Database Setup
Run the SQL script to add Prakriti fields to your Supabase database:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE public.onboarding
ADD COLUMN IF NOT EXISTS prakriti_scores jsonb,
ADD COLUMN IF NOT EXISTS prakriti_totals jsonb,
ADD COLUMN IF NOT EXISTS prakriti_summary jsonb;
```

### 2. Install Dependencies
```bash
npm install @radix-ui/react-slider @radix-ui/react-progress
```

### 3. Run Development Server
```bash
npm run dev
```

## Testing the Prakriti Flow

### Step 1: Complete Onboarding
1. Navigate to `/onboarding`
2. Complete the Profile Details step (age, gender, diabetes type, diagnosis date)
3. **Prakriti Step**: Complete the multi-step assessment:
   - **9 steps total**, each with **4 questions** (36 questions total)
   - Answer using the 0-6 scale:
     - **0** = Not at all
     - **3** = Moderately  
     - **6** = Completely
   - Questions are shuffled and mixed across doshas for variety
   - Progress indicator shows current step and overall completion

### Step 2: Navigate Through Steps
1. Answer all 4 questions in the current step
2. Click "Next Step" to proceed (button disabled until step is complete)
3. Use "Previous" button to go back if needed
4. After completing all 9 steps, click "Calculate Prakriti"
5. Review the summary card showing:
   - Dominant dosha (Vata/Pitta/Kapha/Mixed/Balanced)
   - Individual scores with progress bars
   - Explanation of your constitution

### Step 3: Verify Data Persistence
1. Click "Continue" to proceed through remaining onboarding steps
2. Check Supabase `onboarding` table for the user:
   ```sql
   SELECT prakriti_scores, prakriti_totals, prakriti_summary 
   FROM onboarding 
   WHERE user_id = 'your-user-id';
   ```

### Step 4: Dashboard Verification
1. Navigate to `/dashboard`
2. Verify the Prakriti card displays:
   - Dominant constitution
   - Visual progress bars for each dosha
   - Explanation text
   - Individual scores

## Test Cases

### Case 1: Vata Dominant
Answer higher scores (4-6) for Vata questions, lower scores (0-2) for Pitta and Kapha.

**Expected Result**: 
- `prakriti_summary.dominant = "Vata"`
- `prakriti_summary.explanation` mentions Vata characteristics
- Dashboard shows Vata as dominant with highest score bar

### Case 2: Mixed Constitution  
Answer similar high scores (3-5) for two doshas, lower for the third.

**Expected Result**:
- `prakriti_summary.dominant = "Mixed"`
- `prakriti_summary.mixed` array contains both doshas
- Dashboard shows mixed constitution

### Case 3: Balanced Constitution
Answer similar scores (2-4) for all three doshas.

**Expected Result**:
- `prakriti_summary.dominant = "Balanced"`
- `prakriti_summary.explanation` mentions harmony

### Case 4: Incomplete Assessment
Leave some questions unanswered in a step and try to proceed.

**Expected Result**:
- "Next Step" button is disabled until current step is complete
- Progress shows completion status for current step
- Cannot proceed without completing all 4 questions in current step
- Cannot calculate until all 9 steps are completed

## Data Structure Verification

### prakriti_scores (Raw Data)
```json
{
  "vata": {
    "vata_q1": 4,
    "vata_q2": 3,
    // ... all 12 vata questions
  },
  "pitta": {
    "pitta_q1": 2,
    "pitta_q2": 1,
    // ... all 12 pitta questions  
  },
  "kapha": {
    "kapha_q1": 1,
    "kapha_q2": 0,
    // ... all 12 kapha questions
  }
}
```

### prakriti_totals (Calculated Totals)
```json
{
  "vata_total": 42,
  "pitta_total": 25, 
  "kapha_total": 18
}
```

### prakriti_summary (Analysis)
```json
{
  "dominant": "Vata",
  "mixed": null,
  "explanation": "You have a Vata-dominant constitution. You tend to be creative, energetic, and adaptable, but may experience anxiety and irregularity."
}
```

## UI/UX Testing

### Responsive Design
- Test on mobile, tablet, and desktop
- Sliders should be touch-friendly on mobile
- Cards should stack properly on narrow screens

### Accessibility
- All sliders have proper ARIA labels
- Color contrast meets WCAG standards
- Keyboard navigation works for all controls

### Theme Testing
- Light theme: Green primary on off-white background
- Dark theme: Green accents on off-black background
- Toggle between themes and verify color consistency

## Error Scenarios

### Network Errors
- Disconnect internet during calculation
- Verify error handling and user feedback

### Database Errors
- Test with invalid user_id
- Verify graceful error handling

### Edge Cases
- All questions answered with 0 (minimum scores)
- All questions answered with 6 (maximum scores)
- Mixed scoring patterns

## Integration Testing

### AI Assistant Integration
1. Complete Prakriti assessment
2. Click "Get AI Recommendations" on dashboard
3. Navigate to `/assistant`
4. Verify chat includes Prakriti context
5. Ask questions about your constitution
6. Verify AI responses reference your Prakriti results

### Admin Dashboard
1. Login as admin user
2. Navigate to `/admin`
3. View user details
4. Verify Prakriti data is displayed in user profile

## Performance Testing

### Large Dataset
- Test with users who have completed multiple assessments
- Verify query performance on dashboard
- Check for memory leaks in React components

### Concurrent Users
- Multiple users completing assessments simultaneously
- Database connection handling
- Real-time updates

## Troubleshooting

### Common Issues

1. **"Calculate Prakriti" button disabled**
   - Check that all 36 questions are answered
   - Look for incomplete progress indicators

2. **Data not saving to Supabase**
   - Verify database columns exist
   - Check network tab for API errors
   - Verify user authentication

3. **Dashboard not showing Prakriti results**
   - Check onboarding completion status
   - Verify `prakriti_summary` field has data
   - Check browser console for errors

4. **Theme not applying correctly**
   - Verify CSS variables are loaded
   - Check for conflicting styles
   - Test theme toggle functionality

### Debug Commands

```sql
-- Check if Prakriti fields exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'onboarding' 
AND column_name LIKE 'prakriti%';

-- View sample Prakriti data
SELECT user_id, prakriti_summary->>'dominant' as dominant_dosha
FROM onboarding 
WHERE prakriti_summary IS NOT NULL
LIMIT 5;
```

## Success Criteria

✅ All 36 questions can be answered with 0-6 scale  
✅ Calculation produces accurate totals and dominant dosha  
✅ Data persists correctly to Supabase  
✅ Dashboard displays results with visual indicators  
✅ AI assistant uses Prakriti context in recommendations  
✅ Theme changes apply correctly across all components  
✅ Responsive design works on all screen sizes  
✅ Error handling provides clear user feedback  
✅ Performance is acceptable with realistic data volumes  

## Next Steps

After successful testing:
1. Deploy to staging environment
2. Conduct user acceptance testing
3. Gather feedback on question clarity and scoring
4. Consider adding more sophisticated analysis algorithms
5. Implement feedback collection for assessment improvements
