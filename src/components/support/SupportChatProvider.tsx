'use client'

import { ChatBubble } from './ChatBubble'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

export function SupportChatProvider() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return <ChatBubble />
}

