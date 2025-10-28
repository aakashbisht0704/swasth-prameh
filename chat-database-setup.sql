-- Chat System Database Setup for SwasthPrameh
-- This script creates the chat_messages table and related policies for real-time messaging

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_admin_id ON public.chat_messages(admin_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_type ON public.chat_messages(sender_type);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own messages
CREATE POLICY "Users can read their own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own messages
CREATE POLICY "Users can insert their own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id AND sender_type = 'user');

-- Policy 3: Users can update their own messages (for read status)
CREATE POLICY "Users can update their own messages" ON public.chat_messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy 4: Admins can read all messages
CREATE POLICY "Admins can read all messages" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy 5: Admins can insert messages
CREATE POLICY "Admins can insert messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    ) AND sender_type = 'admin'
  );

-- Policy 6: Admins can update all messages
CREATE POLICY "Admins can update all messages" ON public.chat_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_chat_messages_updated_at 
  BEFORE UPDATE ON public.chat_messages 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get chat participants (for admin interface)
CREATE OR REPLACE FUNCTION get_chat_participants()
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    COALESCE(up.full_name, u.email) as user_name,
    MAX(cm.created_at) as last_message_at,
    COUNT(CASE WHEN cm.sender_type = 'user' AND cm.is_read = FALSE THEN 1 END) as unread_count
  FROM auth.users u
  LEFT JOIN public.user_profiles up ON u.id = up.user_id
  LEFT JOIN public.chat_messages cm ON u.id = cm.user_id
  WHERE u.id IN (
    SELECT DISTINCT user_id FROM public.chat_messages
  )
  GROUP BY u.id, u.email, up.full_name
  ORDER BY last_message_at DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.chat_messages TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_chat_participants() TO anon, authenticated;

-- Create a view for easier querying of chat conversations
CREATE OR REPLACE VIEW chat_conversations AS
SELECT 
  cm.*,
  u.email as user_email,
  up.full_name as user_name,
  admin_u.email as admin_email,
  admin_up.full_name as admin_name
FROM public.chat_messages cm
LEFT JOIN auth.users u ON cm.user_id = u.id
LEFT JOIN public.user_profiles up ON cm.user_id = up.user_id
LEFT JOIN auth.users admin_u ON cm.admin_id = admin_u.id
LEFT JOIN public.user_profiles admin_up ON cm.admin_id = admin_up.user_id
ORDER BY cm.created_at ASC;

-- Grant access to the view
GRANT SELECT ON chat_conversations TO anon, authenticated;
