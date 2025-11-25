import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
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

    const { chatId } = params
    const body = await req.json()
    const { message, metadata } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if user has access to this chat
    const { data: chat, error: chatError } = await supabase
      .from('support_chats')
      .select('*, user:user_profiles!support_chats_user_id_fkey(*), assigned_agent:user_profiles!support_chats_assigned_to_fkey(*)')
      .eq('id', chatId)
      .single()

    if (chatError || !chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Get user role
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isOwner = chat.user_id === user.id
    const isAssigned = chat.assigned_to === user.id
    const isAdminOrSupport = userProfile?.role === 'admin' || userProfile?.role === 'support'

    if (!isOwner && !isAssigned && !isAdminOrSupport) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Determine sender role
    let senderRole: 'user' | 'support' | 'admin' = 'user'
    if (userProfile?.role === 'admin') {
      senderRole = 'admin'
    } else if (userProfile?.role === 'support') {
      senderRole = 'support'
    }

    // Rate limiting check (simple: max 10 messages per minute)
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
    const { count: recentMessages } = await supabase
      .from('support_messages')
      .select('*', { count: 'exact', head: true })
      .eq('sender_id', user.id)
      .gte('created_at', oneMinuteAgo)

    if ((recentMessages || 0) >= 10) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait before sending another message.' }, { status: 429 })
    }

    // Create message
    const { data: newMessage, error: messageError } = await supabase
      .from('support_messages')
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        sender_role: senderRole,
        message: message.trim(),
        metadata: metadata || {},
      })
      .select(`
        *,
        sender:user_profiles!support_messages_sender_id_fkey(*),
        attachments:support_attachments(*)
      `)
      .single()

    if (messageError) {
      console.error('Error creating message:', messageError)
      return NextResponse.json({ error: messageError.message }, { status: 500 })
    }

    // Update chat status if it was closed
    if (chat.status === 'closed') {
      await supabase
        .from('support_chats')
        .update({ status: 'open' })
        .eq('id', chatId)
    }

    // Log activity
    await supabase.rpc('log_support_activity', {
      p_user_id: user.id,
      p_action: 'send_message',
      p_entity_type: 'support_message',
      p_entity_id: newMessage.id,
    })

    return NextResponse.json({ message: newMessage })
  } catch (error: any) {
    console.error('Error in create message:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

