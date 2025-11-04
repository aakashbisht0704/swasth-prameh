# Google OAuth Setup Guide for Vercel Deployment

This guide walks you through configuring Google OAuth for your SwasthPrameh application deployed on Vercel.

## Prerequisites

- Google Cloud Console account
- Supabase project
- Vercel deployment URL

## Step 1: Configure Google Cloud Console

### 1.1 Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type (unless you have a Google Workspace)
   - Fill in required fields:
     - App name: `SwasthPrameh`
     - User support email: Your email
     - Developer contact information: Your email
   - Click **Save and Continue**
   - Add scopes (at minimum): `email`, `profile`, `openid`
   - Add test users if in testing phase
   - Complete the consent screen setup

### 1.2 Create OAuth Client ID

1. Application type: **Web application**
2. Name: `SwasthPrameh - Vercel`
3. **Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   https://your-custom-domain.com
   http://localhost:3000
   ```
   > **Important**: Add both your Vercel URL and localhost for development

4. **Authorized redirect URIs**:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   https://your-app.vercel.app/auth/callback
   https://your-custom-domain.com/auth/callback
   http://localhost:3000/auth/callback
   ```
   > **Critical**: The Supabase callback URL is required. Format: `https://[YOUR_SUPABASE_PROJECT_REF].supabase.co/auth/v1/callback`

5. Click **Create**
6. **Save the Client ID and Client Secret** - you'll need these for Supabase

### 1.3 Example URLs

Replace these placeholders with your actual values:

- **Vercel URL**: `https://swasth-prameh.vercel.app`
- **Custom Domain**: `https://swasthprameh.com` (if you have one)
- **Supabase Project Ref**: Found in your Supabase project settings URL

## Step 2: Configure Supabase

### 2.1 Add Google OAuth Provider

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the provider list
5. Enable Google provider
6. Enter your **Client ID** and **Client Secret** from Google Cloud Console
7. Click **Save**

### 2.2 Configure Redirect URLs in Supabase

1. Still in **Authentication** → **URL Configuration**
2. **Site URL**: Set to your Vercel deployment URL
   ```
   https://your-app.vercel.app
   ```
3. **Redirect URLs**: Add all your callback URLs
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/**
   https://your-custom-domain.com/auth/callback
   https://your-custom-domain.com/**
   ```
   > Note: The `/**` pattern allows all routes under your domain

## Step 3: Configure Vercel Environment Variables

### 3.1 Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

#### Required Variables

```bash
# Supabase Configuration (you should already have these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Site URL for OAuth redirects (IMPORTANT!)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

#### Optional Variables

```bash
# If using custom domain
NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com

# Groq API (if using)
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.1-8b-instant
```

### 3.2 Environment-Specific Configuration

Set these for **Production**, **Preview**, and **Development**:

- **Production**: Use your production domain
- **Preview**: Use preview URLs (Vercel generates these automatically)
- **Development**: Use `http://localhost:3000`

> **Tip**: For preview deployments, you can use a wildcard pattern in Google Cloud Console: `https://*.vercel.app`

## Step 4: Update Codebase (Already Done)

The following changes have been made to support production OAuth:

1. ✅ `src/components/auth-form.tsx` - Uses `NEXT_PUBLIC_SITE_URL` for redirect URLs
2. ✅ `env.example` - Added `NEXT_PUBLIC_SITE_URL` configuration
3. ✅ Callback handlers already support production URLs

## Step 5: Testing

### 5.1 Local Testing

1. Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Test Google OAuth:
   - Go to `http://localhost:3000/auth`
   - Click "Continue with Google"
   - Complete OAuth flow
   - Verify redirect to `/auth/callback` then to dashboard/onboarding

### 5.2 Production Testing

1. Deploy to Vercel (or ensure latest deployment)
2. Verify environment variables are set correctly
3. Test OAuth flow on production URL
4. Check browser console for any errors

## Common Issues and Solutions

### Issue 1: "redirect_uri_mismatch" Error

**Cause**: The redirect URI in the OAuth request doesn't match what's configured in Google Cloud Console.

**Solution**:
1. Verify the redirect URI in Google Cloud Console matches exactly
2. Check that `NEXT_PUBLIC_SITE_URL` is set correctly in Vercel
3. Ensure Supabase callback URL is in the authorized redirect URIs

### Issue 2: OAuth Works Locally But Not on Vercel

**Cause**: Missing or incorrect `NEXT_PUBLIC_SITE_URL` environment variable.

**Solution**:
1. Check Vercel environment variables
2. Ensure `NEXT_PUBLIC_SITE_URL` is set to your Vercel URL
3. Redeploy after adding the variable

### Issue 3: Callback Redirects to Wrong URL

**Cause**: The callback handler might not be handling the production URL correctly.

**Solution**:
- The callback handler (`src/app/auth/callback/nonroute.ts`) already handles this
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly
- Check Supabase redirect URLs configuration

### Issue 4: "Invalid Client" Error

**Cause**: Client ID or Client Secret mismatch between Google Cloud Console and Supabase.

**Solution**:
1. Verify credentials in Supabase match Google Cloud Console
2. Ensure you're using the correct OAuth client (not iOS/Android client)
3. Re-enter credentials in Supabase

## Security Best Practices

1. **Never commit credentials**: Keep Client ID and Client Secret in environment variables only
2. **Use HTTPS**: Always use HTTPS in production (Vercel provides this automatically)
3. **Limit redirect URIs**: Only add the exact URLs you need in Google Cloud Console
4. **Regular credential rotation**: Periodically rotate your OAuth credentials
5. **Monitor OAuth usage**: Check Google Cloud Console for unusual activity

## Vercel-Specific Considerations

### Automatic Preview Deployments

Vercel creates preview URLs for each branch/PR. To support these:

1. In Google Cloud Console, add a wildcard pattern:
   ```
   https://*.vercel.app
   ```

2. Or add specific preview URLs as needed

### Custom Domain Setup

If you're using a custom domain:

1. Add the custom domain in Vercel project settings
2. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
3. Add custom domain to Google Cloud Console authorized origins
4. Add custom domain callback URL to Supabase redirect URLs

## Verification Checklist

Before going live, verify:

- [ ] Google OAuth credentials created in Google Cloud Console
- [ ] Authorized JavaScript origins include your Vercel URL
- [ ] Authorized redirect URIs include Supabase callback URL
- [ ] Google OAuth enabled in Supabase dashboard
- [ ] Client ID and Secret added to Supabase
- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel environment variables
- [ ] Supabase site URL configured to your Vercel URL
- [ ] Supabase redirect URLs include your callback path
- [ ] OAuth flow tested locally
- [ ] OAuth flow tested on production URL

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Vercel function logs
3. Verify all URLs match exactly (including trailing slashes)
4. Test with a fresh incognito window
5. Clear browser cookies and try again

