import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { samplePlans } from '@/lib/canonical-plans'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper to normalize prakriti to canonical form
function normalizePrakriti(prakriti: string | null | undefined): 'kaphaj' | 'pittaj' | 'vataja' | null {
  if (!prakriti) return null
  
  const normalized = prakriti.toLowerCase()
  
  if (normalized.includes('kapha') || normalized.includes('kaphaj')) {
    return 'kaphaj'
  } else if (normalized.includes('pitta') || normalized.includes('pittaj')) {
    return 'pittaj'
  } else if (normalized.includes('vata') || normalized.includes('vataja') || normalized.includes('vataaja')) {
    return 'vataja'
  }
  
  return null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_id, prakriti: providedPrakriti } = body
    
    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }
    
    console.log('Apply sample plan request for user:', user_id)
    
    // Fetch user's prakriti from user_profiles or onboarding
    let userPrakriti: string | null = providedPrakriti || null
    
    if (!userPrakriti) {
      // Try to get from user_profiles
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('prakriti')
        .eq('id', user_id)
        .single()
      
      if (profile?.prakriti) {
        userPrakriti = profile.prakriti
      } else {
        // Try to get from onboarding
        const { data: onboarding } = await supabase
          .from('onboarding')
          .select('dominant_dosha, prakriti_summary')
          .eq('user_id', user_id)
          .single()
        
        if (onboarding?.dominant_dosha) {
          userPrakriti = onboarding.dominant_dosha
        } else if (onboarding?.prakriti_summary?.dominant) {
          userPrakriti = onboarding.prakriti_summary.dominant
        }
      }
    }
    
    // Normalize prakriti
    const normalizedPrakriti = normalizePrakriti(userPrakriti)
    
    if (!normalizedPrakriti) {
      return NextResponse.json({ 
        error: 'No prakriti found. Please complete your Prakriti assessment first.' 
      }, { status: 400 })
    }
    
    // Get the canonical plan
    const planKey = normalizedPrakriti as keyof typeof samplePlans
    const canonicalPlan = (samplePlans as any)[planKey]
    
    if (!canonicalPlan || !Array.isArray(canonicalPlan)) {
      return NextResponse.json({ 
        error: `No canonical plan found for prakriti: ${normalizedPrakriti}` 
      }, { status: 404 })
    }
    
    // Deactivate existing active plans for this user
    await supabase
      .from('plans')
      .update({ is_active: false })
      .eq('user_id', user_id)
      .eq('is_active', true)
    
    // Calculate dates (7-day plan starting today)
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 6) // 7 days total
    
    // Create the plan record
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .insert({
        user_id,
        plan_type: 'sample',
        prakriti: normalizedPrakriti,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        is_active: true,
        payload: canonicalPlan,
        plan_json: { plan: canonicalPlan }, // Backward compatibility
        summary: `7-day ${normalizedPrakriti.charAt(0).toUpperCase() + normalizedPrakriti.slice(1)} sample plan`
      })
      .select()
      .single()
    
    if (planError) {
      console.error('Error creating plan:', planError)
      return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 })
    }
    
    console.log('Sample plan applied successfully:', plan.id)
    
    return NextResponse.json({
      success: true,
      plan_id: plan.id,
      prakriti: normalizedPrakriti,
      start_date: plan.start_date,
      end_date: plan.end_date,
      payload: plan.payload
    })
  } catch (e: any) {
    console.error('Apply sample plan error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

