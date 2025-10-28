-- Test script to verify all onboarding columns exist
-- Run this in your Supabase SQL editor to check if the schema is complete

-- Check if all required columns exist in the onboarding table
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'onboarding' 
    AND table_schema = 'public'
ORDER BY column_name;

-- Expected columns should include:
-- akriti, created_at, current_medications, drik, diet, diabetes_type, 
-- diagnosis_date, exercise, gender, id, jihwa, mala, medical_history, 
-- mutra, nadi, prakriti_kapha, prakriti_pitta, prakriti_vata, 
-- report_url, shabda, sleep, sparsha, updated_at, user_id, age, 
-- ayurvedic_experience
