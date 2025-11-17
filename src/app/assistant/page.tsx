'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FloatingDots } from '@/components/ui/typing-indicator'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ChatSidebar, type Chat } from '@/components/assistant/ChatSidebar'
import { ChatMessage } from '@/components/assistant/ChatMessage'
import { ChatInputDock } from '@/components/assistant/ChatInputDock'
import { ChatHero } from '@/components/assistant/ChatHero'
import { TopNavigationTabs } from '@/components/assistant/TopNavigationTabs'
import { LoadingDots } from '@/components/assistant/LoadingDots'

const SESSIONS_KEY = 'ai_assistant_sessions'
const SEED_KEY = 'assistant_seed'

function loadSessions(): Chat[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveSessions(sessions: Chat[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export default function AssistantPage() {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const currentChat = useMemo(() => chats.find(c => c.id === currentChatId) || null, [chats, currentChatId])

  const scrollToBottom = () => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    const getUserAndLoadChats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        try {
          const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
          
          if (error) {
            console.error('Error loading chat messages:', error)
          }
          
          if (messages && messages.length > 0) {
            const chatMessages = messages.map(msg => ({
              role: msg.sender_type === 'user' ? 'user' : 'assistant',
              content: msg.message
            }))
            
            const existingChats = loadSessions()
            const sessionId = crypto.randomUUID()
            const newChat: Chat = {
              id: sessionId,
              title: 'Previous Chat',
              messages: chatMessages,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              tab: 'assistant'
            }
            
            const updatedChats = [newChat, ...existingChats]
            setChats(updatedChats)
            saveSessions(updatedChats)
            setCurrentChatId(sessionId)
            return
          }
        } catch (error) {
          console.error('Failed to load chat messages:', error)
        }
      }
      
      const existingChats = loadSessions()
      setChats(existingChats)
    }
    
    getUserAndLoadChats()
  }, [])

  useEffect(() => {
    const raw = sessionStorage.getItem(SEED_KEY)
    if (raw) {
      sessionStorage.removeItem(SEED_KEY)
      const seed = JSON.parse(raw)
      const seedTitle = 'Generated 15‑Day Plan'
      const id = crypto.randomUUID()
      const newChat: Chat = { 
        id, 
        title: seedTitle, 
        messages: [{ role: 'user', content: 'Generate my diagnosis and 15‑day plan based on my profile.' }], 
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tab: 'assistant'
      }
      const next = [newChat, ...chats]
      setChats(next)
      saveSessions(next)
      setCurrentChatId(id)
      void runPipeline(id, seed)
      return
    }

    if (!currentChatId && chats.length === 0) {
      // Don't auto-create chat - show hero instead
    } else if (!currentChatId && chats.length > 0) {
      setCurrentChatId(chats[0].id)
    }
  }, [chats, currentChatId])

  useEffect(() => { 
    scrollToBottom() 
  }, [currentChat?.messages.length])

  async function runPipeline(sessionId: string, seed: any) {
    try {
      setLoading(true)
      const dRes = await fetch('/api/diagnosis/predict', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: seed.userId, features: seed.context?.features || seed.context })
      })
      const dJson = await dRes.json()
      
      const pRes = await fetch('/api/plans/generate', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: seed.userId, diagnosis_id: null, context: { ...seed.context, ml_output: dJson } })
      })
      const pJson = await pRes.json()
      const summary = pJson?.summary || 'Your personalized 15‑day lifestyle plan.'
      const plan = Array.isArray(pJson?.plan) ? pJson.plan : []
      const markdownTable = pJson?.markdown_table || ''
      
      let responseText = ''
      if (markdownTable) {
        responseText = `## 15-Day Lifestyle Plan\n\n${summary}\n\n${markdownTable}`
      } else if (plan.length) {
        responseText = `## 15-Day Lifestyle Plan\n\n${summary}\n\n${plan.map((d: any) => `**Day ${d.day}**\n• Morning: ${d.morning}\n• Meals: ${d.meals}\n• Evening: ${d.evening}`).join('\n\n')}`
      } else {
        responseText = `${summary}\n\n${JSON.stringify(pJson, null, 2)}`
      }

      await appendMessage(sessionId, { role: 'assistant', content: responseText })
    } catch (e: any) {
      await appendMessage(sessionId, { role: 'assistant', content: `Sorry, I hit an error generating your plan. ${e?.message || ''}` })
    } finally {
      setLoading(false)
    }
  }

  async function appendMessage(chatId: string, msg: { role: 'user' | 'assistant'; content: string }) {
    setChats(prev => {
      const next = prev.map(c => 
        c.id === chatId 
          ? { ...c, messages: [...c.messages, msg], updatedAt: Date.now() }
          : c
      )
      // Sort by updatedAt (newest first)
      next.sort((a, b) => b.updatedAt - a.updatedAt)
      saveSessions(next)
      return next
    })

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser) {
        await supabase.from('chat_messages').insert({
          user_id: currentUser.id,
          message: msg.content,
          sender_type: msg.role === 'user' ? 'user' : 'admin',
          is_read: true
        })
      }
    } catch (error) {
      console.error('Failed to save message to database:', error)
    }
  }

  function newChat() {
    const id = crypto.randomUUID()
    const title = 'New Chat'
    const newChat: Chat = { 
      id, 
      title, 
      messages: [], 
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tab: 'assistant'
    }
    const next = [newChat, ...chats]
    setChats(next)
    saveSessions(next)
    setCurrentChatId(id)
  }

  function deleteChat(chatId: string) {
    const next = chats.filter(c => c.id !== chatId)
    setChats(next)
    saveSessions(next)
    if (currentChatId === chatId) {
      setCurrentChatId(next.length > 0 ? next[0].id : null)
    }
  }

  async function sendMessage() {
    if (!currentChat || !input.trim()) return
    
    const text = input.trim()
    const messageText = text
    setInput('')
    
    // Update title if first message
    if (currentChat.messages.length === 0) {
      const title = messageText.length > 25 ? messageText.slice(0, 25) + '...' : messageText
      setChats(prev => {
        const next = prev.map(c => c.id === currentChat.id ? { ...c, title } : c)
        saveSessions(next)
        return next
      })
    }
    
    await appendMessage(currentChat.id, { role: 'user', content: messageText })
    setChatLoading(true)
    
    try {
      const resp = await fetch('/api/assistant/chat', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            ...currentChat.messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: messageText }
          ] 
        })
      })
      const raw = await resp.text()
      let data: any = null
      try { data = JSON.parse(raw) } catch { /* non-JSON */ }
      
      if (!resp.ok) {
        const errMsg = data?.error || raw?.slice(0, 200) || 'Chat error'
        throw new Error(errMsg)
      }
      
      const answer = data?.text || ''
      await appendMessage(currentChat.id, { role: 'assistant', content: answer || 'No response.' })
    } catch (e: any) {
      await appendMessage(currentChat.id, { role: 'assistant', content: `Sorry, I hit an error. ${e?.message || ''}` })
    } finally {
      setChatLoading(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    if (!currentChat) {
      const id = crypto.randomUUID()
      const title = prompt.length > 25 ? prompt.slice(0, 25) + '...' : prompt
      const newChat: Chat = { 
        id, 
        title, 
        messages: [{ role: 'user', content: prompt }], 
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tab: 'assistant'
      }
      const next = [newChat, ...chats]
      setChats(next)
      saveSessions(next)
      setCurrentChatId(id)
      
      // Send message to API
      setChatLoading(true)
      fetch('/api/assistant/chat', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: prompt }]
        })
      })
      .then(async (resp) => {
        const raw = await resp.text()
        let data: any = null
        try { data = JSON.parse(raw) } catch { /* non-JSON */ }
        if (resp.ok) {
          const answer = data?.text || ''
          await appendMessage(id, { role: 'assistant', content: answer || 'No response.' })
        } else {
          await appendMessage(id, { role: 'assistant', content: `Sorry, I hit an error. ${data?.error || 'Unknown error'}` })
        }
      })
      .catch(async (e: any) => {
        await appendMessage(id, { role: 'assistant', content: `Sorry, I hit an error. ${e?.message || ''}` })
      })
      .finally(() => {
        setChatLoading(false)
      })
    } else {
      setInput(prompt)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] overflow-hidden bg-white">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">Assistant</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={newChat}
        onDeleteChat={deleteChat}
        isMobile={isMobile}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Top Navigation Tabs - Desktop only */}
        <div className="hidden md:block">
          <TopNavigationTabs />
        </div>

        {/* Chat Display Area */}
        <div 
          ref={viewportRef}
          className="flex-1 overflow-y-auto px-4 py-6 md:pt-6 pb-24 md:mt-0 mt-16"
        >
          {!currentChat && (
            <ChatHero onPromptClick={handlePromptClick} />
          )}

          <AnimatePresence>
            {currentChat && currentChat.messages.length === 0 && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChatHero onPromptClick={handlePromptClick} />
              </motion.div>
            )}
          </AnimatePresence>

          {currentChat && currentChat.messages.length > 0 && (
            <div className="space-y-4 max-w-[1080px] mx-auto">
              {currentChat.messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                  timestamp={new Date(currentChat.updatedAt)}
                />
              ))}
            </div>
          )}

          {(loading || chatLoading) && (
            <div className="max-w-[80%]">
              <div className="rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-lg">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Dock */}
        <ChatInputDock
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          isLoading={chatLoading}
          disabled={loading}
        />
      </div>
    </div>
  )
}
