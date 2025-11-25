-- Seed Admin User Script
-- Replace the placeholders with actual values
-- Run this in Supabase SQL Editor after creating a user via Supabase Auth

-- Example: After creating a user with email 'admin@swasthprameh.com' via Supabase Auth UI
-- Get the user ID from auth.users table, then run:

-- UPDATE user_profiles
-- SET role = 'admin'
-- WHERE email = 'admin@swasthprameh.com';

-- OR if user_profiles doesn't exist for the user yet:

-- INSERT INTO user_profiles (id, email, full_name, role)
-- SELECT id, email, raw_user_meta_data->>'full_name', 'admin'
-- FROM auth.users
-- WHERE email = 'admin@swasthprameh.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Alternative: Create admin via SQL (requires service role key)
-- This should be done via API or Supabase Dashboard, not directly in SQL
-- as it requires creating the auth user first.

-- Recommended approach:
-- 1. Sign up a user normally via the app
-- 2. Run this SQL to elevate them to admin:
-- UPDATE user_profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

