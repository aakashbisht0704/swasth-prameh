import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isRelevantQuery, REFUSAL_MESSAGE } from '@/lib/ai/systemPrompts'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Check if the last message is relevant
    const lastMessage = body.messages?.[body.messages.length - 1]?.content
    if (lastMessage && !isRelevantQuery(lastMessage)) {
      return NextResponse.json({ text: "Please ask questions relevant to diabetes and ayurveda" })
    }
    
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Fetch latest onboarding, diagnosis, and plan
    const [{ data: onboarding }, { data: diagnosis }, { data: plans }] = await Promise.all([
      supabase.from('onboarding').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('diagnosis').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
    ])

    const context = { onboarding, diagnosis, plan: plans?.[0] }

    const llmUrl = process.env.LLM_SERVER_URL || process.env.NEXT_PUBLIC_LLM_SERVER_URL
    if (!llmUrl) return NextResponse.json({ error: 'LLM_SERVER_URL not set' }, { status: 500 })

    // Ensure URL is properly formatted
    let normalizedUrl = llmUrl.trim().replace(/\/$/, '')
    // If URL doesn't have a protocol, default to http:// for localhost, https:// otherwise
    if (!normalizedUrl.match(/^https?:\/\//)) {
      if (normalizedUrl.includes('localhost') || normalizedUrl.includes('127.0.0.1')) {
        normalizedUrl = `http://${normalizedUrl}`
      } else {
        normalizedUrl = `https://${normalizedUrl}`
      }
    }

    try {
      const res = await fetch(`${normalizedUrl}/chat`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, messages: body.messages, context })
      })
      const data = await res.json()
      if (!res.ok) return NextResponse.json({ error: data?.error || 'LLM error' }, { status: 500 })
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
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}



