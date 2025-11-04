# Final OAuth Fix - Supabase Site URL Configuration

## Problem Confirmed ✅

When accessing `https://gdcfuasdaaveskiscqfl.supabase.co/auth/v1/callback` directly, it redirects to:
```
http://localhost:3000/?error=...
```

This **100% confirms** that your Supabase **Site URL** is set to `http://localhost:3000`.

## The Fix (CRITICAL)

### Step 1: Update Supabase Site URL

1. **Go to:** [Supabase Dashboard](https://app.supabase.com/)
2. **Select your project:** `gdcfuasdaaveskiscqfl`
3. **Navigate to:** Authentication → **URL Configuration**
4. **Find "Site URL"** field
5. **Change it from:** `http://localhost:3000`
6. **To:** `https://swasthprameh.com`

**⚠️ CRITICAL:**
- Must be `https://` (not `http://`)
- No trailing slash
- Exact domain: `swasthprameh.com` (not `swasthprameh.com/`)

### Step 2: Update Redirect URLs

In the same section, under **Redirect URLs**, make sure you have:

```
https://swasthprameh.com/auth/callback
https://swasthprameh.com/**
http://localhost:3000/auth/callback
```

**Important:**
- Production URLs first (with `https://`)
- Keep localhost for local development
- The `/**` wildcard allows all routes under your domain

### Step 3: Verify and Save

1. **Double-check** the Site URL is `https://swasthprameh.com` (not localhost)
2. **Click Save**
3. **Wait 5-10 minutes** (Supabase caches this configuration)

### Step 4: Test

1. **Wait 10 minutes** after saving
2. **Clear browser cache** / use incognito mode
3. **Try accessing directly again:**
   ```
   https://gdcfuasdaaveskiscqfl.supabase.co/auth/v1/callback
   ```
   **Expected:** Should redirect to `https://swasthprameh.com` (not localhost)

4. **Try OAuth flow:**
   - Go to `https://swasthprameh.com/auth`
   - Click "Continue with Google"
   - After Google auth, should redirect to `https://swasthprameh.com/auth/callback`

## Why This Happens

The OAuth flow works like this:

1. Your app sends: `redirectTo: https://swasthprameh.com/auth/callback` ✅
2. Google authenticates user ✅
3. Google redirects to: `https://gdcfuasdaaveskiscqfl.supabase.co/auth/v1/callback` ✅
4. **Supabase processes the callback** ❌
5. **Supabase checks if `redirectTo` URL is allowed** ❌
6. **If not allowed OR if Site URL is localhost, Supabase uses Site URL** ❌
7. **Result: Redirects to `http://localhost:3000`** ❌

## Verification Checklist

After making the change:

- [ ] Supabase Site URL = `https://swasthprameh.com` (not localhost)
- [ ] Redirect URLs include `https://swasthprameh.com/auth/callback`
- [ ] Redirect URLs include `https://swasthprameh.com/**`
- [ ] Saved the configuration
- [ ] Waited 10 minutes
- [ ] Tested direct callback URL access → redirects to production domain
- [ ] Tested OAuth flow → works correctly

## Still Not Working?

If after 10 minutes it's still redirecting to localhost:

1. **Double-check** you're editing the correct Supabase project
2. **Check for typos** in the Site URL
3. **Verify** you clicked "Save" (sometimes changes don't save)
4. **Check Supabase Auth Logs** for any error messages
5. **Try removing and re-adding** the redirect URLs

## Prevention

For future deployments:

- Always set Supabase Site URL to your production domain
- Keep localhost URLs only in Redirect URLs (not Site URL)
- Use environment-specific Supabase projects if needed (dev/staging/prod)

