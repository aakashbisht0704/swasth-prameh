import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isRelevantQuery, REFUSAL_MESSAGE } from '@/lib/ai/systemPrompts'
import { normalizePrakriti, getAllowedItemsPrompt } from '@/lib/meal-plan-utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Check if the last message is relevant
    const lastMessage = body.messages?.[body.messages.length - 1]?.content
    if (lastMessage && !isRelevantQuery(lastMessage)) {
      return NextResponse.json({ text: "Please ask questions relevant to diabetes and ayurveda" })
    }
    
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch latest onboarding, diagnosis, and plan
    const [{ data: onboarding, error: onboardingError }, { data: diagnosis, error: diagnosisError }, { data: plans, error: plansError }] = await Promise.all([
      supabase.from('onboarding').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('diagnosis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
    ])

    // Get user's prakriti for meal constraints
    const prakriti = onboarding?.dominant_dosha || onboarding?.prakriti_summary?.dominant || onboarding?.prakriti
    const normalizedPrakriti = normalizePrakriti(prakriti)
    const allowedMealItems = normalizedPrakriti ? getAllowedItemsPrompt(normalizedPrakriti) : null

    const context = { 
      onboarding, 
      diagnosis, 
      plan: plans?.[0],
      // Include canonical meal constraints if user has prakriti
      ...(normalizedPrakriti && allowedMealItems ? {
        canonical_meal_constraints: {
          prakriti: normalizedPrakriti,
          allowed_meal_items: allowedMealItems,
          prakriti_specific_constraint: normalizedPrakriti ? `CRITICAL: The user's prakriti is ${normalizedPrakriti}. You MUST ONLY suggest meal items from the allowed_meal_items list above. NEVER suggest items from other prakritis (e.g., do NOT suggest Kapha items to Pitta users, or Pitta items to Vata users).` : null,
          instruction: `When suggesting meals, you MUST ONLY use items from this exact list for ${normalizedPrakriti}: ${allowedMealItems}. Do not invent or modify items.`
        }
      } : {})
    }

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

    try {
      const res = await fetch(`${normalizedUrl}/chat`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, messages: body.messages, context })
      })
      
      if (!res.ok) {
        const errorText = await res.text()
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
      
      if (!data || (!data.text && !data.content)) {
        return NextResponse.json({ 
          error: 'LLM returned empty response' 
        }, { status: 500 })
      }
      
      return NextResponse.json(data)
    } catch (fetchError: any) {
      // Handle SSL/connection errors
      if (fetchError.message?.includes('SSL') || fetchError.code === 'ERR_SSL_WRONG_VERSION_NUMBER') {
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
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}



