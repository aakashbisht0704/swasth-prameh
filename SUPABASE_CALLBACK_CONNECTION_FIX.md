# Fix: Supabase Callback Connection Error

## Problem Identified

From the network tab, the error is:
```
gdcfuasdaaveskiscqfl.supabase.co/auth/v1/callback?state=...
Status: (failed) net::ERR_CONNECTION_...
```

This is **Supabase's internal callback URL** that Google redirects to after authentication. The connection is failing before it even reaches your application.

## Root Causes

### 1. Supabase Project is Paused (Most Common)

**Free tier Supabase projects pause after 7 days of inactivity.**

**Check if your project is paused:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Look at your project
3. If you see a message like "Project is paused" or "Restore project", click it

**Solution:**
- Click "Restore project" or "Resume"
- Wait 1-2 minutes for the project to fully restart
- Try OAuth again

### 2. Incorrect Supabase Project URL

**Verify your Supabase URL matches:**

1. Go to Supabase Dashboard → Your Project → Settings → API
2. Check the **Project URL** - should be: `https://gdcfuasdaaveskiscqfl.supabase.co`
3. Compare with your Vercel environment variable `NEXT_PUBLIC_SUPABASE_URL`

**If they don't match:**
- Update `NEXT_PUBLIC_SUPABASE_URL` in Vercel to match the correct project URL
- Redeploy your application

### 3. DNS/Network Issue

**The connection error could be:**
- Temporary network issue
- DNS propagation delay
- Firewall blocking the connection

**Test the Supabase URL directly:**
1. Open a new tab
2. Try to access: `https://gdcfuasdaaveskiscqfl.supabase.co`
3. If it doesn't load, the project is likely paused
4. If it loads, check the API status

### 4. Supabase Service Outage

**Check Supabase status:**
- [Supabase Status Page](https://status.supabase.com/)
- Check if there are any ongoing issues

## Solutions

### Solution 1: Restore Paused Supabase Project

1. **Go to Supabase Dashboard**
2. **Select your project**
3. **If paused, click "Restore" or "Resume"**
4. **Wait 2-3 minutes** for full restart
5. **Test OAuth again**

### Solution 2: Verify Project URL Configuration

1. **Supabase Dashboard** → **Settings** → **API**
2. **Copy the Project URL** (should be like `https://xxxxx.supabase.co`)
3. **Go to Vercel** → **Settings** → **Environment Variables**
4. **Verify `NEXT_PUBLIC_SUPABASE_URL`** matches exactly
5. **If different, update and redeploy**

### Solution 3: Check Supabase Project Settings

1. **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Site URL:** Should be `https://swasthprameh.com`
3. **Redirect URLs:** Should include:
   ```
   https://swasthprameh.com/auth/callback
   https://swasthprameh.com/**
   ```

### Solution 4: Test Supabase Connection

**Test if Supabase is accessible:**

1. Open browser console
2. Run:
   ```javascript
   fetch('https://gdcfuasdaaveskiscqfl.supabase.co/rest/v1/', {
     headers: {
       'apikey': 'YOUR_ANON_KEY'
     }
   })
   ```
3. If this fails, the project is likely paused or the URL is wrong

## Quick Diagnostic Steps

### Step 1: Check Supabase Dashboard

1. Go to [app.supabase.com](https://app.supabase.com/)
2. Open your project
3. **Look for any pause/restore messages**
4. If paused → **Restore it**

### Step 2: Verify Environment Variables

1. **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Check `NEXT_PUBLIC_SUPABASE_URL`:
   - Should be: `https://gdcfuasdaaveskiscqfl.supabase.co`
   - Must match exactly (no trailing slash)

### Step 3: Test Direct Access

1. Open a new browser tab
2. Navigate to: `https://gdcfuasdaaveskiscqfl.supabase.co`
3. **Expected:** Should load or show a Supabase page
4. **If it fails:** Project is paused or URL is wrong

### Step 4: Check Google Cloud Console

1. **Google Cloud Console** → **APIs & Services** → **Credentials**
2. **Select your OAuth client**
3. **Authorized redirect URIs** must include:
   ```
   https://gdcfuasdaaveskiscqfl.supabase.co/auth/v1/callback
   ```
   This is the Supabase callback URL that's failing.

## Most Likely Fix

**99% chance your Supabase project is paused.**

1. Go to Supabase Dashboard
2. Look for "Project is paused" message
3. Click "Restore" or "Resume"
4. Wait 2-3 minutes
5. Try OAuth again

## After Restoring Project

1. **Wait 2-3 minutes** for project to fully restart
2. **Clear browser cache** / use incognito
3. **Try OAuth flow again**
4. **Check network tab** - should see successful connection to Supabase callback

## If Project is Active But Still Failing

1. **Check Supabase logs:** Dashboard → Logs → Auth Logs
2. **Verify Google OAuth credentials** in Supabase:
   - Dashboard → Authentication → Providers → Google
   - Ensure Client ID and Secret are correct
3. **Check Google Cloud Console:**
   - Authorized redirect URIs must include the Supabase callback URL
4. **Test with a simple API call** to verify Supabase is accessible

## Prevention

To prevent your project from pausing:
- **Upgrade to Pro plan** (projects don't pause)
- **Use your project regularly** (at least once per week)
- **Set up monitoring** to keep the project active

