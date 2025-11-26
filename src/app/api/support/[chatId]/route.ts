import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
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

    const { chatId } = await params
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('page_size') || '50')

    // Check if user has access to this chat (using manual joins to avoid FK name issues)
    const { data: chat, error: chatError } = await supabase
      .from('support_chats')
      .select('*')
      .eq('id', chatId)
      .single()

    if (chatError) {
      console.error('Error fetching chat:', chatError)
      console.error('Error code:', chatError.code)
      if (chatError.code === '42P01' || chatError.message?.includes('does not exist')) {
        return NextResponse.json({ 
          error: 'Support chats table not found. Please run the database migration.',
          code: chatError.code
        }, { status: 500 })
      }
      return NextResponse.json({ 
        error: chatError.message || 'Chat not found',
        code: chatError.code
      }, { status: chatError.code === 'PGRST116' ? 404 : 500 })
    }

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 })
    }

    // Manually fetch user profiles
    const [userResult, agentResult] = await Promise.all([
      supabase
        .from('user_profiles')
        .select('id, full_name, email, role, avatar_url')
        .eq('id', chat.user_id)
        .single()
        .catch(() => ({ data: null })),
      chat.assigned_to 
        ? supabase
            .from('user_profiles')
            .select('id, full_name, email, role, avatar_url')
            .eq('id', chat.assigned_to)
            .single()
            .catch(() => ({ data: null }))
        : Promise.resolve({ data: null })
    ])

    const chatWithUsers = {
      ...chat,
      user: userResult.data,
      assigned_agent: agentResult.data
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

    // Fetch messages (using manual joins)
    const { data: messages, error: messagesError, count } = await supabase
      .from('support_messages')
      .select('*', { count: 'exact' })
      .eq('chat_id', chatId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (messagesError) {
      console.error('Error fetching messages:', messagesError)
      return NextResponse.json({ error: messagesError.message }, { status: 500 })
    }

    // Manually fetch sender profiles and attachments for each message
    const messagesWithDetails = await Promise.all(
      (messages || []).map(async (msg: any) => {
        const [senderResult, attachmentsResult] = await Promise.all([
          msg.sender_id
            ? supabase
                .from('user_profiles')
                .select('id, full_name, email, role, avatar_url')
                .eq('id', msg.sender_id)
                .single()
                .catch(() => ({ data: null }))
            : Promise.resolve({ data: null }),
          supabase
            .from('support_attachments')
            .select('*')
            .eq('message_id', msg.id)
            .catch(() => ({ data: [] }))
        ])
        return {
          ...msg,
          sender: senderResult.data,
          attachments: attachmentsResult.data || []
        }
      })
    )

    return NextResponse.json({
      chat: chatWithUsers,
      messages: messagesWithDetails.reverse(), // Reverse to show oldest first
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

