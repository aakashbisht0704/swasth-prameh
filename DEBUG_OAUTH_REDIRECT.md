# Debug: OAuth Still Redirecting to Localhost

If you've configured everything correctly but it's still redirecting to localhost, follow these debugging steps:

## Step 1: Check Browser Console

After clicking "Continue with Google", check the browser console. You should see:
```
=== Google OAuth Initiation ===
OAuth redirect URL: https://swasthprameh.com/auth/callback
Current origin: https://swasthprameh.com
...
```

**What to check:**
- Is `OAuth redirect URL` showing `https://swasthprameh.com/auth/callback`? ✅
- Is `NEXT_PUBLIC_SITE_URL` showing your production URL? ✅
- Is `Current origin` showing your production domain? ✅

## Step 2: Check Network Tab

1. Open browser DevTools → Network tab
2. Click "Continue with Google"
3. Look for the request to Supabase (usually contains `auth/v1/authorize`)
4. Check the **Request URL** - it should contain `redirect_to=https://swasthprameh.com/auth/callback`
5. Check the **Response** - see what URL Supabase is redirecting to

## Step 3: Verify Supabase Configuration (Again)

Go to Supabase Dashboard → Authentication → URL Configuration:

### Site URL
**Must be exactly:**
```
https://swasthprameh.com
```

**NOT:**
- `http://swasthprameh.com` (wrong protocol)
- `https://swasthprameh.com/` (trailing slash might cause issues)
- `http://localhost:3000` (localhost)

### Redirect URLs
**Must include EXACTLY:**
```
https://swasthprameh.com/auth/callback
```

**Also add:**
```
https://swasthprameh.com/**
```

**Important:**
- No trailing slash on the callback URL
- Protocol must match (`https://` not `http://`)
- Must match exactly (case-sensitive)

## Step 4: Check for Multiple Supabase Projects

**Are you using the correct Supabase project?**

1. Check your `.env` or Vercel environment variables
2. Verify `NEXT_PUBLIC_SUPABASE_URL` matches the project you're configuring
3. Make sure you're editing the URL configuration in the **same project** that your app is using

## Step 5: Clear All Caches

1. **Supabase might cache redirect URLs** - Wait 5-10 minutes after changing configuration
2. **Browser cache** - Use incognito/private window
3. **Vercel cache** - Redeploy your application
4. **CDN cache** - If using Cloudflare or similar, clear cache

## Step 6: Check Supabase Auth Logs

1. Go to Supabase Dashboard → Logs → Auth Logs
2. Look for recent OAuth attempts
3. Check for any error messages about redirect URLs
4. See what redirect URL Supabase is actually using

## Step 7: Manual URL Test

Try accessing this URL directly in your browser (replace with your actual Supabase project URL):
```
https://[YOUR_PROJECT_REF].supabase.co/auth/v1/authorize?provider=google&redirect_to=https://swasthprameh.com/auth/callback
```

This should:
1. Redirect to Google
2. After Google auth, redirect back to `https://swasthprameh.com/auth/callback`

If it redirects to localhost, the issue is definitely in Supabase configuration.

## Step 8: Check Vercel Environment Variables

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Check **all environments** (Production, Preview, Development)
3. Make sure `NEXT_PUBLIC_SITE_URL` is set correctly in **Production**
4. Make sure there's no conflicting value in Development or Preview

**Important:** Check if you have multiple values:
- Production: `https://swasthprameh.com` ✅
- Development: `http://localhost:3000` ✅ (this is OK for local dev)
- Preview: Make sure this is also set correctly

## Step 9: Check Server Logs

After deploying, check Vercel function logs:
1. Vercel Dashboard → Your Project → Functions
2. Look for the `/auth/callback` function
3. Check the console logs we added - you should see:
   ```
   === OAuth Callback Debug ===
   Request URL: ...
   Origin: ...
   ```

## Step 10: Try Alternative Approach

If nothing works, try this temporary workaround:

1. In Supabase, set **Site URL** to your production domain
2. Set **Redirect URLs** to just: `https://swasthprameh.com/**`
3. Remove the specific `/auth/callback` entry
4. The `/**` wildcard should allow all routes

## Common Mistakes

### ❌ Wrong Protocol
```
Site URL: http://swasthprameh.com  (should be https://)
```

### ❌ Trailing Slash
```
Redirect URLs: https://swasthprameh.com/auth/callback/  (should not have trailing slash)
```

### ❌ Wrong Supabase Project
Editing URL configuration in Project A, but app is using Project B

### ❌ Environment Variable Not Set
`NEXT_PUBLIC_SITE_URL` is missing or set to localhost in Vercel Production

### ❌ Cached Configuration
Supabase caches redirect URLs - wait a few minutes after changes

## What to Share if Still Not Working

If you've tried everything and it's still not working, share:

1. Screenshot of Supabase URL Configuration page
2. Screenshot of Vercel Environment Variables (blur sensitive values)
3. Browser console logs (from the OAuth initiation)
4. Network tab showing the Supabase authorize request
5. Supabase Auth Logs showing the OAuth attempt

This will help identify the exact issue.

