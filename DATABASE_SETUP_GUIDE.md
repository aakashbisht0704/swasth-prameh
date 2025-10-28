# Database Setup Guide

## Issue: "Could not find the table 'public.users' in the schema cache"

This error occurs because the required database tables haven't been created in your Supabase project yet. Follow these steps to set up the database properly.

## Quick Setup (Recommended)

### Option 1: Run the Complete Setup Script

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `database-setup.sql` and paste it into the SQL editor
4. Click **Run** to execute all the commands at once

### Option 2: Run Step by Step (If you prefer to run commands individually)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each section from `database-setup-simple.sql` one by one:

```sql
-- Step 1: Create users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    phone TEXT,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create user_profiles table
CREATE TABLE public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL DEFAULT '',
    gender TEXT NOT NULL DEFAULT '',
    dob DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create onboarding table
CREATE TABLE public.onboarding (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    diabetes_type TEXT NOT NULL,
    diagnosis_date DATE NOT NULL,
    current_medications TEXT[] DEFAULT '{}',
    ayurvedic_experience BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
CREATE POLICY "Users can manage own data" ON public.users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage own profile" ON public.user_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own onboarding" ON public.onboarding FOR ALL USING (auth.uid() = user_id);
```

## Verify Setup

After running the setup script, you can verify the tables were created:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see three new tables:
   - `users`
   - `user_profiles`
   - `onboarding`

## Test the Authentication

Once the tables are set up:

1. Start your Next.js development server: `npm run dev`
2. Go to `http://localhost:3000/auth`
3. Try signing up with email/password
4. The system should now properly create user records and redirect to onboarding

## Troubleshooting

### If you still get table errors:
1. Make sure you're running the SQL in the correct Supabase project
2. Check that the tables appear in the Table Editor
3. Verify your environment variables are set correctly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### If RLS policies cause issues:
You can temporarily disable RLS for testing:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding DISABLE ROW LEVEL SECURITY;
```

**Note:** Only disable RLS temporarily for testing. Re-enable it for production.

## What the Setup Creates

### Tables Created:
1. **users** - Main user authentication data
2. **user_profiles** - Extended user profile information  
3. **onboarding** - User onboarding completion data

### Security Features:
- Row Level Security (RLS) enabled on all tables
- Policies that ensure users can only access their own data
- Foreign key relationships between tables
- Automatic timestamp updates

### Automatic Features:
- User records are automatically created when someone signs up
- Updated timestamps are handled automatically
- Proper cascade deletion when users are removed

## Next Steps

After setting up the database:
1. Configure OAuth providers (Google) in Supabase if needed
2. Test all authentication methods
3. Verify the onboarding flow works correctly
4. Check that users are properly redirected based on their onboarding status
