import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'
import type { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions'
import { 
  SYSTEM_PROMPT_DIABETES_AYURVEDA, 
  SYSTEM_PROMPT_PLAN_GENERATION,
  isRelevantQuery, 
  REFUSAL_MESSAGE 
} from '@/lib/ai/systemPrompts'

const GROQ_API_KEY: string | undefined = process.env.GROQ_API_KEY
const GROQ_MODEL: string = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const SUPABASE_URL: string | undefined = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_PROJECT_URL
const SUPABASE_SERVICE_ROLE_KEY: string | undefined = process.env.SUPABASE_SERVICE_ROLE_KEY
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { user_id, messages, context } = body as { user_id: string, messages: ChatCompletionMessageParam[], context?: any }
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages (array) required' }, { status: 400 })
    }

    // Check if question is relevant to Ayurvedic diabetes care
    const lastMessageContent = messages[messages.length - 1]?.content
    const lastMessage = typeof lastMessageContent === 'string' ? lastMessageContent : ''
    
    // Use centralized keyword filtering
    if (!isRelevantQuery(lastMessage)) {
      return NextResponse.json({ text: REFUSAL_MESSAGE })
    }

    // Build system prompt with optional context
    const sys: ChatCompletionMessageParam = {
      role: 'system',
      content: SYSTEM_PROMPT_DIABETES_AYURVEDA + '\n\nUse the provided context (onboarding, diagnosis, plans) to personalize replies.\n\nIMPORTANT FORMATTING RULES:\n- For 15-day plans, ALWAYS format as markdown tables\n- Use this exact table format:\n| Day | Morning | Meals | Evening |\n|-----|---------|-------|----------|\n| 1 | Morning routine | Meal plan | Evening routine |\n| 2 | Morning routine | Meal plan | Evening routine |\n\n- Use markdown headers (# ## ###) for sections\n- Use bullet points (-) for lists\n- Keep responses focused on Ayurvedic health and diabetes management\n- Avoid medical prescriptions, only provide lifestyle recommendations'
    }
    const ctxMsg: ChatCompletionMessageParam = { role: 'system', content: context ? JSON.stringify(context) : '{}' }

    if (!groq) {
      // Stub path
      return NextResponse.json({ text: 'This is a development stub response. Your profile context will be used when the LLM key is configured.' })
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [sys, ctxMsg, ...messages],
      temperature: 0.4,
      top_p: 1,
      max_completion_tokens: 1024,
    })
    const text = completion?.choices?.[0]?.message?.content || ''
    return NextResponse.json({ text })
  } catch (e) {
    console.error('LLM /chat error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
