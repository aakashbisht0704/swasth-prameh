import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from './src/lib/database.types'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Create a cookies instance
  const cookies = request.cookies
  const cookieStore: { [key: string]: string } = {}
  cookies.getAll().forEach((cookie) => {
    cookieStore[cookie.name] = cookie.value
  })

  // Create a Supabase client
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore[name]
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value,
            ...options
          })
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set({
            name,
            value: '',
            ...options
          })
        },
      },
    }
  )

  // Use authenticated user (more secure than relying on session alone)
  const { data: { user }, error } = await supabase.auth.getUser()
  
  // Debug logging
  console.log('Middleware auth check:', { 
    path: request.nextUrl.pathname,
    hasUser: !!user, 
    userId: user?.id,
    error: error?.message 
  })

  // Skip middleware for auth callback pages to avoid redirect loops
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    return res
  }

  // If user is signed in and the current path is / or /auth,
  // redirect the user to appropriate page based on onboarding status
  if (user && ["/", "/auth"].includes(request.nextUrl.pathname)) {
    try {
      // Check if user has completed onboarding
      const { data: onboarding } = await supabase
        .from('onboarding')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      const redirectUrl = onboarding ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // Fallback to onboarding page if there's an error
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  // Auth pages are accessible to those who are not logged in
  if (!user && request.nextUrl.pathname === '/auth') {
    return res
  }

  // Check auth condition for pages that require authentication
  const authenticatedPaths = ['/dashboard', '/onboarding', '/admin']
  if (!user && authenticatedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // If user is signed in but hasn't completed onboarding,
  // redirect them to the onboarding page (except for onboarding pages themselves)
  if (user && !request.nextUrl.pathname.startsWith('/onboarding') && !request.nextUrl.pathname.startsWith('/auth')) {
    try {
      const { data: onboarding } = await supabase
        .from('onboarding')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!onboarding) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }
    } catch (error) {
      console.error('Error checking onboarding status in middleware:', error)
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
