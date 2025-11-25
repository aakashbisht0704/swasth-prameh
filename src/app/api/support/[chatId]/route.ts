import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(
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
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('page_size') || '50')

    // Check if user has access to this chat
    const { data: chat, error: chatError } = await supabase
      .from('support_chats')
      .select('*, user:user_profiles!support_chats_user_id_fkey(*), assigned_agent:user_profiles!support_chats_assigned_to_fkey(*)')
      .eq('id', chatId)
      .single()

    if (chatError || !chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Check permissions
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

    // Fetch messages
    const { data: messages, error: messagesError, count } = await supabase
      .from('support_messages')
      .select(`
        *,
        sender:user_profiles!support_messages_sender_id_fkey(*),
        attachments:support_attachments(*)
      `, { count: 'exact' })
      .eq('chat_id', chatId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return NextResponse.json({ error: messagesError.message }, { status: 500 })
    }

    return NextResponse.json({
      chat,
      messages: (messages || []).reverse(), // Reverse to show oldest first
      count: count || 0,
      page,
      page_size: pageSize,
      has_more: (count || 0) > page * pageSize,
    })
  } catch (error: any) {
    console.error('Error in get chat:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

