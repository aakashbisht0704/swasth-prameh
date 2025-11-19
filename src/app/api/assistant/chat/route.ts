import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isRelevantQuery, REFUSAL_MESSAGE } from '@/lib/ai/systemPrompts'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Assistant chat request:', { messageCount: body.messages?.length })
    
    // Check if the last message is relevant
    const lastMessage = body.messages?.[body.messages.length - 1]?.content
    if (lastMessage && !isRelevantQuery(lastMessage)) {
      console.log('Query not relevant, returning refusal message')
      return NextResponse.json({ text: "Please ask questions relevant to diabetes and ayurveda" })
    }
    
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('Auth error:', authError)
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('User authenticated:', user.id)

    // Fetch latest onboarding, diagnosis, and plan
    const [{ data: onboarding, error: onboardingError }, { data: diagnosis, error: diagnosisError }, { data: plans, error: plansError }] = await Promise.all([
      supabase.from('onboarding').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('diagnosis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
    ])

    if (onboardingError) console.error('Onboarding fetch error:', onboardingError)
    if (diagnosisError) console.error('Diagnosis fetch error:', diagnosisError)
    if (plansError) console.error('Plans fetch error:', plansError)

    const context = { onboarding, diagnosis, plan: plans?.[0] }
    console.log('Context loaded:', { hasOnboarding: !!onboarding, hasDiagnosis: !!diagnosis, hasPlan: !!plans?.[0] })

    const llmUrl = process.env.LLM_SERVER_URL || process.env.NEXT_PUBLIC_LLM_SERVER_URL
    if (!llmUrl) {
      console.error('LLM_SERVER_URL not set')
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

    console.log('Calling LLM at:', `${normalizedUrl}/chat`)

    try {
      const res = await fetch(`${normalizedUrl}/chat`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, messages: body.messages, context })
      })
      
      console.log('LLM response status:', res.status, res.statusText)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('LLM error response:', errorText)
        let errorData: any = null
        try {
          errorData = JSON.parse(errorText)
        } catch {
          // Not JSON
        }
        return NextResponse.json({ 
          error: errorData?.error || errorText.slice(0, 200) || `LLM server error: ${res.status} ${res.statusText}` 
        }, { status: 500 })
      }
      
      const data = await res.json()
      console.log('LLM response data:', data?.text ? data.text.substring(0, 100) : data)
      
      if (!data || (!data.text && !data.content)) {
        console.error('LLM returned empty or invalid response:', data)
        return NextResponse.json({ 
          error: 'LLM returned empty response' 
        }, { status: 500 })
      }
      
      return NextResponse.json(data)
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError)
      // Handle SSL/connection errors
      if (fetchError.message?.includes('SSL') || fetchError.code === 'ERR_SSL_WRONG_VERSION_NUMBER') {
        console.error('SSL/Connection error. Check LLM_SERVER_URL protocol (http vs https):', normalizedUrl)
        return NextResponse.json({ 
          error: `Connection error: ${fetchError.message}. Please check LLM_SERVER_URL is using the correct protocol (http:// for localhost, https:// for production).` 
        }, { status: 500 })
      }
      // Handle network errors
      if (fetchError.message?.includes('fetch failed') || fetchError.code === 'ECONNREFUSED') {
        return NextResponse.json({ 
          error: `Cannot connect to LLM server at ${normalizedUrl}. Please check if the server is running and LLM_SERVER_URL is correct.` 
        }, { status: 500 })
      }
      throw fetchError
    }
  } catch (e: any) {
    console.error('Unexpected error in assistant chat:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}



