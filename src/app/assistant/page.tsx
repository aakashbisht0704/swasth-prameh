'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatSessions } from '@/hooks/useChatSessions'
import { useChatStream } from '@/hooks/useChatStream'
import { useSidebar } from '@/hooks/useSidebar'
import { Sidebar } from '@/components/assistant/Sidebar'
import { ChatMessage } from '@/components/assistant/ChatMessage'
import { ChatInput } from '@/components/assistant/ChatInput'
import { EmptyState } from '@/components/assistant/EmptyState'
import { LoadingDots } from '@/components/assistant/LoadingDots'

const SEED_KEY = 'assistant_seed'

export default function AssistantPage() {
  const pathname = usePathname()
  const isAuthPage = pathname === '/auth'
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const { sessions, createChat, deleteChat, addMessage, getChat } = useChatSessions()
  const { isStreaming, sendMessage } = useChatStream()
  const { isOpen, isMobile, toggle, close } = useSidebar()

  const currentChat = currentChatId ? getChat(currentChatId) : null

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages, isStreaming])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handle seed data (from onboarding)
  useEffect(() => {
    const raw = sessionStorage.getItem(SEED_KEY)
    if (raw) {
      sessionStorage.removeItem(SEED_KEY)
      const seed = JSON.parse(raw)
      const newChatId = createChat()
      setCurrentChatId(newChatId)
      
      // Add initial message
      addMessage(newChatId, {
        role: 'user',
        content: 'Generate my diagnosis and 15‑day plan based on my profile.',
      })

      // Run pipeline
      runPipeline(newChatId, seed).catch(console.error)
    }
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-select first chat if none selected
  useEffect(() => {
    if (!currentChatId && sessions.length > 0) {
      setCurrentChatId(sessions[0].id)
    }
  }, [sessions, currentChatId])

  async function runPipeline(sessionId: string, seed: any) {
    try {
      const dRes = await fetch('/api/diagnosis/predict', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: seed.userId,
          features: seed.context?.features || seed.context,
        }),
      })
      const dJson = await dRes.json()
      
      const pRes = await fetch('/api/plans/generate', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: seed.userId,
          diagnosis_id: null,
          context: { ...seed.context, ml_output: dJson },
        }),
      })
      const pJson = await pRes.json()
      const summary = pJson?.summary || 'Your personalized 15‑day lifestyle plan.'
      const plan = Array.isArray(pJson?.plan) ? pJson.plan : []
      const markdownTable = pJson?.markdown_table || ''
      
      let responseText = ''
      if (markdownTable) {
        responseText = `## 15-Day Lifestyle Plan\n\n${summary}\n\n${markdownTable}`
      } else if (plan.length) {
        responseText = `## 15-Day Lifestyle Plan\n\n${summary}\n\n${plan
          .map(
            (d: any) =>
              `**Day ${d.day}**\n• Morning: ${d.morning}\n• Meals: ${d.meals}\n• Evening: ${d.evening}`
          )
          .join('\n\n')}`
      } else {
        responseText = `${summary}\n\n${JSON.stringify(pJson, null, 2)}`
      }

      addMessage(sessionId, { role: 'assistant', content: responseText })
    } catch (e: any) {
      addMessage(sessionId, {
        role: 'assistant',
        content: `Sorry, I hit an error generating your plan. ${e?.message || ''}`,
      })
    }
  }

  const handleNewChat = () => {
    const newChatId = createChat()
    setCurrentChatId(newChatId)
    setInput('')
    if (isMobile) close()
  }

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId)
    if (currentChatId === chatId) {
      setCurrentChatId(sessions.length > 1 ? sessions.find((s) => s.id !== chatId)?.id || null : null)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !currentChatId) return
    
    const messageText = input.trim()
    setInput('')
    
    // Add user message
    addMessage(currentChatId, { role: 'user', content: messageText })

    // Send to API and get response
    await sendMessage(
      [
        ...(currentChat?.messages || []),
        { role: 'user' as const, content: messageText },
      ],
      (content) => {
        addMessage(currentChatId, { role: 'assistant', content })
      },
      (error) => {
        addMessage(currentChatId, {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error.message}`,
        })
      }
    )
  }

  const handlePromptClick = (prompt: string) => {
    if (!currentChatId) {
      const newChatId = createChat()
      setCurrentChatId(newChatId)
      setInput(prompt)
      // Auto-send the prompt
      setTimeout(() => {
        setInput('')
        addMessage(newChatId, { role: 'user', content: prompt })
        sendMessage(
          [{ role: 'user' as const, content: prompt }],
          (content) => {
            addMessage(newChatId, { role: 'assistant', content })
          },
          (error) => {
            addMessage(newChatId, {
              role: 'assistant',
              content: `Sorry, I encountered an error: ${error.message}`,
            })
          }
        )
      }, 100)
    } else {
      setInput(prompt)
    }
  }

  if (isAuthPage) return null

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Sidebar Toggle Button - Mobile */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-20 left-4 z-30 lg:hidden"
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={isOpen}
        isMobile={isMobile}
        onClose={close}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Chat Header - Desktop Sidebar Toggle */}
        {!isMobile && (
          <div className="border-b border-border px-4 py-3 flex items-center gap-3 shrink-0">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle sidebar">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Assistant</h1>
        </div>
        )}

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Empty State */}
            {(!currentChat || currentChat.messages.length === 0) && (
              <EmptyState onPromptClick={handlePromptClick} />
            )}

            {/* Messages */}
            {currentChat &&
              currentChat.messages.length > 0 &&
              currentChat.messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  timestamp={new Date(currentChat.updatedAt)}
                />
              ))}

            {/* Loading Indicator */}
            {isStreaming && (
              <div className="flex justify-start">
                <div className="max-w-[85%] md:max-w-[75%] rounded-2xl bg-muted px-4 py-3">
                <LoadingDots />
              </div>
            </div>
          )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSendMessage}
          isLoading={isStreaming}
          disabled={!currentChatId}
        />
      </div>
    </div>
  )
}
