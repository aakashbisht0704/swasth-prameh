'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { SupportChat } from '@/types/support'

export function useAssignChat() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const assignChat = useCallback(async (chatId: string, assignedTo: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/support/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ chat_id: chatId, assigned_to: assignedTo }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to assign chat')
      }

      const data = await response.json()
      return data.chat as SupportChat
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    assignChat,
    loading,
    error,
  }
}

