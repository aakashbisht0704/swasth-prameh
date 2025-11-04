# OAuth Localhost Redirect - Complete Fix Checklist

## Immediate Actions

### 1. Verify Supabase Site URL (CRITICAL)

**Go to:** Supabase Dashboard → Your Project → Authentication → URL Configuration

**Site URL MUST be:**
```
https://swasthprameh.com
```

**Check for these common mistakes:**
- ❌ `http://swasthprameh.com` (wrong - must be https)
- ❌ `https://swasthprameh.com/` (trailing slash)
- ❌ `http://localhost:3000` (localhost)
- ❌ `https://your-app.vercel.app` (wrong domain)

**✅ Correct:**
```
https://swasthprameh.com
```

### 2. Verify Supabase Redirect URLs

In the same section, **Redirect URLs** must include:

```
https://swasthprameh.com/auth/callback
https://swasthprameh.com/**
```

**Important:**
- No trailing slash on `/auth/callback`
- Must use `https://` (not `http://`)
- The `/**` wildcard allows all routes
- Keep localhost entries for development: `http://localhost:3000/auth/callback`

### 3. Check Vercel Environment Variable

**Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables

**Find `NEXT_PUBLIC_SITE_URL` and verify:**
- ✅ Value: `https://swasthprameh.com`
- ✅ Environment: **Production** (not just Preview/Development)
- ✅ No duplicate entries with different values

**If you see `http://localhost:3000` in Production, DELETE IT or UPDATE IT**

### 4. Wait for Supabase Cache to Clear

**Supabase caches redirect URLs for 5-10 minutes.**

After changing Supabase configuration:
1. Wait 10 minutes
2. Clear browser cache
3. Try again in incognito mode

### 5. Check Network Request

1. Open browser DevTools → Network tab
2. Click "Continue with Google"
3. Find the request to Supabase (contains `auth/v1/authorize`)
4. Check the **Request URL** - should contain:
   ```
   redirect_to=https%3A%2F%2Fswasthprameh.com%2Fauth%2Fcallback
   ```
   (URL encoded version of `https://swasthprameh.com/auth/callback`)

5. If it shows `localhost` in the request, the issue is in your code (check console logs)
6. If it shows the correct URL but still redirects to localhost, the issue is in Supabase configuration

### 6. Check Browser Console

After clicking "Continue with Google", check console for:

```
=== Google OAuth Initiation ===
OAuth redirect URL: https://swasthprameh.com/auth/callback
Current origin: https://swasthprameh.com
NEXT_PUBLIC_SITE_URL: https://swasthprameh.com
Absolute redirect URL: https://swasthprameh.com/auth/callback
```

**If any of these show localhost, fix that first.**

### 7. Verify Correct Supabase Project

**Make sure you're editing the correct Supabase project!**

1. Check your Vercel `NEXT_PUBLIC_SUPABASE_URL` value
2. Go to that exact Supabase project
3. Edit URL configuration there

**Common mistake:** Editing Project A while app uses Project B

### 8. Check Supabase Auth Logs

1. Supabase Dashboard → Logs → Auth Logs
2. Look for recent OAuth attempts
3. Check for error messages about redirect URLs
4. See what redirect URL Supabase actually used

### 9. Test Direct URL

Try this URL directly (replace with your Supabase project ref):

```
https://[YOUR_PROJECT_REF].supabase.co/auth/v1/authorize?provider=google&redirect_to=https://swasthprameh.com/auth/callback
```

**Expected behavior:**
1. Redirects to Google
2. After Google auth, redirects to `https://swasthprameh.com/auth/callback`

**If it redirects to localhost:**
- Supabase Site URL is definitely wrong
- Or redirect URL not in allowed list

### 10. Nuclear Option: Reset Supabase Configuration

If nothing works:

1. **Remove ALL redirect URLs** except your production one
2. Set **Site URL** to `https://swasthprameh.com`
3. Set **Redirect URLs** to only:
   ```
   https://swasthprameh.com/**
   ```
4. Wait 10 minutes
5. Test in incognito mode
6. If it works, add back localhost for development

## What to Check After Each Change

After making any change:

1. ✅ Wait 5-10 minutes (Supabase cache)
2. ✅ Clear browser cache / use incognito
3. ✅ Redeploy Vercel app (if changed env vars)
4. ✅ Check browser console logs
5. ✅ Check network tab request
6. ✅ Test OAuth flow

## Still Not Working?

If you've verified everything above and it's still redirecting to localhost:

1. **Share these details:**
   - Screenshot of Supabase URL Configuration
   - Browser console logs (from OAuth initiation)
   - Network tab showing the Supabase authorize request
   - Vercel environment variables (blur sensitive values)

2. **Check if it's a Supabase bug:**
   - Try creating a new Supabase project
   - Test OAuth there
   - If it works, there might be a configuration issue in the original project

3. **Alternative workaround:**
   - Use Supabase's server-side callback handler
   - Handle the redirect in your own code
   - This is more complex but gives you full control

## Most Likely Causes (in order)

1. **Supabase Site URL is localhost** (90% of cases)
2. **Redirect URL not in allowed list** (format mismatch)
3. **Wrong Supabase project** (editing wrong project)
4. **Environment variable not set in Production** (only set in Preview/Dev)
5. **Supabase cache** (recently changed but cache not cleared)

