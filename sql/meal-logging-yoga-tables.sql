-- Create meal_logs table
CREATE TABLE IF NOT EXISTS public.meal_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_items TEXT NOT NULL,
    quantity TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create yoga_videos table
CREATE TABLE IF NOT EXISTS public.yoga_videos (
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

-- Enable RLS
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yoga_videos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for meal_logs
DROP POLICY IF EXISTS "Users can view their own meal logs" ON public.meal_logs;
CREATE POLICY "Users can view their own meal logs" ON public.meal_logs
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own meal logs" ON public.meal_logs;
CREATE POLICY "Users can insert their own meal logs" ON public.meal_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own meal logs" ON public.meal_logs;
CREATE POLICY "Users can update their own meal logs" ON public.meal_logs
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own meal logs" ON public.meal_logs;
CREATE POLICY "Users can delete their own meal logs" ON public.meal_logs
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for yoga_videos (public read access)
DROP POLICY IF EXISTS "Anyone can view yoga videos" ON public.yoga_videos;
CREATE POLICY "Anyone can view yoga videos" ON public.yoga_videos
    FOR SELECT USING (true);

-- Insert sample yoga videos
INSERT INTO public.yoga_videos (title, description, video_url, duration, difficulty, category) VALUES
('Morning Yoga for Beginners', 'Start your day with gentle yoga poses to energize your body and mind.', 'https://example.com/morning-yoga', '15 min', 'beginner', 'morning'),
('Diabetes-Friendly Yoga Flow', 'Specialized yoga sequence designed to help manage diabetes through gentle movements.', 'https://example.com/diabetes-yoga', '20 min', 'intermediate', 'therapeutic'),
('Evening Relaxation Yoga', 'Wind down with calming poses to reduce stress and improve sleep quality.', 'https://example.com/evening-yoga', '25 min', 'beginner', 'evening'),
('Pranayama Breathing Exercises', 'Learn essential breathing techniques for better oxygen flow and stress reduction.', 'https://example.com/pranayama', '10 min', 'beginner', 'breathing'),
('Chair Yoga for Seniors', 'Gentle yoga poses adapted for those with mobility limitations.', 'https://example.com/chair-yoga', '20 min', 'beginner', 'therapeutic'),
('Advanced Vinyasa Flow', 'Dynamic yoga sequence for experienced practitioners.', 'https://example.com/vinyasa', '45 min', 'advanced', 'flow')
ON CONFLICT DO NOTHING;
