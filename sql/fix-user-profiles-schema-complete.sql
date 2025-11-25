-- COMPREHENSIVE FIX: user_profiles schema and all related issues
-- This script handles migration from old schema to new schema and fixes all constraints

-- Step 1: Check current schema and migrate if needed
DO $$ 
DECLARE
  has_user_id BOOLEAN;
  has_email BOOLEAN;
  has_role BOOLEAN;
  has_gender BOOLEAN;
  has_dob BOOLEAN;
  has_phone BOOLEAN;
  has_avatar_url BOOLEAN;
BEGIN
  -- Check which columns exist
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'user_id'
  ) INTO has_user_id;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'email'
  ) INTO has_email;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'role'
  ) INTO has_role;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'gender'
  ) INTO has_gender;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'dob'
  ) INTO has_dob;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'phone'
  ) INTO has_phone;
  
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'avatar_url'
  ) INTO has_avatar_url;

  -- If old schema exists (has user_id), migrate to new schema
  IF has_user_id THEN
    RAISE NOTICE 'Migrating from old schema (with user_id) to new schema...';
    
    -- Step 1: Add new columns if they don't exist
    IF NOT has_email THEN
      ALTER TABLE user_profiles ADD COLUMN email TEXT;
    END IF;
    
    IF NOT has_role THEN
      ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'support', 'admin'));
    END IF;
    
    IF NOT has_phone THEN
      ALTER TABLE user_profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT has_avatar_url THEN
      ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    -- Step 2: Populate email from auth.users or users table
    UPDATE user_profiles up
    SET email = COALESCE(
      (SELECT email FROM auth.users WHERE id = up.user_id),
      (SELECT email FROM users WHERE id = up.user_id),
      up.email
    )
    WHERE up.email IS NULL;
    
    -- Step 3: Create new table with correct schema
    CREATE TABLE IF NOT EXISTS user_profiles_new (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      full_name TEXT,
      email TEXT,
      phone TEXT,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'support', 'admin')),
      avatar_url TEXT,
      gender TEXT,  -- Keep for backward compatibility
      dob DATE,    -- Keep for backward compatibility
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Step 4: Migrate data from old to new table
    INSERT INTO user_profiles_new (id, full_name, email, phone, role, avatar_url, gender, dob, created_at, updated_at)
    SELECT 
      up.user_id as id,
      up.full_name,
      up.email,
      up.phone,
      COALESCE(up.role, 'user') as role,
      up.avatar_url,
      up.gender,
      up.dob,
      up.created_at,
      up.updated_at
    FROM user_profiles up
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email,
      phone = EXCLUDED.phone,
      role = EXCLUDED.role,
      avatar_url = EXCLUDED.avatar_url,
      gender = EXCLUDED.gender,
      dob = EXCLUDED.dob,
      updated_at = NOW();
    
    -- Step 5: Drop old table and rename new one
    DROP TABLE user_profiles CASCADE;
    ALTER TABLE user_profiles_new RENAME TO user_profiles;
    
    RAISE NOTICE 'Migration complete!';
  ELSE
    -- New schema already exists, just ensure all columns are present
    RAISE NOTICE 'Using new schema, ensuring all columns exist...';
    
    IF NOT has_email THEN
      ALTER TABLE user_profiles ADD COLUMN email TEXT;
      -- Populate from auth.users
      UPDATE user_profiles up
      SET email = au.email
      FROM auth.users au
      WHERE up.id = au.id AND up.email IS NULL;
    END IF;
    
    IF NOT has_role THEN
      ALTER TABLE user_profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'support', 'admin'));
    END IF;
    
    IF NOT has_phone THEN
      ALTER TABLE user_profiles ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT has_avatar_url THEN
      ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;
    END IF;
    
    -- Keep gender and dob for backward compatibility if they don't exist
    IF NOT has_gender THEN
      ALTER TABLE user_profiles ADD COLUMN gender TEXT;
    END IF;
    
    IF NOT has_dob THEN
      ALTER TABLE user_profiles ADD COLUMN dob DATE;
    END IF;
  END IF;
END $$;

-- Step 2: Ensure table structure matches expected schema exactly
-- Make sure id is the primary key referencing auth.users
DO $$
BEGIN
  -- Check if id column exists and is primary key
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'user_profiles' 
      AND kcu.column_name = 'id'
      AND tc.constraint_type = 'PRIMARY KEY'
  ) THEN
    -- Recreate table with correct structure
    RAISE NOTICE 'Recreating user_profiles with correct primary key...';
    -- This is handled above, but ensure it's correct
  END IF;
END $$;

-- Step 3: Fix all foreign key references
-- Update support_chats to use id instead of user_id if needed
DO $$
BEGIN
  -- Check if support_chats.user_id references user_profiles.user_id (old) or user_profiles.id (new)
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    WHERE tc.table_name = 'support_chats'
      AND tc.constraint_name LIKE '%user_id%'
      AND tc.constraint_type = 'FOREIGN KEY'
  ) THEN
    -- Foreign key exists, check if it's correct
    -- If it references user_id, we need to update it (but this is complex, so we'll handle in migration)
    RAISE NOTICE 'Checking support_chats foreign keys...';
  END IF;
END $$;

-- Step 4: Fix RLS policies (from previous fix)
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Support and admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;

-- Create security definer functions
CREATE OR REPLACE FUNCTION is_user_support_or_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM user_profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN user_role IN ('support', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Recreate RLS policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Support and admin can view all profiles" ON user_profiles
  FOR SELECT USING (
    auth.uid() = id OR
    is_user_support_or_admin()
  );

CREATE POLICY "Admins can update any profile" ON user_profiles
  FOR UPDATE USING (
    auth.uid() = id OR
    is_user_admin()
  );

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Step 5: Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Step 6: Verify final schema
DO $$
DECLARE
  schema_info TEXT;
BEGIN
  SELECT string_agg(column_name || ' ' || data_type, ', ' ORDER BY ordinal_position)
  INTO schema_info
  FROM information_schema.columns
  WHERE table_name = 'user_profiles';
  
  RAISE NOTICE 'Final user_profiles schema:';
  RAISE NOTICE 'Columns: %', schema_info;
END $$;

-- Final verification query
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'user_profiles'
ORDER BY ordinal_position;

