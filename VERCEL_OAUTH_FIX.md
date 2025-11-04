# Fix: OAuth Redirecting to Localhost on Vercel

If Google OAuth is redirecting to `localhost` after authentication on your deployed Vercel app, follow these steps:

## Quick Fix Steps

### 1. Set Environment Variable in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add or update `NEXT_PUBLIC_SITE_URL`:
   
   **For HTTP domain (no SSL yet):**
   ```
   NEXT_PUBLIC_SITE_URL=http://swasthprameh.com
   ```
   
   **For HTTPS domain (after SSL setup):**
   ```
   NEXT_PUBLIC_SITE_URL=https://swasthprameh.com
   ```

5. **Important**: Make sure this is set for **Production** environment
6. **Redeploy** your application after adding/updating the variable

### 2. Check for Existing Localhost Values

If you have `NEXT_PUBLIC_SITE_URL` set to `http://localhost:3000` or similar, **remove it** or **update it** to your production domain.

### 3. Verify Supabase Configuration

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. **Site URL** should be: `http://swasthprameh.com` (or `https://` if you have SSL)
5. **Redirect URLs** should include:
   ```
   http://swasthprameh.com/auth/callback
   http://swasthprameh.com/**
   ```

### 4. Verify Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Select your OAuth 2.0 Client ID
4. **Authorized JavaScript origins** should include:
   ```
   http://swasthprameh.com
   https://swasthprameh.com  (if you have SSL)
   ```
5. **Authorized redirect URIs** should include:
   ```
   https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback
   http://swasthprameh.com/auth/callback
   https://swasthprameh.com/auth/callback  (if you have SSL)
   ```

## Code Changes Made

The code has been updated to:

1. **Better detect localhost**: The code now checks if `NEXT_PUBLIC_SITE_URL` contains localhost and ignores it in production
2. **Use request origin**: Falls back to the actual request origin if environment variable is not set or is localhost
3. **Handle HTTP properly**: Now correctly handles HTTP domains (not just HTTPS)

## Testing After Fix

1. **Clear browser cache** and cookies
2. Try the OAuth flow again
3. Check browser console for any errors
4. Verify the redirect URL in the console log (we added debug logging)

## Common Issues

### Issue: Still redirecting to localhost

**Solution**: 
- Make sure you **redeployed** after adding the environment variable
- Check that the variable is set for **Production** environment, not just Preview/Development
- Clear browser cache and try again

### Issue: Getting CORS errors

**Solution**:
- Verify your domain is added to Google Cloud Console authorized origins
- Check Supabase redirect URLs configuration

### Issue: "redirect_uri_mismatch" error

**Solution**:
- The redirect URI must exactly match what's in Google Cloud Console
- Make sure you're using `http://` (not `https://`) if you don't have SSL yet
- Verify Supabase callback URL is in the authorized redirect URIs

## After Adding SSL

Once you add SSL to your domain:

1. Update `NEXT_PUBLIC_SITE_URL` in Vercel to use `https://`
2. Update Supabase Site URL to use `https://`
3. Add `https://swasthprameh.com` to Google Cloud Console authorized origins
4. Redeploy your application

## Debugging

The code now includes console logs to help debug:
- Check browser console for `OAuth redirect URL:` log
- Check server logs for `Callback redirect baseUrl:` log

If you're still seeing localhost, check:
1. What the console log shows for `OAuth redirect URL`
2. What `NEXT_PUBLIC_SITE_URL` is set to in Vercel
3. Whether you've redeployed after changing environment variables

