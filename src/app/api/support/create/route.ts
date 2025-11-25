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

    const body = await req.json()
    const { title, initial_message } = body

    // Ensure user profile exists
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      // Create profile if it doesn't exist
      await supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
          role: 'user',
        })
    }

    // Create chat
    const { data: chat, error: chatError } = await supabase
      .from('support_chats')
      .insert({
        user_id: user.id,
        title: title || `Chat ${new Date().toLocaleDateString()}`,
        status: 'open',
      })
      .select()
      .single()

    if (chatError) {
      console.error('Error creating chat:', chatError)
      return NextResponse.json({ error: chatError.message }, { status: 500 })
    }

    // Create initial message if provided
    if (initial_message) {
      const { error: messageError } = await supabase
        .from('support_messages')
        .insert({
          chat_id: chat.id,
          sender_id: user.id,
          sender_role: 'user',
          message: initial_message,
        })

      if (messageError) {
        console.error('Error creating initial message:', messageError)
        // Don't fail the request, chat is created
      }
    }

    // Log activity
    await supabase.rpc('log_support_activity', {
      p_user_id: user.id,
      p_action: 'create_chat',
      p_entity_type: 'support_chat',
      p_entity_id: chat.id,
    })

    return NextResponse.json({ chat })
  } catch (error: any) {
    console.error('Error in create chat:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

