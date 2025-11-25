-- Support Chat System Database Schema
-- Run this migration in Supabase SQL Editor

-- 1. Ensure user_profiles table exists with role column
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'support', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'support', 'admin'));
  END IF;
END $$;

-- 2. Create support_chats table
CREATE TABLE IF NOT EXISTS support_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')),
  assigned_to UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES support_chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'support', 'admin', 'system')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  flagged BOOLEAN DEFAULT FALSE,
  flagged_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  flagged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ
);

-- 4. Create support_attachments table
CREATE TABLE IF NOT EXISTS support_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES support_messages(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  size INTEGER,
  content_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_support_chats_user_id ON support_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_support_chats_assigned_to ON support_chats(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_chats_status ON support_chats(status);
CREATE INDEX IF NOT EXISTS idx_support_chats_last_message_at ON support_chats(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_chat_id_created_at ON support_messages(chat_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_sender_id ON support_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_is_read ON support_messages(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_support_attachments_message_id ON support_attachments(message_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- 6. Create function to update last_message_at and unread_count
CREATE OR REPLACE FUNCTION update_chat_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE support_chats
  SET 
    last_message_at = NEW.created_at,
    unread_count = CASE 
      WHEN NEW.sender_role = 'user' AND NEW.chat_id IN (
        SELECT id FROM support_chats WHERE assigned_to IS NOT NULL
      ) THEN unread_count + 1
      WHEN NEW.sender_role IN ('support', 'admin') AND NEW.chat_id IN (
        SELECT id FROM support_chats WHERE user_id = (
          SELECT user_id FROM support_chats WHERE id = NEW.chat_id
        )
      ) THEN unread_count + 1
      ELSE unread_count
    END,
    updated_at = NOW()
  WHERE id = NEW.chat_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for automatic chat updates
DROP TRIGGER IF EXISTS trigger_update_chat_on_message ON support_messages;
CREATE TRIGGER trigger_update_chat_on_message
  AFTER INSERT ON support_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_on_message();

-- 8. Create function to reset unread count when messages are read
CREATE OR REPLACE FUNCTION reset_chat_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    UPDATE support_chats
    SET unread_count = GREATEST(0, unread_count - 1)
    WHERE id = NEW.chat_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger for unread count reset
DROP TRIGGER IF EXISTS trigger_reset_unread_count ON support_messages;
CREATE TRIGGER trigger_reset_unread_count
  AFTER UPDATE OF is_read ON support_messages
  FOR EACH ROW
  WHEN (NEW.is_read = TRUE AND OLD.is_read = FALSE)
  EXECUTE FUNCTION reset_chat_unread_count();

-- 10. Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_attachments ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies for user_profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Support and admin can view all profiles" ON user_profiles;
CREATE POLICY "Support and admin can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin')
    )
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
CREATE POLICY "Admins can update any profile" ON user_profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 12. RLS Policies for support_chats
DROP POLICY IF EXISTS "Users can view their own chats" ON support_chats;
CREATE POLICY "Users can view their own chats" ON support_chats
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own chats" ON support_chats;
CREATE POLICY "Users can create their own chats" ON support_chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own chats" ON support_chats;
CREATE POLICY "Users can update their own chats" ON support_chats
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Support and admin can view all chats" ON support_chats;
CREATE POLICY "Support and admin can view all chats" ON support_chats
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin')
    )
  );

DROP POLICY IF EXISTS "Support and admin can update assigned chats" ON support_chats;
CREATE POLICY "Support and admin can update assigned chats" ON support_chats
  FOR UPDATE USING (
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 13. RLS Policies for support_messages
DROP POLICY IF EXISTS "Users can view messages in their chats" ON support_messages;
CREATE POLICY "Users can view messages in their chats" ON support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_chats
      WHERE id = chat_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create messages in their chats" ON support_messages;
CREATE POLICY "Users can create messages in their chats" ON support_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM support_chats
      WHERE id = chat_id AND user_id = auth.uid()
    ) AND sender_role = 'user'
  );

DROP POLICY IF EXISTS "Support and admin can view all messages" ON support_messages;
CREATE POLICY "Support and admin can view all messages" ON support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin')
    )
  );

DROP POLICY IF EXISTS "Support and admin can create messages" ON support_messages;
CREATE POLICY "Support and admin can create messages" ON support_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin')
    )
  );

DROP POLICY IF EXISTS "Users can update their own messages" ON support_messages;
CREATE POLICY "Users can update their own messages" ON support_messages
  FOR UPDATE USING (sender_id = auth.uid() AND sender_role = 'user');

DROP POLICY IF EXISTS "Support and admin can update any message" ON support_messages;
CREATE POLICY "Support and admin can update any message" ON support_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin')
    )
  );

DROP POLICY IF EXISTS "Support and admin can delete messages" ON support_messages;
CREATE POLICY "Support and admin can delete messages" ON support_messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin')
    )
  );

-- 14. RLS Policies for support_attachments
DROP POLICY IF EXISTS "Users can view attachments in their chats" ON support_attachments;
CREATE POLICY "Users can view attachments in their chats" ON support_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM support_messages sm
      JOIN support_chats sc ON sm.chat_id = sc.id
      WHERE sm.id = message_id AND sc.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Support and admin can view all attachments" ON support_attachments;
CREATE POLICY "Support and admin can view all attachments" ON support_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin')
    )
  );

-- 15. Create activity log table for moderation
CREATE TABLE IF NOT EXISTS support_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_activity_log_user_id ON support_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_support_activity_log_created_at ON support_activity_log(created_at DESC);

ALTER TABLE support_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Support and admin can view activity log" ON support_activity_log;
CREATE POLICY "Support and admin can view activity log" ON support_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('support', 'admin')
    )
  );

-- 16. Function to log activities
CREATE OR REPLACE FUNCTION log_support_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO support_activity_log (user_id, action, entity_type, entity_id, metadata)
  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_metadata)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 17. Comments for documentation
COMMENT ON TABLE user_profiles IS 'Extended user profiles with role-based access control';
COMMENT ON TABLE support_chats IS 'Support chat threads between users and support staff';
COMMENT ON TABLE support_messages IS 'Messages within support chats with moderation support';
COMMENT ON TABLE support_attachments IS 'File attachments for support messages';
COMMENT ON TABLE support_activity_log IS 'Audit log for support system activities';

