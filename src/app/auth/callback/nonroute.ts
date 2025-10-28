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
        
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${redirectUrl}`)
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
        } else {
          return NextResponse.redirect(`${origin}${redirectUrl}`)
        }
      }
    }
  }

  // Return to auth page with error if something went wrong
  return NextResponse.redirect(`${origin}/auth?error=authentication_failed`)
}