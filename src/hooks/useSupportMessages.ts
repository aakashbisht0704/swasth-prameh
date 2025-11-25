'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { SupportMessage } from '@/types/support'

export function useSupportMessages(chatId: string | null) {
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    if (!chatId) return

    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError(new Error('Not authenticated'))
        return
      }

      const response = await fetch(`/api/support/${chatId}?page=1&page_size=50`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [chatId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Subscribe to realtime updates
  useEffect(() => {
    if (!chatId) return

    const channel = supabase
      .channel(`support_messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        async (payload) => {
          // Fetch the full message with relations
          const { data: newMessage } = await supabase
            .from('support_messages')
            .select(`
              *,
              sender:user_profiles!support_messages_sender_id_fkey(*),
              attachments:support_attachments(*)
            `)
            .eq('id', payload.new.id)
            .single()

          if (newMessage && !newMessage.deleted_at) {
            setMessages((prev) => [...prev, newMessage as SupportMessage])
            // Mark as read if not sent by current user
            const { data: { user } } = await supabase.auth.getUser()
            if (user && newMessage.sender_id !== user.id) {
              await markAsRead()
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'support_messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId])

  const sendMessage = useCallback(async (message: string, metadata?: Record<string, any>) => {
    if (!chatId || !message.trim()) return

    try {
      setSending(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Not authenticated')
      }

      // Optimistic update
      const { data: { user } } = await supabase.auth.getUser()
      const optimisticMessage: SupportMessage = {
        id: `temp-${Date.now()}`,
        chat_id: chatId,
        sender_id: user?.id || null,
        sender_role: 'user',
        message: message.trim(),
        metadata: metadata || {},
        is_read: false,
        deleted_at: null,
        deleted_by: null,
        flagged: false,
        flagged_by: null,
        flagged_at: null,
        created_at: new Date().toISOString(),
        edited_at: null,
      }

      setMessages((prev) => [...prev, optimisticMessage])

      const response = await fetch(`/api/support/${chatId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message: message.trim(), metadata }),
      })

      if (!response.ok) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticMessage.id))
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === optimisticMessage.id ? data.message : msg))
      )
    } catch (err) {
      setError(err as Error)
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith('temp-')))
    } finally {
      setSending(false)
    }
  }, [chatId])

  const markAsRead = useCallback(async () => {
    if (!chatId) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await fetch(`/api/support/${chatId}/read`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }, [chatId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    markAsRead,
    refresh: fetchMessages,
    messagesEndRef,
  }
}

