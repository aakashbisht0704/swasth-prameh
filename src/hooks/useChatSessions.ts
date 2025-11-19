import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatSession = {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

const SESSIONS_KEY = 'ai_assistant_sessions'

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  // Load sessions from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setSessions(parsed)
        }
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }, [])

  // Save sessions to localStorage
  const saveSessions = useCallback((newSessions: ChatSession[]) => {
    try {
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions))
      setSessions(newSessions)
    } catch (error) {
      console.error('Error saving sessions:', error)
    }
  }, [])

  // Create new chat
  const createChat = useCallback(() => {
    const newChat: ChatSession = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    const updated = [newChat, ...sessions]
    saveSessions(updated)
    return newChat.id
  }, [sessions, saveSessions])

  // Delete chat
  const deleteChat = useCallback(
    (chatId: string) => {
      const updated = sessions.filter((s) => s.id !== chatId)
      saveSessions(updated)
      
      // Also try to delete from Supabase if user is authenticated
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          // Note: We don't have a chat_sessions table, but we can clean up chat_messages if needed
          // This is optional and depends on your schema
        }
      })
      
      return updated
    },
    [sessions, saveSessions]
  )

  // Update chat title
  const updateChatTitle = useCallback(
    (chatId: string, title: string) => {
      const updated = sessions.map((s) =>
        s.id === chatId ? { ...s, title, updatedAt: Date.now() } : s
      )
      saveSessions(updated)
    },
    [sessions, saveSessions]
  )

  // Add message to chat
  const addMessage = useCallback(
    (chatId: string, message: ChatMessage) => {
      const updated = sessions.map((s) => {
        if (s.id === chatId) {
          const newMessages = [...s.messages, message]
          // Auto-generate title from first user message if still "New Chat"
          let newTitle = s.title
          if (s.title === 'New Chat' && message.role === 'user') {
            newTitle = message.content.length > 50 
              ? message.content.slice(0, 50) + '...' 
              : message.content
          }
          return {
            ...s,
            messages: newMessages,
            title: newTitle,
            updatedAt: Date.now(),
          }
        }
        return s
      })
      // Sort by updatedAt (newest first)
      updated.sort((a, b) => b.updatedAt - a.updatedAt)
      saveSessions(updated)

      // Save to Supabase if user is authenticated
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          supabase
            .from('chat_messages')
            .insert({
              user_id: user.id,
              message: message.content,
              sender_type: message.role === 'user' ? 'user' : 'admin',
              is_read: true,
            })
            .catch((error) => {
              console.error('Failed to save message to database:', error)
            })
        }
      })
    },
    [sessions, saveSessions]
  )

  // Get chat by ID
  const getChat = useCallback(
    (chatId: string) => {
      return sessions.find((s) => s.id === chatId) || null
    },
    [sessions]
  )

  return {
    sessions,
    createChat,
    deleteChat,
    updateChatTitle,
    addMessage,
    getChat,
  }
}

