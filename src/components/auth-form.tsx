'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { ensureUserExists, getRedirectUrl } from '@/lib/auth-utils'
import toast from 'react-hot-toast'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter();

  const handlePostAuthRedirect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Ensure user exists in database
      await ensureUserExists(user);
      
      // Get appropriate redirect URL
      const redirectUrl = await getRedirectUrl(user.id);
      router.push(redirectUrl);
    } catch (error: any) {
      console.error('Error in post-auth redirect:', error);
      // Fallback to onboarding page
      router.push('/onboarding');
    }
  };

  const validatePassword = (): boolean => {
    if (isSignUp) {
      if (password.length < 6) {
        setPasswordError('Password must be at least 6 characters long')
        return false
      }
      if (password !== confirmPassword) {
        setPasswordError('Passwords do not match')
        return false
      }
      setPasswordError('')
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password for signup
    if (isSignUp && !validatePassword()) {
      return
    }
    
    setLoading(true)
    setPasswordError('')
    
    try {
      if (isSignUp) {
          // Always use the current origin for email redirects to ensure consistency
          // This way, emails sent from localhost redirect to localhost, and emails from production redirect to production
          const emailRedirectUrl = `${location.origin}/auth/callback`
          
          console.log('Sign up - Email redirect URL:', emailRedirectUrl)
          console.log('Current origin:', location.origin)
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: emailRedirectUrl,
            },
          })
          if (error) throw error
          
          // Check if email confirmation is required
          if (data.user && !data.session) {
            // Email confirmation required
            toast.success('Account created! Please check your email to verify your account before signing in.', {
              duration: 6000,
            })
            // Reset form
            setEmail('')
            setPassword('')
            setConfirmPassword('')
            setIsSignUp(false) // Switch to sign in mode
          } else if (data.session) {
            // Email confirmation not required (or already confirmed)
            toast.success('Account created successfully!')
            await handlePostAuthRedirect()
          } else {
            // Unexpected case - no user and no session
            throw new Error('Account creation failed. Please try again.')
          }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          // Handle specific error cases
          if (error.message.includes('Invalid login credentials') || error.message.includes('Invalid')) {
            throw new Error('Invalid email or password. Please check your credentials and try again.')
          } else if (error.message.includes('Email not confirmed') || error.message.includes('not confirmed')) {
            throw new Error('Please verify your email address before signing in. Check your inbox for the confirmation link. If you didn\'t receive it, you can request a new one by signing up again.')
          } else if (error.message.includes('rate limit')) {
            throw new Error('Too many sign-in attempts. Please wait a few minutes and try again.')
          }
          throw error
        }
        
        // Check if we have a session
        if (data.session) {
          toast.success('Signed in successfully!')
          await handlePostAuthRedirect()
        } else {
          // No session - might need email confirmation
          throw new Error('Please verify your email address before signing in. Check your inbox for the confirmation link.')
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      toast.error(error?.message || 'An error occurred during authentication')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // Determine redirect URL - prioritize environment variable, but ensure it's not localhost in production
      let redirectUrl: string
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
      const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      
      if (siteUrl && !siteUrl.includes('localhost') && !isLocalhost) {
        // Use environment variable if set and not localhost (production)
        redirectUrl = `${siteUrl}/auth/callback`
      } else if (isLocalhost) {
        // Development - use localhost
        redirectUrl = `${location.origin}/auth/callback`
      } else {
        // Production without env var - use current origin (should be your domain)
        redirectUrl = `${location.origin}/auth/callback`
      }
      
      console.log('=== Google OAuth Initiation ===')
      console.log('OAuth redirect URL:', redirectUrl)
      console.log('Current origin:', location.origin)
      console.log('Current hostname:', location.hostname)
      console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
      console.log('Full location:', location.href)
      
      // Try to ensure the redirect URL is absolute and correct
      const absoluteRedirectUrl = redirectUrl.startsWith('http') 
        ? redirectUrl 
        : `${location.protocol}//${location.host}${redirectUrl}`
      
      console.log('Absolute redirect URL:', absoluteRedirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: absoluteRedirectUrl,
          queryParams: {
            // Force the redirect URL in query params too
            redirect_to: absoluteRedirectUrl,
          },
        },
      })
      
      console.log('OAuth response:', { data, error })
      if (error) throw error
      // Google OAuth will redirect to callback, which should handle onboarding/dashboard redirect
    } catch (error: any) {
      console.error('Google sign in error:', error)
      toast.error(error?.message || 'An error occurred during Google sign in')
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
        <CardDescription className="text-base">
          {isSignUp
            ? 'Sign up to start your personalized Ayurvedic diabetes care journey'
            : 'Sign in to access your dashboard and personalized plans'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder={isSignUp ? "At least 6 characters" : "Enter your password"}
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              required
              disabled={loading}
            />
            {isSignUp && (
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value)
                  setPasswordError('')
                }}
                required
                disabled={loading}
              />
              {passwordError && (
                <p className="text-xs text-destructive">{passwordError}</p>
              )}
            </div>
          )}
          {!isSignUp && (
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="link"
                className="text-xs h-auto p-0"
                onClick={() => {
                  if (!email) {
                    toast.error('Please enter your email address first')
                    return
                  }
                  toast('If you haven\'t received a confirmation email, please sign up again with the same email to receive a new confirmation link.', {
                    duration: 5000,
                    icon: 'ℹ️',
                  })
                  setIsSignUp(true)
                }}
              >
                Didn't receive confirmation email?
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-xs h-auto p-0"
                onClick={async () => {
                  if (!email) {
                    toast.error('Please enter your email address first')
                    return
                  }
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/auth/reset-password`,
                    })
                    if (error) throw error
                    toast.success('Password reset email sent! Check your inbox.')
                  } catch (error: any) {
                    toast.error(error?.message || 'Failed to send reset email')
                  }
                }}
              >
                Forgot password?
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : isSignUp
                ? 'Sign Up'
                : 'Sign In'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setPasswordError('')
              setPassword('')
              setConfirmPassword('')
              setEmail('')
            }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
          {isSignUp && (
            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  )
}