-- Add email column to user_profiles if it doesn't exist
-- This fixes the "Could not find the 'email' column" error

DO $$ 
BEGIN
  -- Check if email column exists, if not, add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN email TEXT;
    
    -- Optionally, populate email from auth.users for existing records
    UPDATE user_profiles up
    SET email = au.email
    FROM auth.users au
    WHERE up.id = au.id AND up.email IS NULL;
    
    RAISE NOTICE 'Added email column to user_profiles';
  ELSE
    RAISE NOTICE 'Email column already exists in user_profiles';
  END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND column_name = 'email';

