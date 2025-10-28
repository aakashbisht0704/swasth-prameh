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
      allergies: onboarding.allergies
    }
    
    console.log('Context:', context)
    
    const llmUrl = process.env.LLM_SERVER_URL || process.env.NEXT_PUBLIC_LLM_SERVER_URL
    if (!llmUrl) {
      return NextResponse.json({ error: 'LLM_SERVER_URL not set' }, { status: 500 })
    }

    const res = await fetch(`${llmUrl.replace(/\/$/, '')}/generate-plan`, {
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
  } catch (e: any) {
    console.error('Generate plan error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}


