import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      user_id, 
      plan_id, 
      date, 
      meal_slot, 
      menu_text, 
      notes,
      source = 'plan',
      created_via 
    } = body
    
    if (!user_id || !meal_slot || !menu_text) {
      return NextResponse.json({ 
        error: 'user_id, meal_slot, and menu_text are required' 
      }, { status: 400 })
    }
    
    // Validate meal_slot
    const validSlots = ['breakfast', 'snack12', 'lunch', 'snack6', 'dinner']
    if (!validSlots.includes(meal_slot)) {
      return NextResponse.json({ 
        error: `meal_slot must be one of: ${validSlots.join(', ')}` 
      }, { status: 400 })
    }
    
    // Validate source
    const validSources = ['plan', 'user', 'ai']
    if (!validSources.includes(source)) {
      return NextResponse.json({ 
        error: `source must be one of: ${validSources.join(', ')}` 
      }, { status: 400 })
    }
    
    // Use provided date or default to today
    const mealDate = date || new Date().toISOString().split('T')[0]
    
    // Create meal log entry
    const { data: mealLog, error } = await supabase
      .from('meal_logs')
      .insert({
        user_id,
        plan_id: plan_id || null,
        date: mealDate,
        meal_slot,
        menu_text,
        notes: notes || null,
        source,
        created_via: created_via || null
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating meal log:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // Provide more specific error messages
      if (error.code === '42P01') {
        return NextResponse.json({ 
          error: 'meal_logs table does not exist. Please run the database migration.',
          code: 'TABLE_MISSING'
        }, { status: 500 })
      }
      
      if (error.code === '42501') {
        return NextResponse.json({ 
          error: 'Permission denied. Please check RLS policies.',
          code: 'RLS_ERROR'
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to create meal log',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      meal_log: mealLog
    })
  } catch (e: any) {
    console.error('Log meal error:', e)
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 })
  }
}

