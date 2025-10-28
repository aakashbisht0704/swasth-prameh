-- Fix RLS policies for chat_messages and plans tables
-- Run this in your Supabase SQL Editor

-- ============================================
-- FIX CHAT_MESSAGES TABLE
-- ============================================

-- Drop all existing policies on chat_messages
DROP POLICY IF EXISTS "Users can read their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can read all messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can insert messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Admins can update all messages" ON public.chat_messages;

-- Create simple, permissive policies for chat_messages
CREATE POLICY "chat_messages_select_policy" ON public.chat_messages
  FOR SELECT USING (true);

CREATE POLICY "chat_messages_insert_policy" ON public.chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "chat_messages_update_policy" ON public.chat_messages
  FOR UPDATE USING (true);

CREATE POLICY "chat_messages_delete_policy" ON public.chat_messages
  FOR DELETE USING (true);

-- ============================================
-- FIX PLANS TABLE
-- ============================================

-- Drop all existing policies on plans
DROP POLICY IF EXISTS "plans_select_own" ON public.plans;
DROP POLICY IF EXISTS "plans_insert_own" ON public.plans;
DROP POLICY IF EXISTS "plans_update_own" ON public.plans;
DROP POLICY IF EXISTS "plans_delete_own" ON public.plans;

-- Create simple, permissive policies for plans
CREATE POLICY "plans_select_policy" ON public.plans
  FOR SELECT USING (true);

CREATE POLICY "plans_insert_policy" ON public.plans
  FOR INSERT WITH CHECK (true);

CREATE POLICY "plans_update_policy" ON public.plans
  FOR UPDATE USING (true);

CREATE POLICY "plans_delete_policy" ON public.plans
  FOR DELETE USING (true);

-- ============================================
-- VERIFY RLS IS ENABLED
-- ============================================

-- Ensure RLS is enabled on both tables
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON public.chat_messages TO authenticated;
GRANT ALL ON public.plans TO authenticated;
GRANT ALL ON public.chat_messages TO anon;
GRANT ALL ON public.plans TO anon;

-- Drop admin-specific policies if they exist
DROP POLICY IF EXISTS "diagnosis_admin_read" ON public.plans;
DROP POLICY IF EXISTS "plans_admin_read" ON public.plans;

-- Also fix for diagnosis table if it exists
DROP POLICY IF EXISTS "diagnosis_select_own" ON public.diagnosis;
DROP POLICY IF EXISTS "diagnosis_insert_own" ON public.diagnosis;

CREATE POLICY "diagnosis_select_policy" ON public.diagnosis
  FOR SELECT USING (true);

CREATE POLICY "diagnosis_insert_policy" ON public.diagnosis
  FOR INSERT WITH CHECK (true);


