import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizePrakriti, getAllowedItemsPrompt, validateMealPlan } from '@/lib/meal-plan-utils'
import { generate15DayPlan, getCanonicalPlanForPrakriti } from '@/lib/plan-generator'

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
      return NextResponse.json({ 
        error: 'Failed to fetch user data',
        details: onboardingError.message 
      }, { status: 400 })
    }
    
    if (!onboarding) {
      return NextResponse.json({ 
        error: 'No onboarding data found. Please complete your onboarding first.',
        code: 'NO_ONBOARDING'
      }, { status: 400 })
    }
    
    // Get user's prakriti
    const prakriti = onboarding.dominant_dosha || onboarding.prakriti_summary?.dominant || onboarding.prakriti
    console.log('Prakriti lookup:', { 
      dominant_dosha: onboarding.dominant_dosha,
      prakriti_summary: onboarding.prakriti_summary,
      prakriti: onboarding.prakriti,
      resolved: prakriti
    })
    
    const normalizedPrakriti = normalizePrakriti(prakriti)
    
    if (!normalizedPrakriti) {
      console.error('No valid prakriti found:', { prakriti, normalizedPrakriti })
      return NextResponse.json({ 
        error: 'No prakriti found. Please complete your Prakriti assessment first.',
        code: 'NO_PRAKRITI',
        details: `Found prakriti value: ${prakriti || 'null'}`
      }, { status: 400 })
    }
    
    // Get allowed meal items for this prakriti
    const allowedItems = getAllowedItemsPrompt(normalizedPrakriti)
    
    // Build context for LLM with canonical constraints
    const context = {
      prakriti: normalizedPrakriti,
      dominant_dosha: normalizedPrakriti,
      lifestyle: onboarding.lifestyle,
      medical_history: onboarding.medical_history,
      allergies: onboarding.allergies,
      investigation: onboarding.investigation || null,
      // CRITICAL: Include allowed meal items
      allowed_meal_items: allowedItems,
      canonical_plan_constraint: `You MUST ONLY use meal items from this exact list for ${normalizedPrakriti}: ${allowedItems}. Do not invent, modify, or add any items not in this list.`
    }
    
    console.log('Context with constraints:', { ...context, allowed_meal_items: '...' })
    
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

    console.log('Calling LLM service at:', `${normalizedUrl}/generate-plan`)

    try {
      const res = await fetch(`${normalizedUrl}/generate-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, context }),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error('LLM error:', data)
        return NextResponse.json({ error: data?.error || 'LLM error' }, { status: 500 })
      }
      
      // Validate the generated plan against canonical items
      let generatedPlan = data.plan || data.plan_json?.plan || []
      
      // Get canonical plan as fallback
      const canonicalPlan = getCanonicalPlanForPrakriti(normalizedPrakriti)
      
      // If LLM didn't generate a valid plan, fall back to canonical plan
      if (!Array.isArray(generatedPlan) || generatedPlan.length === 0) {
        console.warn('LLM did not generate valid plan, using canonical plan')
        if (canonicalPlan) {
          generatedPlan = generate15DayPlan(canonicalPlan)
        }
      } else {
        // Validate and sanitize the generated plan
        const validation = validateMealPlan(generatedPlan, normalizedPrakriti)
        
        if (!validation.valid) {
          console.error('Generated plan contains invalid items:', validation.invalidItems)
          // If too many invalid items, fall back to canonical plan
          if (validation.invalidItems.length > generatedPlan.length * 0.3) {
            console.warn('Too many invalid items, falling back to canonical plan')
            if (canonicalPlan) {
              generatedPlan = generate15DayPlan(canonicalPlan)
            }
          }
        }
        
        // Ensure plan has exactly 15 days
        if (generatedPlan.length < 15) {
          if (canonicalPlan) {
            generatedPlan = generate15DayPlan(canonicalPlan)
          } else {
            // Pad with last day if no canonical plan available
            const lastDay = generatedPlan[generatedPlan.length - 1]
            while (generatedPlan.length < 15) {
              generatedPlan.push({
                ...lastDay,
                day: `DAY_${generatedPlan.length + 1}`
              })
            }
          }
        } else if (generatedPlan.length > 15) {
          generatedPlan = generatedPlan.slice(0, 15)
        }
      }
      
      // Final validation
      const finalValidation = validateMealPlan(generatedPlan, normalizedPrakriti)
      
      // Deactivate existing active plans
      await supabase
        .from('plans')
        .update({ is_active: false })
        .eq('user_id', user_id)
        .eq('is_active', true)
      
      // Calculate dates (15-day plan starting today)
      const startDate = new Date()
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 14) // 15 days total
      
      // Save the plan to database
      const { data: savedPlan, error: saveError } = await supabase
        .from('plans')
        .insert({
          user_id,
          plan_type: 'ai',
          prakriti: normalizedPrakriti,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          is_active: true,
          payload: generatedPlan,
          plan_json: { plan: generatedPlan }, // Backward compatibility
          summary: data.summary || `AI-generated 15-day ${normalizedPrakriti} plan`
        })
        .select()
        .single()
      
      if (saveError) {
        console.error('Error saving plan:', saveError)
        return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 })
      }
      
      console.log('Plan generated and saved successfully:', savedPlan.id)
      
      return NextResponse.json({
        ...data,
        plan_id: savedPlan.id,
        validation_warnings: finalValidation.invalidItems.length > 0 ? finalValidation.invalidItems : undefined
      })
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
    console.error('Generate plan error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}


