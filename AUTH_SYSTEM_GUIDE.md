# Authentication System Guide

## Overview
This application uses Supabase for authentication with support for:
- Email/Password authentication
- Phone number (OTP) authentication  
- Google OAuth authentication

## Architecture

### Database Tables
1. **users** - Main user records with authentication status
2. **user_profiles** - Extended user profile information
3. **onboarding** - User onboarding completion data

### Key Components

#### 1. Middleware (`middleware.ts`)
- Handles route protection and redirects
- Checks authentication status for protected routes
- Redirects users based on onboarding completion status
- Skips processing for auth callback routes to prevent loops

#### 2. Auth Utilities (`src/lib/auth-utils.ts`)
- `ensureUserExists(user)` - Creates/updates user records in both tables
- `hasCompletedOnboarding(userId)` - Checks onboarding completion
- `getRedirectUrl(userId)` - Returns appropriate redirect URL
- `markOnboardingCompleted(userId, fullName)` - Marks onboarding as complete

#### 3. Auth Form (`src/components/auth-form.tsx`)
- Handles email/password and phone authentication
- Integrates with Google OAuth
- Uses utility functions for consistent user creation

#### 4. Auth Callbacks
- **Client-side** (`src/app/auth/callback/page.tsx`) - Handles OAuth redirects
- **Server-side** (`src/app/auth/callback/nonroute.ts`) - Server-side OAuth processing

#### 5. Onboarding Form (`src/components/onboarding-form.tsx`)
- Updates user profiles and onboarding data
- Marks onboarding completion in users table

## Authentication Flow

### New User Flow
1. User signs up with email/password, phone, or Google
2. User record created in `users` table with `onboarding_completed: false`
3. User profile created in `user_profiles` table
4. User redirected to `/onboarding`
5. After completing onboarding, `onboarding_completed` set to `true`
6. User redirected to `/dashboard`

### Existing User Flow
1. User signs in with any method
2. System checks if user exists in database
3. If onboarding completed: redirect to `/dashboard`
4. If onboarding not completed: redirect to `/onboarding`

### OAuth Flow (Google)
1. User clicks "Continue with Google"
2. Redirected to Google OAuth
3. After authentication, redirected to `/auth/callback`
4. Server-side callback processes the session
5. User records created/updated
6. Redirected based on onboarding status

## Route Protection

### Public Routes
- `/` - Redirects authenticated users based on onboarding status
- `/auth` - Authentication page

### Protected Routes
- `/dashboard` - Requires authentication and completed onboarding
- `/onboarding` - Requires authentication
- `/admin` - Requires authentication

### Middleware Logic
1. Skip processing for `/auth/callback` routes
2. Redirect authenticated users from `/` and `/auth` to appropriate destination
3. Redirect unauthenticated users from protected routes to `/auth`
4. Redirect authenticated users without completed onboarding to `/onboarding`

## Error Handling
- Authentication errors are displayed on the auth page
- Fallback redirects to `/onboarding` if database operations fail
- Comprehensive error logging for debugging

## Testing the System

### Email/Password Authentication
1. Go to `/auth`
2. Toggle to email mode
3. Sign up with email/password
4. Check email for verification (if required)
5. Sign in and verify redirect to onboarding

### Phone Authentication
1. Go to `/auth`
2. Toggle to phone mode
3. Enter phone number and send OTP
4. Enter OTP and verify redirect

### Google OAuth
1. Go to `/auth`
2. Click "Continue with Google"
3. Complete Google authentication
4. Verify redirect based on onboarding status

### Onboarding Flow
1. Complete authentication as new user
2. Fill out onboarding form
3. Verify redirect to dashboard
4. Sign out and sign back in
5. Verify direct redirect to dashboard

## Troubleshooting

### Common Issues
1. **Redirect loops** - Check middleware configuration
2. **Missing user records** - Verify `ensureUserExists` is called
3. **Onboarding not detected** - Check both `users.onboarding_completed` and `onboarding` table
4. **OAuth not working** - Verify callback URLs in Supabase dashboard

### Database Consistency
- Always use utility functions for user creation
- Ensure both `users` and `user_profiles` tables are updated
- Check `onboarding_completed` flag in `users` table
- Verify `onboarding` table has user record when complete
