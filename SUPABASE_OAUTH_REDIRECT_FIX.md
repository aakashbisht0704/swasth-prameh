# Fix: OAuth Redirects to Localhost After Google Authentication

## Problem
- Initial redirect URL is correct: `https://swasthprameh.com/auth/callback` ✅
- But after selecting Google account, it redirects to `localhost` ❌

## Root Cause
Supabase is overriding the redirect URL because:
1. **Supabase Site URL** is set to `http://localhost:3000` (or similar)
2. **Redirect URLs** in Supabase don't include your production domain
3. Supabase validates the `redirectTo` URL against its allowed list

## Solution

### Step 1: Fix Supabase Site URL

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. **Site URL**: Change from `http://localhost:3000` to:
   ```
   https://swasthprameh.com
   ```
   ⚠️ **Critical**: This must match your production domain exactly

### Step 2: Update Supabase Redirect URLs

In the same **URL Configuration** section, **Redirect URLs** should include:

```
https://swasthprameh.com/auth/callback
https://swasthprameh.com/**
http://localhost:3000/auth/callback  (for local development)
```

**Important points:**
- The `/**` pattern allows all routes under your domain
- Keep localhost URLs for local development
- URLs must match EXACTLY (including `http://` vs `https://`)

### Step 3: Verify Vercel Environment Variable

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Your project → **Settings** → **Environment Variables**
3. Ensure `NEXT_PUBLIC_SITE_URL` is set to:
   ```
   https://swasthprameh.com
   ```
   (Not `http://` - use `https://` since you mentioned you see `https://` in the console)

### Step 4: Redeploy

After updating Supabase configuration:
1. **Redeploy your Vercel app** (or wait for auto-deploy)
2. Clear browser cache and cookies
3. Test OAuth flow again

## How Supabase OAuth Flow Works

1. User clicks "Continue with Google"
2. Your app sends OAuth request to Supabase with `redirectTo: https://swasthprameh.com/auth/callback`
3. Supabase redirects to Google
4. User selects Google account
5. Google redirects back to Supabase: `https://[project].supabase.co/auth/v1/callback`
6. **Supabase validates the `redirectTo` URL** against its allowed Redirect URLs
7. If valid, Supabase redirects to your `redirectTo` URL
8. If invalid, Supabase uses its Site URL instead (which is why you're seeing localhost)

## Verification Checklist

Before testing, verify:

- [ ] Supabase **Site URL** = `https://swasthprameh.com` (not localhost)
- [ ] Supabase **Redirect URLs** includes `https://swasthprameh.com/auth/callback`
- [ ] Vercel `NEXT_PUBLIC_SITE_URL` = `https://swasthprameh.com`
- [ ] Browser console shows: `OAuth redirect URL: https://swasthprameh.com/auth/callback`
- [ ] Redeployed application after changes

## Common Mistakes

### ❌ Wrong: Site URL set to localhost
```
Site URL: http://localhost:3000
```
**Result**: Supabase redirects to localhost even if you provide a different redirectTo

### ✅ Correct: Site URL set to production domain
```
Site URL: https://swasthprameh.com
```

### ❌ Wrong: Redirect URL not in allowed list
```
Redirect URLs: 
- http://localhost:3000/auth/callback
(Missing production URL)
```

### ✅ Correct: Both localhost and production URLs
```
Redirect URLs:
- https://swasthprameh.com/auth/callback
- https://swasthprameh.com/**
- http://localhost:3000/auth/callback
```

## Testing After Fix

1. Open browser in **incognito/private mode** (to avoid cached redirects)
2. Go to `https://swasthprameh.com/auth`
3. Click "Continue with Google"
4. Check console: Should see `OAuth redirect URL: https://swasthprameh.com/auth/callback`
5. Select Google account
6. Should redirect to `https://swasthprameh.com/auth/callback` (not localhost)

## Still Not Working?

If it's still redirecting to localhost after these changes:

1. **Check Supabase logs**: Go to Supabase Dashboard → Logs → Auth logs
2. **Verify exact URL match**: The redirect URL must match EXACTLY (case-sensitive, protocol must match)
3. **Check for multiple redirect URLs**: Remove any duplicate or conflicting entries
4. **Clear Supabase cache**: Sometimes Supabase caches redirect URLs - try adding a trailing slash variant: `https://swasthprameh.com/auth/callback/`

## Additional Notes

- Supabase validates redirect URLs for security
- The Site URL is used as a fallback if redirectTo is invalid
- You can have multiple redirect URLs for different environments
- The `/**` wildcard pattern is useful for allowing all routes under a domain

