-- Create user_activities table for tracking user interactions
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'dashboard_view',
        'ai_recommendations_click',
        'generate_plan_click',
        'yoga_video_click',
        'yoga_video_watch'
    )),
    metadata JSONB, -- Store additional data like video_id, video_duration, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON public.user_activities(activity_type);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own activities" ON public.user_activities;
CREATE POLICY "Users can view their own activities" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activities" ON public.user_activities;
CREATE POLICY "Users can insert their own activities" ON public.user_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE public.user_activities IS 'Tracks user interactions with the dashboard and app features';

