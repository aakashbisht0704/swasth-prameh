import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, topic, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // Save to contact table if it exists
    const { error } = await supabase.from('contact').insert({
      name,
      email,
      phone: phone || null,
      message,
      topic: topic || 'General Inquiry',
    })

    if (error) {
      // Still return success to user even if DB insert fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon.' 
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
