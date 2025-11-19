import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'

const GROQ_API_KEY: string | undefined = process.env.GROQ_API_KEY
const GROQ_MODEL: string = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lifestyle } = body

    if (!lifestyle) {
      return NextResponse.json({ error: 'Lifestyle data is required' }, { status: 400 })
    }

    if (!groq) {
      return NextResponse.json({ 
        advice: 'AI advice is currently unavailable. Please ensure your lifestyle data is complete for personalized recommendations.' 
      })
    }

    // Create a concise prompt for lifestyle advice
    const systemPrompt = `You are an Ayurvedic health advisor specializing in diabetes (Prameh) management. 
Provide short, concise, actionable lifestyle advice based on the user's lifestyle data. 
Keep your response to 2-3 sentences maximum. Focus on practical Ayurvedic recommendations.
Be encouraging and specific.`

    const userPrompt = `Based on this lifestyle data, provide brief Ayurvedic advice:
- Diet Type: ${lifestyle.diet_type || 'Not specified'}
- Exercise: ${lifestyle.exercise_regularly || 'Not specified'}
- Sleep Hours: ${lifestyle.sleep_hours || 'Not specified'}
- Stress Level: ${lifestyle.stress_level || 'Not specified'}
- Water Intake: ${lifestyle.water_intake || 'Not specified'}
- Smoking: ${lifestyle.smoking || 'Not specified'}
- Alcohol: ${lifestyle.alcohol || 'Not specified'}
- Screen Time: ${lifestyle.screen_time || 'Not specified'}

Provide a concise 2-3 sentence Ayurvedic lifestyle recommendation.`

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 150,
      top_p: 1,
    })

    const advice = completion?.choices?.[0]?.message?.content || 'Unable to generate advice at this time.'
    
    return NextResponse.json({ advice })
  } catch (e: any) {
    console.error('Lifestyle advice error:', e)
    return NextResponse.json({ 
      error: 'Failed to generate advice',
      advice: 'Please ensure your lifestyle information is complete for personalized recommendations.'
    }, { status: 500 })
  }
}

