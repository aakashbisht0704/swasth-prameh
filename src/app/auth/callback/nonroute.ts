import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'
import { ensureUserExists, getRedirectUrl } from '@/lib/auth-utils'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding' // Default to onboarding for new users

  if (code) {
    const cookieStore: { [key: string]: string } = {}
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore[name]
          },
          set(name: string, value: string, options: CookieOptions) {
            // This is handled by the response cookies
          },
          remove(name: string, options: CookieOptions) {
            // This is handled by the response cookies
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Get the user from the session
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        const user = session.user
        
        // Ensure user exists in database
        await ensureUserExists(user)
        
        // Get appropriate redirect URL
        const redirectUrl = await getRedirectUrl(user.id)
        
        // Determine the base URL for redirects
        // Priority: NEXT_PUBLIC_SITE_URL > x-forwarded-host > origin
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        const forwardedHost = request.headers.get('x-forwarded-host')
        const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        let baseUrl: string
        
        if (siteUrl) {
          // Use environment variable if set (best for production)
          baseUrl = siteUrl
        } else if (forwardedHost && !isLocalEnv) {
          // Use forwarded host header (Vercel provides this)
          baseUrl = `${forwardedProto}://${forwardedHost}`
        } else {
          // Fallback to origin (for local development)
          baseUrl = origin
        }
        
        return NextResponse.redirect(`${baseUrl}${redirectUrl}`)
      }
    }
  }

  // Return to auth page with error if something went wrong
  // Use the same URL resolution logic as successful redirect
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') || 'https'
  const isLocalEnv = process.env.NODE_ENV === 'development'
  
  let baseUrl: string
  if (siteUrl) {
    baseUrl = siteUrl
  } else if (forwardedHost && !isLocalEnv) {
    baseUrl = `${forwardedProto}://${forwardedHost}`
  } else {
    baseUrl = origin
  }
  
  return NextResponse.redirect(`${baseUrl}/auth?error=authentication_failed`)
}