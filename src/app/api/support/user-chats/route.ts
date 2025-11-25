import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(req: NextRequest) {
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

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('page_size') || '20')

    let query = supabase
      .from('support_chats')
      .select(`
        *,
        user:user_profiles!support_chats_user_id_fkey(*),
        assigned_agent:user_profiles!support_chats_assigned_to_fkey(*)
      `, { count: 'exact' })
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .range((page - 1) * pageSize, page * pageSize - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: chats, error, count } = await query

    if (error) {
      console.error('Error fetching chats:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: chats || [],
      count: count || 0,
      page,
      page_size: pageSize,
      has_more: (count || 0) > page * pageSize,
    })
  } catch (error: any) {
    console.error('Error in user chats:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

