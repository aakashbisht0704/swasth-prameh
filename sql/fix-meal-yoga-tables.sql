-- Fix meal_logs and yoga_videos tables with permissive RLS policies
-- Run this in your Supabase SQL Editor

-- ============================================
-- CREATE MEAL_LOGS TABLE
-- ============================================

-- Drop if exists
DROP TABLE IF EXISTS public.meal_logs CASCADE;

-- Create meal_logs table
CREATE TABLE public.meal_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_items TEXT NOT NULL,
    quantity TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_meal_logs_user_id ON public.meal_logs(user_id);
CREATE INDEX idx_meal_logs_created_at ON public.meal_logs(created_at);

-- Enable RLS
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for meal_logs
CREATE POLICY "meal_logs_select_policy" ON public.meal_logs
    FOR SELECT USING (true);

CREATE POLICY "meal_logs_insert_policy" ON public.meal_logs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "meal_logs_update_policy" ON public.meal_logs
    FOR UPDATE USING (true);

CREATE POLICY "meal_logs_delete_policy" ON public.meal_logs
    FOR DELETE USING (true);

-- ============================================
-- CREATE YOGA_VIDEOS TABLE
-- ============================================

-- Drop if exists
DROP TABLE IF EXISTS public.yoga_videos CASCADE;

-- Create yoga_videos table
CREATE TABLE public.yoga_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    duration TEXT,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_yoga_videos_difficulty ON public.yoga_videos(difficulty);
CREATE INDEX idx_yoga_videos_category ON public.yoga_videos(category);

-- Enable RLS
ALTER TABLE public.yoga_videos ENABLE ROW LEVEL SECURITY;

-- Create permissive policy for yoga_videos (public read access)
CREATE POLICY "yoga_videos_select_policy" ON public.yoga_videos
    FOR SELECT USING (true);

-- ============================================
-- INSERT SAMPLE YOGA VIDEOS
-- ============================================

INSERT INTO public.yoga_videos (title, description, video_url, duration, difficulty, category) VALUES
('Morning Yoga for Beginners', 'Start your day with gentle yoga poses to energize your body and mind.', 'https://www.youtube.com/embed/v7AYKMP6rOE', '15 min', 'beginner', 'morning'),
('Diabetes-Friendly Yoga Flow', 'Specialized yoga sequence designed to help manage diabetes through gentle movements.', 'https://www.youtube.com/embed/4pKly2JojMw', '20 min', 'intermediate', 'therapeutic'),
('Evening Relaxation Yoga', 'Wind down with calming poses to reduce stress and improve sleep quality.', 'https://www.youtube.com/embed/BiWDsfZ3zbo', '25 min', 'beginner', 'evening'),
('Pranayama Breathing Exercises', 'Learn essential breathing techniques for better oxygen flow and stress reduction.', 'https://www.youtube.com/embed/db4t8LR55Ds', '10 min', 'beginner', 'breathing'),
('Chair Yoga for Seniors', 'Gentle yoga poses adapted for those with mobility limitations.', 'https://www.youtube.com/embed/b1H3xO3x_Js', '20 min', 'beginner', 'therapeutic'),
('Advanced Vinyasa Flow', 'Dynamic yoga sequence for experienced practitioners.', 'https://www.youtube.com/embed/oBu-pQG6sTY', '45 min', 'advanced', 'flow'),
('Yoga for Blood Sugar Control', 'Specific asanas that help regulate blood glucose levels naturally.', 'https://www.youtube.com/embed/3u4tyH6FKvw', '30 min', 'intermediate', 'therapeutic'),
('Gentle Stretching for Diabetes', 'Easy stretches to improve circulation and flexibility.', 'https://www.youtube.com/embed/VaoV1PrYft4', '15 min', 'beginner', 'therapeutic')
ON CONFLICT DO NOTHING;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT ALL ON public.meal_logs TO authenticated;
GRANT ALL ON public.yoga_videos TO authenticated;
GRANT ALL ON public.meal_logs TO anon;
GRANT ALL ON public.yoga_videos TO anon;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
DROP TRIGGER IF EXISTS update_meal_logs_updated_at ON public.meal_logs;
CREATE TRIGGER update_meal_logs_updated_at 
    BEFORE UPDATE ON public.meal_logs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_yoga_videos_updated_at ON public.yoga_videos;
CREATE TRIGGER update_yoga_videos_updated_at 
    BEFORE UPDATE ON public.yoga_videos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


