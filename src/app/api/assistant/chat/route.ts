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

    const res = await fetch(`${llmUrl.replace(/\/$/, '')}/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, messages: body.messages, context })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data?.error || 'LLM error' }, { status: 500 })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}



