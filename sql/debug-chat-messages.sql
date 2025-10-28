-- Check if chat_messages table exists and has correct structure
-- Run this in your Supabase SQL editor to verify

-- First, check if the table exists
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
ORDER BY ordinal_position;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'chat_messages';

-- Test insert (replace with your actual user ID)
-- INSERT INTO public.chat_messages (user_id, message, sender_type, is_read) 
-- VALUES ('your-user-id-here', 'test message', 'user', true);
