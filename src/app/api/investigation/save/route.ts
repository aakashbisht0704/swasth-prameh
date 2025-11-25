import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { InvestigationData } from '@/components/onboarding/InvestigationWizard'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get auth token from request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const investigationData: InvestigationData = body.investigation

    if (!investigationData) {
      return NextResponse.json({ error: 'Investigation data is required' }, { status: 400 })
    }

    // Validate required fields
    if (!investigationData.dietary_habits?.meals_per_day) {
      return NextResponse.json({ error: 'Meals per day is required' }, { status: 400 })
    }
    if (!investigationData.dietary_habits?.water_intake) {
      return NextResponse.json({ error: 'Water intake is required' }, { status: 400 })
    }
    if (!investigationData.dietary_habits?.cooking_oil) {
      return NextResponse.json({ error: 'Cooking oil is required' }, { status: 400 })
    }
    if (!investigationData.dietary_habits?.on_diabetes_medication) {
      return NextResponse.json({ error: 'Diabetes medication status is required' }, { status: 400 })
    }
    if (
      investigationData.dietary_habits.on_diabetes_medication === 'Yes' &&
      !investigationData.dietary_habits.medication_name_and_dose?.trim()
    ) {
      return NextResponse.json(
        { error: 'Medication name and dose is required when on diabetes medication' },
        { status: 400 }
      )
    }

    // Add metadata
    const investigationWithMeta = {
      ...investigationData,
      meta: {
        created_at: investigationData.meta?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }

    // Update onboarding table with investigation data
    const { data, error } = await supabase
      .from('onboarding')
      .upsert(
        {
          user_id: user.id,
          investigation: investigationWithMeta,
        },
        {
          onConflict: 'user_id',
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Error saving investigation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in investigation save:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Get auth token from request
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get investigation data for user
    const { data, error } = await supabase
      .from('onboarding')
      .select('investigation')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching investigation:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ investigation: data?.investigation || null })
  } catch (error: any) {
    console.error('Error in investigation get:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

