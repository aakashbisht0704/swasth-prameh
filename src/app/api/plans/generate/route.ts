import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_id } = body
    
    console.log('Generate plan request for user:', user_id)
    
    // Fetch user's onboarding data to build context
    const { data: onboarding, error: onboardingError } = await supabase
      .from('onboarding')
      .select('*')
      .eq('user_id', user_id)
      .single()
    
    if (onboardingError) {
      console.error('Onboarding error:', onboardingError)
      return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 400 })
    }
    
    if (!onboarding) {
      return NextResponse.json({ error: 'No onboarding data found' }, { status: 400 })
    }
    
    // Build context for LLM
    const context = {
      prakriti: onboarding.prakriti,
      dominant_dosha: onboarding.dominant_dosha,
      lifestyle: onboarding.lifestyle,
      medical_history: onboarding.medical_history,
      allergies: onboarding.allergies,
      investigation: onboarding.investigation || null, // Include investigation data
    }
    
    console.log('Context:', context)
    
    const llmUrl = process.env.LLM_SERVER_URL || process.env.NEXT_PUBLIC_LLM_SERVER_URL
    if (!llmUrl) {
      return NextResponse.json({ error: 'LLM_SERVER_URL not set' }, { status: 500 })
    }

    // Ensure URL is properly formatted
    let normalizedUrl = llmUrl.trim().replace(/\/$/, '')
    // If URL doesn't have a protocol, determine the correct one
    if (!normalizedUrl.match(/^https?:\/\//)) {
      // Docker service names or localhost should use HTTP
      if (normalizedUrl.includes('localhost') || 
          normalizedUrl.includes('127.0.0.1') || 
          normalizedUrl.includes(':8002') || 
          normalizedUrl.match(/^[a-z-]+:\d+$/)) { // Docker service names like "ml:8002"
        normalizedUrl = `http://${normalizedUrl}`
      } else {
        // For public domains without explicit port, use HTTPS
        normalizedUrl = `https://${normalizedUrl}`
      }
    }

    console.log('Calling LLM service at:', `${normalizedUrl}/generate-plan`)

    try {
      const res = await fetch(`${normalizedUrl}/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, context }),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error('LLM error:', data)
        return NextResponse.json({ error: data?.error || 'LLM error' }, { status: 500 })
      }
      
      console.log('Plan generated successfully')
      return NextResponse.json(data)
    } catch (fetchError: any) {
      // Handle SSL/connection errors
      if (fetchError.message?.includes('SSL') || fetchError.code === 'ERR_SSL_WRONG_VERSION_NUMBER') {
        console.error('SSL/Connection error. Check LLM_SERVER_URL protocol (http vs https):', normalizedUrl)
        return NextResponse.json({ 
          error: `Connection error: ${fetchError.message}. Please check LLM_SERVER_URL is using the correct protocol (http:// for localhost, https:// for production).` 
        }, { status: 500 })
      }
      throw fetchError
    }
  } catch (e: any) {
    console.error('Generate plan error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}


