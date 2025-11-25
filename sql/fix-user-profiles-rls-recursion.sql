-- Fix infinite recursion in user_profiles RLS policies
-- The issue is that policies checking for support/admin role query user_profiles again, causing recursion
-- Solution: Use security definer functions or check auth.jwt() directly

-- NOTE: If you have schema issues (user_id column, missing email, etc.), 
-- run sql/fix-user-profiles-schema-complete.sql FIRST, then this script.

-- Ensure email column exists (quick fix if schema is already correct)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email TEXT;
    
    -- Populate email from auth.users for existing records
    UPDATE user_profiles up
    SET email = COALESCE(
      (SELECT email FROM auth.users WHERE id = up.id),
      up.email
    )
    WHERE up.email IS NULL;
  END IF;
END $$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Support and admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;

-- Create a security definer function to check user role
CREATE OR REPLACE FUNCTION is_user_support_or_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from user_profiles without triggering RLS recursion
  -- Use SECURITY DEFINER to bypass RLS for this check
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_role IN ('support', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate policies using the security definer functions
CREATE POLICY "Support and admin can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id OR  -- Users can see their own profile
    is_user_support_or_admin()  -- Support/admin can see all
  );

CREATE POLICY "Admins can update any profile" ON user_profiles
  FOR UPDATE USING (
    auth.uid() = id OR  -- Users can update their own profile
    is_user_admin()  -- Admins can update any profile
  );

-- Also fix the INSERT policy to allow users to create their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

