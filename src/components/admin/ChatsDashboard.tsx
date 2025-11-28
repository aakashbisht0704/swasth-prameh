'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, MessageSquare, User, Clock } from 'lucide-react'
import type { SupportChat, UserProfile } from '@/types/support'
import toast from 'react-hot-toast'

export function ChatsDashboard() {
  const [chats, setChats] = useState<SupportChat[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('open')
  const [selectedChat, setSelectedChat] = useState<SupportChat | null>(null)
  const [supportAgents, setSupportAgents] = useState<UserProfile[]>([])

  useEffect(() => {
    fetchChats()
    fetchSupportAgents()
  }, [statusFilter])

  const fetchChats = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const params = new URLSearchParams({
        status: statusFilter,
        page: '1',
        page_size: '50',
      })

      const response = await fetch(`/api/support/unassigned?${params}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setChats(data.data || [])
      }
    } catch (error) {
      toast.error('Failed to load chats')
    } finally {
      setLoading(false)
    }
  }

  const fetchSupportAgents = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['support', 'admin'])
        .order('full_name')

      setSupportAgents(data || [])
    } catch (error) {
    }
  }

  const handleAssign = async (chatId: string, agentId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('/api/support/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ chat_id: chatId, assigned_to: agentId }),
      })

      if (response.ok) {
        toast.success('Chat assigned successfully')
        fetchChats()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to assign chat')
      }
    } catch (error) {
      toast.error('Failed to assign chat')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchChats} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chats List */}
        <Card>
          <CardHeader>
            <CardTitle>Chats ({chats.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {chats.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No chats found</p>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors ${
                      selectedChat?.id === chat.id ? 'bg-muted border-primary' : ''
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{chat.title || 'Untitled Chat'}</span>
                          {chat.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {chat.unread_count}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{chat.user?.full_name || chat.user?.email || 'Unknown'}</span>
                        </div>
                        {chat.last_message_at && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(chat.last_message_at).toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant={chat.status === 'open' ? 'default' : 'secondary'}>
                        {chat.status}
                      </Badge>
                    </div>
                    {chat.assigned_agent && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Assigned to: {chat.assigned_agent.full_name || chat.assigned_agent.email}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Details */}
        <Card>
          <CardHeader>
            <CardTitle>Chat Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedChat ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge className="ml-2">{selectedChat.status}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">User</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedChat.user?.full_name || selectedChat.user?.email || 'Unknown'}
                  </p>
                </div>
                {selectedChat.assigned_agent ? (
                  <div>
                    <label className="text-sm font-medium">Assigned To</label>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.assigned_agent.full_name || selectedChat.assigned_agent.email}
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Assign To</label>
                    <Select
                      onValueChange={(agentId) => handleAssign(selectedChat.id, agentId)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportAgents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.full_name || agent.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Unread Messages</label>
                  <p className="text-sm text-muted-foreground">{selectedChat.unread_count}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedChat.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => window.open(`/admin/chat/${selectedChat.id}`, '_blank')}
                  className="w-full"
                >
                  View Messages
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Select a chat to view details
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

