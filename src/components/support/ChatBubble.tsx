'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Minimize2, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useSupportChats } from '@/hooks/useSupportChats'
import { useSupportMessages } from '@/hooks/useSupportMessages'
import { ChatMessage } from './ChatMessage'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [unreadCount, setUnreadCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const { chats, loading: chatsLoading, refresh: refreshChats } = useSupportChats()
  const { messages, loading: messagesLoading, sending, sendMessage, messagesEndRef } = useSupportMessages(selectedChatId)

  // Get or create a chat
  const getOrCreateChat = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast.error('Please sign in to use support chat')
        return
      }

      // Check if user has an open chat
      const response = await fetch('/api/support/user-chats?status=open&page=1&page_size=1', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          setSelectedChatId(data.data[0].id)
          setIsOpen(true)
          return
        }
      }

      // Create new chat
      const createResponse = await fetch('/api/support/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: 'Support Chat',
          initial_message: 'Hello, I need help.',
        }),
      })

      if (createResponse.ok) {
        const { chat } = await createResponse.json()
        setSelectedChatId(chat.id)
        setIsOpen(true)
        refreshChats()
      }
    } catch (error) {
      console.error('Error creating chat:', error)
      toast.error('Failed to create chat')
    }
  }

  // Calculate unread count
  useEffect(() => {
    const totalUnread = chats.reduce((sum, chat) => sum + chat.unread_count, 0)
    setUnreadCount(totalUnread)
  }, [chats])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || sending) return

    if (!selectedChatId) {
      await getOrCreateChat()
      // Wait a bit for chat to be created
      setTimeout(() => {
        if (selectedChatId) {
          sendMessage(messageInput)
          setMessageInput('')
        }
      }, 500)
      return
    }

    await sendMessage(messageInput)
    setMessageInput('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen && !isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
            if (!selectedChatId) {
              getOrCreateChat()
            }
          }}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg relative"
          aria-label="Open support chat"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-6 w-6 rounded-full flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl flex flex-col h-[600px] max-h-[calc(100vh-2rem)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
          <CardTitle className="text-lg">Support Chat</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsMinimized(!isMinimized)
              }}
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false)
                setIsMinimized(false)
              }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={sending}
                    aria-label="Message input"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || sending}
                    size="icon"
                    aria-label="Send message"
                  >
                    {sending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}

