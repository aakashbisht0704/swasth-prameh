'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { SupportChat, PaginatedResponse } from '@/types/support'

export function useSupportChats(status?: string) {
  const [chats, setChats] = useState<SupportChat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const fetchChats = useCallback(async (pageNum: number = 1) => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError(new Error('Not authenticated'))
        return
      }

      const params = new URLSearchParams({
        page: pageNum.toString(),
        page_size: '20',
      })
      if (status) {
        params.append('status', status)
      }

      const response = await fetch(`/api/support/user-chats?${params}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch chats')
      }

      const data: PaginatedResponse<SupportChat> = await response.json()
      
      if (pageNum === 1) {
        setChats(data.data)
      } else {
        setChats((prev) => [...prev, ...data.data])
      }
      
      setHasMore(data.has_more)
      setPage(pageNum)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchChats(1)
  }, [fetchChats])

  // Subscribe to realtime updates
  useEffect(() => {
    let channel: any = null

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel('support_chats')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'support_chats',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              fetchChats(1) // Refresh on changes
            }
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchChats])

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchChats(page + 1)
    }
  }, [loading, hasMore, page, fetchChats])

  return {
    chats,
    loading,
    error,
    hasMore,
    loadMore,
    refresh: () => fetchChats(1),
  }
}

