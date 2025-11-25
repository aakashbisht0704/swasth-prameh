import { NextRequest, NextResponse } from 'next/server'
import { Groq } from 'groq-sdk'

const GROQ_API_KEY: string | undefined = process.env.GROQ_API_KEY
const GROQ_MODEL: string = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { lifestyle, investigation } = body

    if (!lifestyle && !investigation) {
      return NextResponse.json({ error: 'Lifestyle or investigation data is required' }, { status: 400 })
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

    // Build comprehensive prompt including investigation data
    const dietaryHabits = investigation?.dietary_habits || {}
    const clinical = investigation?.clinical || {}
    
    const userPrompt = `Based on this lifestyle and investigation data, provide brief Ayurvedic advice:

Lifestyle:
- Diet Type: ${lifestyle?.diet_type || 'Not specified'}
- Exercise: ${lifestyle?.exercise_regularly || 'Not specified'}
- Sleep Hours: ${lifestyle?.sleep_hours || 'Not specified'}
- Stress Level: ${lifestyle?.stress_level || 'Not specified'}
- Water Intake: ${lifestyle?.water_intake || dietaryHabits.water_intake || 'Not specified'}
- Smoking: ${lifestyle?.smoking || 'Not specified'}
- Alcohol: ${lifestyle?.alcohol || 'Not specified'}
- Screen Time: ${lifestyle?.screen_time || 'Not specified'}

Dietary Habits (from Investigation):
- Meals per day: ${dietaryHabits.meals_per_day || 'Not specified'}
- Cooking oil: ${dietaryHabits.cooking_oil || 'Not specified'}
- Sweets frequency: ${dietaryHabits.sweets_frequency || 'Not specified'}
- Refined food frequency: ${dietaryHabits.refined_food_frequency || 'Not specified'}
- Deep fried frequency: ${dietaryHabits.deep_fried_frequency || 'Not specified'}
- Digestive symptoms: ${dietaryHabits.digestive_symptoms || 'Not specified'}
${dietaryHabits.skin_boils_present === 'Yes' ? '- Skin boils present: Yes (consider Kapha imbalance)' : ''}

Clinical:
${clinical.hba1c ? `- HbA1c: ${clinical.hba1c}%` : ''}
${clinical.fbs ? `- FBS: ${clinical.fbs} mg/dL` : ''}
${clinical.ppbs ? `- PPBS: ${clinical.ppbs} mg/dL` : ''}
${clinical.diabetes_type ? `- Diabetes Type: ${clinical.diabetes_type}` : ''}

Provide a concise 2-3 sentence Ayurvedic lifestyle recommendation focusing on the most important areas for improvement.`

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

