import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or support
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userProfile?.role !== 'admin' && userProfile?.role !== 'support') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { chat_id, assigned_to } = body

    if (!chat_id || !assigned_to) {
      return NextResponse.json({ error: 'chat_id and assigned_to are required' }, { status: 400 })
    }

    // Verify assigned user is support or admin
    const { data: assignedProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', assigned_to)
      .single()

    if (!assignedProfile || (assignedProfile.role !== 'support' && assignedProfile.role !== 'admin')) {
      return NextResponse.json({ error: 'Assigned user must be support or admin' }, { status: 400 })
    }

    // Update chat assignment
    const { data: chat, error: updateError } = await supabase
      .from('support_chats')
      .update({
        assigned_to,
        status: 'open',
        updated_at: new Date().toISOString(),
      })
      .eq('id', chat_id)
      .select(`
        *,
        user:user_profiles!support_chats_user_id_fkey(*),
        assigned_agent:user_profiles!support_chats_assigned_to_fkey(*)
      `)
      .single()

    if (updateError) {
      console.error('Error assigning chat:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log activity
    await supabase.rpc('log_support_activity', {
      p_user_id: user.id,
      p_action: 'assign_chat',
      p_entity_type: 'support_chat',
      p_entity_id: chat_id,
      p_metadata: { assigned_to },
    })

    return NextResponse.json({ chat })
  } catch (error: any) {
    console.error('Error in assign chat:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

