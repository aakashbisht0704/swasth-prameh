# Email Confirmation Fix Guide

## Problem Summary

1. **On localhost**: Email is sent ✅, but confirmation link redirects to production site ❌
2. **On production (swasthprameh.com)**: Email is NOT being sent ❌

## Root Causes

1. **Code Issue**: The email redirect URL logic was using environment variables incorrectly
2. **Supabase Configuration**: Redirect URLs might not be properly configured in Supabase
3. **Supabase Email Settings**: Email confirmation might be disabled or misconfigured

## Code Fix (✅ Already Applied)

The code now always uses `location.origin` for email redirects, ensuring:
- Localhost emails → redirect to localhost
- Production emails → redirect to production

## Supabase Configuration Steps

### Step 1: Check Email Confirmation Settings

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Providers** → **Email**
4. Verify these settings:
   - ✅ **Enable email confirmations**: Should be **ON**
   - ✅ **Secure email change**: Should be **ON** (recommended)
   - ✅ **Double confirm email changes**: Optional but recommended

### Step 2: Update Supabase Site URL

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. **Site URL** should be set to:
   ```
   https://swasthprameh.com
   ```
   ⚠️ **Important**: 
   - Must be `https://` (not `http://`)
   - No trailing slash
   - Exact domain: `swasthprameh.com`

### Step 3: Update Redirect URLs (CRITICAL)

In the same **URL Configuration** section, under **Redirect URLs**, add ALL of these:

```
https://swasthprameh.com/auth/callback
https://swasthprameh.com/**
http://localhost:3000/auth/callback
http://localhost:3000/**
```

**Important points:**
- The `/**` wildcard allows all routes under that domain
- Keep both localhost entries for local development
- URLs must match EXACTLY (including protocol: `http://` vs `https://`)
- No trailing slashes on specific routes like `/auth/callback`

### Step 4: Check Email Templates

1. Go to **Authentication** → **Email Templates**
2. Verify **Confirm signup** template exists and is enabled
3. The template should include a confirmation link that uses the redirect URL

### Step 5: Verify SMTP Settings (If Using Custom SMTP)

If you're using a custom SMTP provider:
1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Verify SMTP is properly configured
3. Test email sending

If using Supabase's default email service:
- No configuration needed, but check if you've hit any rate limits

## Testing Steps

### Test on Localhost

1. Start your local dev server: `npm run dev`
2. Go to `http://localhost:3000/auth`
3. Sign up with a test email
4. Check your email inbox
5. Click the confirmation link
6. **Expected**: Should redirect to `http://localhost:3000/auth/callback` ✅

### Test on Production

1. Go to `https://swasthprameh.com/auth`
2. Sign up with a test email
3. Check your email inbox
4. Click the confirmation link
5. **Expected**: Should redirect to `https://swasthprameh.com/auth/callback` ✅

## Common Issues & Solutions

### Issue: Emails not being sent from production

**Possible causes:**
1. Supabase redirect URLs don't include production domain
2. Email confirmation is disabled
3. SMTP rate limits reached
4. Email is going to spam folder

**Solutions:**
- Verify redirect URLs include `https://swasthprameh.com/**`
- Check spam/junk folder
- Verify email confirmation is enabled in Supabase
- Check Supabase logs for email sending errors

### Issue: Confirmation link redirects to wrong domain

**Possible causes:**
1. Supabase Site URL is set to localhost
2. Redirect URL in code doesn't match Supabase allowed URLs

**Solutions:**
- Set Supabase Site URL to `https://swasthprameh.com`
- Ensure redirect URLs in Supabase include both localhost and production
- The code fix ensures it uses `location.origin` automatically

### Issue: "Invalid redirect URL" error

**Solution:**
- Add the exact redirect URL to Supabase's allowed Redirect URLs list
- Use wildcard `/**` to allow all routes under a domain

## Verification Checklist

After making changes:

- [ ] Supabase Site URL is `https://swasthprameh.com`
- [ ] Redirect URLs include both localhost and production URLs
- [ ] Email confirmation is enabled in Supabase
- [ ] Code uses `location.origin` for email redirects (✅ already fixed)
- [ ] Tested signup on localhost - email received and link works
- [ ] Tested signup on production - email received and link works
- [ ] Confirmation links redirect to the correct domain

## Wait Time

After updating Supabase configuration:
- **Wait 5-10 minutes** for changes to propagate
- Supabase caches redirect URL configurations
- Clear browser cache before testing
- Try in incognito mode for clean testing

## Debugging

If emails still don't work:

1. **Check browser console** for any errors
2. **Check Supabase logs**: Dashboard → Logs → Auth Logs
3. **Check email service status**: Supabase status page
4. **Verify environment variables**: Ensure `NEXT_PUBLIC_SITE_URL` is set correctly in production
5. **Test with different email providers**: Some email providers block automated emails

## Additional Notes

- The code fix ensures emails always redirect to the domain they were sent from
- This prevents the localhost → production redirect issue
- Supabase configuration must allow both domains in redirect URLs
- Email confirmation is required for security - don't disable it

