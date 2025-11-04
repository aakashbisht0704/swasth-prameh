'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import countryCodes from './country-codes.json' // You need to create this file or use a package
import { useRouter } from 'next/navigation'
import { ensureUserExists, getRedirectUrl } from '@/lib/auth-utils'
import toast from 'react-hot-toast'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [usePhone, setUsePhone] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countryCode, setCountryCode] = useState('+1')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (usePhone) {
        const fullPhone = `${countryCode}${phone.replace(/^0+/, '')}`
        if (!otpSent) {
          // Send OTP
          const { error } = await supabase.auth.signInWithOtp({
            phone: fullPhone,
            options: { channel: 'sms' },
          })
          if (error) throw error
          setOtpSent(true)
          toast.success('OTP sent to your phone number.')
        } else {
          // Verify OTP
          const { error } = await supabase.auth.verifyOtp({
            phone: fullPhone,
            token: otp,
            type: 'sms',
          })
          if (error) throw error
          toast.success('Phone authentication successful!')
          await handlePostAuthRedirect();
        }
      } else {
        if (isSignUp) {
          // Use environment variable in production, fallback to location.origin for development
          const emailRedirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
            ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
            : `${location.origin}/auth/callback`
          
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: emailRedirectUrl,
            },
          })
          if (error) throw error
          // Email sign up: user must verify email, so don't redirect yet
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (error) throw error
          await handlePostAuthRedirect();
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
      // Use environment variable in production, fallback to location.origin for development
      const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
        : `${location.origin}/auth/callback`
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      })
      if (error) throw error
      // Google OAuth will redirect to callback, which should handle onboarding/dashboard redirect
    } catch (error: any) {
      console.error('Google sign in error:', error)
      toast.error(error?.message || 'An error occurred during Google sign in')
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
        <CardDescription>
          {isSignUp
            ? 'Sign up to start your diabetes care journey'
            : 'Sign in to access your dashboard'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-2">
            <Button
              type="button"
              variant={usePhone ? 'default' : 'outline'}
              className="mr-2"
              onClick={() => setUsePhone(true)}
            >
              Phone
            </Button>
            <Button
              type="button"
              variant={!usePhone ? 'default' : 'outline'}
              onClick={() => setUsePhone(false)}
            >
              Email
            </Button>
          </div>
          {usePhone ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="country">Country Code</Label>
                <select
                  id="country"
                  className="w-full p-2 rounded border border-zinc-700 bg-zinc-900 text-white"
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  required
                >
                  {countryCodes.map(({ code, name }) => (
                    <option key={code} value={code}>{name} ({code})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="555 123 4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  disabled={otpSent}
                />
              </div>
              {otpSent && (
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </>
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
              : usePhone
                ? otpSent
                  ? 'Verify OTP'
                  : 'Send OTP'
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
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}