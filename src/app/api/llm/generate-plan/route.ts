import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions'
import { SYSTEM_PROMPT_PLAN_GENERATION } from '@/lib/ai/systemPrompts'

const GROQ_API_KEY: string | undefined = process.env.GROQ_API_KEY
const GROQ_MODEL: string = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_PROJECT_URL
const SUPABASE_SERVICE_ROLE_KEY: string | undefined = process.env.SUPABASE_SERVICE_ROLE_KEY
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, diagnosis_id, context } = body
    if (!user_id || !context) {
      return NextResponse.json({ error: 'user_id and context are required' }, { status: 400 })
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: SYSTEM_PROMPT_PLAN_GENERATION + '\n\nOutput STRICT JSON only, with schema: {"summary": string, "plan": [{"day": number, "morning": string, "meals": string, "evening": string}], "markdown_table": string}. The markdown_table should be a formatted table. Do not include any extra text.'
      },
      { role: 'user', content: JSON.stringify(context) }
    ]

    let parsed: any
    if (!groq) {
      // Fallback stub when no API key is configured
      parsed = {
        summary: 'Sample 15-day lifestyle plan (development stub).',
        plan: Array.from({ length: 15 }).map((_, i) => ({
          day: i + 1,
          morning: '10 min breathwork + light stretching',
          meals: 'Warm, lightly spiced, low-sugar balanced meals',
          evening: '20 min walk; digital sunset 1 hour before bed'
        }))
      }
    } else {
      // Try primary model; on deprecation, automatically fallback
      const tryModels = [GROQ_MODEL, 'llama-3.1-8b-instant']
      let lastErr: any = null
      for (const model of tryModels) {
        try {
          const completion = await groq.chat.completions.create({
            model,
            messages,
            temperature: 0.4,
            max_completion_tokens: 2048,
            top_p: 1,
            response_format: { type: 'json_object' } as any,
          })
          const content = completion?.choices?.[0]?.message?.content || '{}'
          try {
            parsed = JSON.parse(content)
          } catch {
            parsed = { summary: 'Plan unavailable', plan: [] }
          }
          lastErr = null
          break
        } catch (err: any) {
          lastErr = err
          const msg = String(err?.message || '')
          if (!(msg.includes('model_decommissioned') || msg.includes('decommissioned'))) {
            break
          }
          // else continue to next model
        }
      }
      if (lastErr) throw lastErr

      // Final safety: if plan missing or empty, synthesize a basic 15-day plan
      if (!parsed || !Array.isArray(parsed.plan) || parsed.plan.length === 0) {
        const summary = parsed?.summary || '15-day lifestyle plan based on your profile.'
        const plan = Array.from({ length: 15 }).map((_, i) => ({
          day: i + 1,
          morning: '10 min breathwork + gentle stretching',
          meals: 'Balanced, warm, low-sugar meals aligned to dosha moderation',
          evening: '20 min walk; 5 min mindfulness; regular sleep time'
        }))
        parsed = { summary, plan }
      }
    }

    // Persist to Supabase (non-fatal)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      try {
        console.log('Attempting to persist plan to Supabase...')
        console.log('URL:', SUPABASE_URL)
        console.log('Plan data:', JSON.stringify({
          user_id,
          diagnosis_id: diagnosis_id || null,
          plan_json: parsed,
          summary: parsed.summary || ''
        }))
        
        const persistRes = await fetch(`${SUPABASE_URL}/rest/v1/plans`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            user_id,
            diagnosis_id: diagnosis_id || null,
            plan_json: parsed,
            summary: parsed.summary || ''
          })
        })
        
        const persistData = await persistRes.json()
        console.log('Persist response status:', persistRes.status)
        console.log('Persist response data:', persistData)
        
        if (!persistRes.ok) {
          console.error('Failed to persist plan:', persistData)
        } else {
          console.log('Plan persisted successfully!')
        }
      } catch (persistErr) {
        console.error('Persist plan error:', persistErr)
      }
    } else {
      console.error('Cannot persist plan: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
      console.log('SUPABASE_URL:', SUPABASE_URL)
      console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET')
    }

    return NextResponse.json(parsed)
  } catch (e) {
    console.error('LLM /generate-plan error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
