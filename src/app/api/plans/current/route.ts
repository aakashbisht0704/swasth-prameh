import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const user_id = searchParams.get('user_id')
    
    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }
    
    // Fetch the active plan for the user
    // Try with is_active first, fallback to just latest plan if column doesn't exist
    let { data: plan, error } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    // If error suggests column doesn't exist, try without is_active filter
    if (error && (error.message?.includes('is_active') || error.code === '42703')) {
      const result = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      plan = result.data
      error = result.error
    }
    
    if (error) {
      return NextResponse.json({ 
        error: 'Failed to fetch plan',
        details: error.message 
      }, { status: 500 })
    }
    
    // Filter by is_active if the column exists
    if (plan && 'is_active' in plan && plan.is_active === false) {
      plan = null
    }
    
    if (!plan) {
      return NextResponse.json({ plan: null }, { status: 200 })
    }
    
    // Return plan with normalized structure
    return NextResponse.json({
      plan: {
        id: plan.id,
        user_id: plan.user_id,
        plan_type: plan.plan_type || 'ai',
        prakriti: plan.prakriti,
        start_date: plan.start_date,
        end_date: plan.end_date,
        is_active: plan.is_active,
        summary: plan.summary,
        payload: plan.payload || plan.plan_json?.plan || plan.plan_json,
        created_at: plan.created_at
      }
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

