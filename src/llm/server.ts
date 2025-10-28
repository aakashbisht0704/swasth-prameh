'use strict'

import express from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'
import { Groq } from 'groq-sdk'
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { 
  SYSTEM_PROMPT_DIABETES_AYURVEDA, 
  SYSTEM_PROMPT_PLAN_GENERATION,
  isRelevantQuery, 
  REFUSAL_MESSAGE 
} from '../lib/ai/systemPrompts.js'

// Load env from .env.local first, then fallback to .env
dotenv.config({ path: '.env.local' })
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const GROQ_API_KEY: string | undefined = process.env.GROQ_API_KEY
const GROQ_MODEL: string = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_PROJECT_URL
const SUPABASE_SERVICE_ROLE_KEY: string | undefined = process.env.SUPABASE_SERVICE_ROLE_KEY
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null

app.post('/generate-plan', async (req: Request, res: Response) => {
  try {
    const { user_id, diagnosis_id, context } = req.body
    if (!user_id || !context) {
      return res.status(400).json({ error: 'user_id and context are required' })
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

    return res.json(parsed)
  } catch (e) {
    console.error('LLM /generate-plan error:', e)
    return res.status(500).json({ error: String(e) })
  }
})

// Generic chat endpoint - returns assistant text using provided messages + context
app.post('/chat', async (req: Request, res: Response) => {
  try {
    const { user_id, messages, context } = req.body as { user_id: string, messages: ChatCompletionMessageParam[], context?: any }
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages (array) required' })
    }

    // Check if question is relevant to Ayurvedic diabetes care
    const lastMessageContent = messages[messages.length - 1]?.content
    const lastMessage = typeof lastMessageContent === 'string' ? lastMessageContent : ''
    
    // Use centralized keyword filtering
    if (!isRelevantQuery(lastMessage)) {
      return res.json({ text: REFUSAL_MESSAGE })
    }

    // Build system prompt with optional context
    const sys: ChatCompletionMessageParam = {
      role: 'system',
      content: SYSTEM_PROMPT_DIABETES_AYURVEDA + '\n\nUse the provided context (onboarding, diagnosis, plans) to personalize replies.\n\nIMPORTANT FORMATTING RULES:\n- For 15-day plans, ALWAYS format as markdown tables\n- Use this exact table format:\n| Day | Morning | Meals | Evening |\n|-----|---------|-------|----------|\n| 1 | Morning routine | Meal plan | Evening routine |\n| 2 | Morning routine | Meal plan | Evening routine |\n\n- Use markdown headers (# ## ###) for sections\n- Use bullet points (-) for lists\n- Keep responses focused on Ayurvedic health and diabetes management\n- Avoid medical prescriptions, only provide lifestyle recommendations'
    }
    const ctxMsg: ChatCompletionMessageParam = { role: 'system', content: context ? JSON.stringify(context) : '{}' }

    if (!groq) {
      // Stub path
      return res.json({ text: 'This is a development stub response. Your profile context will be used when the LLM key is configured.' })
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [sys, ctxMsg, ...messages],
      temperature: 0.4,
      top_p: 1,
      max_completion_tokens: 1024,
    })
    const text = completion?.choices?.[0]?.message?.content || ''
    return res.json({ text })
  } catch (e) {
    console.error('LLM /chat error:', e)
    return res.status(500).json({ error: String(e) })
  }
})

const port = process.env.PORT || 8002
app.listen(port, () => {
  console.log(`LLM server listening on :${port}`)
})


