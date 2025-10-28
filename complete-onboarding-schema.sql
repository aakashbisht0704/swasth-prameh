-- Complete onboarding schema update
-- This adds all the missing fields from your onboarding steps
-- Run this in your Supabase SQL editor

-- Add all missing columns to the onboarding table
ALTER TABLE public.onboarding 
ADD COLUMN IF NOT EXISTS report_url TEXT,
ADD COLUMN IF NOT EXISTS prakriti_vata TEXT,
ADD COLUMN IF NOT EXISTS prakriti_pitta TEXT,
ADD COLUMN IF NOT EXISTS prakriti_kapha TEXT,
ADD COLUMN IF NOT EXISTS medical_history TEXT,
ADD COLUMN IF NOT EXISTS nadi TEXT,
ADD COLUMN IF NOT EXISTS mutra TEXT,
ADD COLUMN IF NOT EXISTS mala TEXT,
ADD COLUMN IF NOT EXISTS jihwa TEXT,
ADD COLUMN IF NOT EXISTS shabda TEXT,
ADD COLUMN IF NOT EXISTS sparsha TEXT,
ADD COLUMN IF NOT EXISTS drik TEXT,
ADD COLUMN IF NOT EXISTS akriti TEXT,
ADD COLUMN IF NOT EXISTS diet TEXT,
ADD COLUMN IF NOT EXISTS exercise TEXT,
ADD COLUMN IF NOT EXISTS sleep TEXT;

-- Add comments to document the fields
COMMENT ON COLUMN public.onboarding.report_url IS 'URL to the uploaded medical report file';
COMMENT ON COLUMN public.onboarding.prakriti_vata IS 'Prakriti assessment - Vata dosha response';
COMMENT ON COLUMN public.onboarding.prakriti_pitta IS 'Prakriti assessment - Pitta dosha response';
COMMENT ON COLUMN public.onboarding.prakriti_kapha IS 'Prakriti assessment - Kapha dosha response';
COMMENT ON COLUMN public.onboarding.medical_history IS 'User medical history description';
COMMENT ON COLUMN public.onboarding.nadi IS 'Ashtvidha Pariksha - Nadi (Pulse) assessment';
COMMENT ON COLUMN public.onboarding.mutra IS 'Ashtvidha Pariksha - Mutra (Urine) assessment';
COMMENT ON COLUMN public.onboarding.mala IS 'Ashtvidha Pariksha - Mala (Stool) assessment';
COMMENT ON COLUMN public.onboarding.jihwa IS 'Ashtvidha Pariksha - Jihwa (Tongue) assessment';
COMMENT ON COLUMN public.onboarding.shabda IS 'Ashtvidha Pariksha - Shabda (Voice) assessment';
COMMENT ON COLUMN public.onboarding.sparsha IS 'Ashtvidha Pariksha - Sparsha (Touch) assessment';
COMMENT ON COLUMN public.onboarding.drik IS 'Ashtvidha Pariksha - Drik (Vision) assessment';
COMMENT ON COLUMN public.onboarding.akriti IS 'Ashtvidha Pariksha - Akriti (Build) assessment';
COMMENT ON COLUMN public.onboarding.diet IS 'Lifestyle - Diet description';
COMMENT ON COLUMN public.onboarding.exercise IS 'Lifestyle - Exercise routine description';
COMMENT ON COLUMN public.onboarding.sleep IS 'Lifestyle - Sleep pattern description';
