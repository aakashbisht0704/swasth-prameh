# Session Management Troubleshooting

## Issues: Dashboard Redirect & Sign Out Not Working

You're experiencing two related authentication issues:
1. Dashboard always redirects to `/auth` even when user is signed in
2. Sign out button doesn't work properly

## Root Causes & Fixes Applied

### 1. **Sign Out Functionality Fixed**

#### Problem:
- Sign out button wasn't redirecting after logout
- No error handling for sign out failures

#### Fix Applied:
```typescript
// Before (Broken):
const handleSignOut = async () => {
  await supabase.auth.signOut()
}

// After (Fixed):
const handleSignOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
      alert('Error signing out: ' + error.message)
    } else {
      // Redirect to auth page after successful sign out
      window.location.href = '/auth'
    }
  } catch (error) {
    console.error('Sign out error:', error)
    alert('Error signing out')
  }
}
```

### 2. **Session Debugging Added**

#### Dashboard Page:
- Added console logging to see session status
- Added error handling for session retrieval
- Will help identify if session is being lost

#### Middleware:
- Added session debugging for all requests
- Will show session status for each route
- Helps identify where session is being lost

## Debugging Steps

### Step 1: Check Console Logs
1. **Open browser developer tools**
2. **Go to Console tab**
3. **Navigate to `/dashboard`**
4. **Look for these logs:**
   ```
   Middleware session check: { path: "/dashboard", hasSession: true/false, userId: "...", error: "..." }
   Dashboard session check: { hasSession: true/false, userId: "...", error: "..." }
   ```

### Step 2: Test Sign Out
1. **Click the Sign Out button**
2. **Check console for any errors**
3. **Verify redirect to `/auth` page**

### Step 3: Check Session Persistence
1. **Sign in successfully**
2. **Check if session persists across page refreshes**
3. **Look for session-related errors in console**

## Common Issues & Solutions

### Issue 1: Session Not Persisting
**Symptoms:** Session lost on page refresh
**Solution:** Check if cookies are being set properly

### Issue 2: Middleware Blocking Dashboard
**Symptoms:** Middleware shows no session for dashboard
**Solution:** Check middleware logic and session refresh

### Issue 3: Cookie Issues
**Symptoms:** Session cookies not being read properly
**Solution:** Verify cookie settings and domain

### Issue 4: Database Connection Issues
**Symptoms:** Session exists but onboarding check fails
**Solution:** Check database connection and table setup

## Testing the Fixes

### 1. **Test Authentication Flow:**
- Sign in with email/password
- Check console logs for session creation
- Navigate to dashboard
- Verify no redirect to auth

### 2. **Test Sign Out:**
- Click sign out button
- Verify redirect to auth page
- Check that session is cleared

### 3. **Test Session Persistence:**
- Sign in successfully
- Refresh the page
- Verify session persists
- Navigate between pages

## Next Steps Based on Debug Output

### If Session Shows as `null`:
1. Check if user actually signed in successfully
2. Verify cookies are being set
3. Check for authentication errors

### If Session Exists but Dashboard Redirects:
1. Check middleware logic
2. Verify onboarding status check
3. Look for database connection issues

### If Sign Out Still Doesn't Work:
1. Check for JavaScript errors
2. Verify Supabase client is working
3. Test with different browsers

## Expected Debug Output

### Successful Authentication:
```
Middleware session check: { path: "/dashboard", hasSession: true, userId: "uuid-here", error: null }
Dashboard session check: { hasSession: true, userId: "uuid-here", error: null }
```

### Failed Authentication:
```
Middleware session check: { path: "/dashboard", hasSession: false, userId: null, error: "..." }
Dashboard session check: { hasSession: false, userId: null, error: "..." }
No session found, redirecting to auth
```

## Additional Debugging

If issues persist, check:
1. **Environment variables** are set correctly
2. **Supabase project** is configured properly
3. **Database tables** exist and are accessible
4. **Cookie settings** in browser
5. **Network requests** in browser dev tools

The debug logs will help identify exactly where the session is being lost! 🔍
