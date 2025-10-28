'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { FloatingDots } from '@/components/ui/typing-indicator'
import { motion, AnimatePresence } from 'motion/react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

type ChatMessage = { role: 'user' | 'assistant'; content: string }
type ChatSession = { id: string; title: string; messages: ChatMessage[]; createdAt: number }

const SESSIONS_KEY = 'ai_assistant_sessions'
const SEED_KEY = 'assistant_seed'

function loadSessions(): ChatSession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export default function AssistantPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  const currentSession = useMemo(() => sessions.find(s => s.id === currentId) || null, [sessions, currentId])

  const scrollToBottom = () => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' })
  }

  useEffect(() => {
    // Get current user and load chat messages
    const getUserAndLoadChats = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Test database connection
      if (user) {
        try {
          const { data: testData, error: testError } = await supabase
            .from('chat_messages')
            .select('id')
            .limit(1)
          
          if (testError) {
            console.error('Database connection test failed:', testError)
          } else {
            console.log('Database connection test successful')
          }
        } catch (err) {
          console.error('Database connection error:', err)
        }
      }
      
      // Check if there's a seeded chat first
      const hasSeededChat = sessionStorage.getItem(SEED_KEY)
      if (hasSeededChat) {
        // Don't load database messages if there's a seeded chat
        const existingSessions = loadSessions()
        setSessions(existingSessions)
        return
      }
      
      if (user) {
        // Load chat messages from Supabase
        try {
          const { data: messages, error } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true })
          
          if (error) {
            console.error('Error loading chat messages:', error)
            return
          }
          
          console.log('Loaded messages from database:', messages)
          
          if (messages && messages.length > 0) {
            // Convert database messages to chat format
            const chatMessages: ChatMessage[] = messages.map(msg => ({
              role: msg.sender_type === 'user' ? 'user' : 'assistant',
              content: msg.message
            }))
            
            console.log('Converted chat messages:', chatMessages)
            
            // Load existing sessions from localStorage
            const existingSessions = loadSessions()
            console.log('Existing localStorage sessions:', existingSessions)
            
            // Create a session with loaded messages
            const sessionId = crypto.randomUUID()
            const session: ChatSession = {
              id: sessionId,
              title: 'Previous Chat',
              messages: chatMessages,
              createdAt: Date.now()
            }
            
            // Combine database session with existing sessions
            const updatedSessions = [session, ...existingSessions]
            console.log('Updated sessions:', updatedSessions)
            
            setSessions(updatedSessions)
            saveSessions(updatedSessions)
            setCurrentId(sessionId)
          } else {
            // No messages in database, load from localStorage
            const existingSessions = loadSessions()
            setSessions(existingSessions)
          }
        } catch (error) {
          console.error('Failed to load chat messages:', error)
          // Fallback to localStorage
          const existingSessions = loadSessions()
          setSessions(existingSessions)
        }
      } else {
        // No user, load from localStorage
        const existingSessions = loadSessions()
        setSessions(existingSessions)
      }
    }
    
    getUserAndLoadChats()
  }, [])

  useEffect(() => {
    // Check for seeded navigation from dashboard first
    const raw = sessionStorage.getItem(SEED_KEY)
    if (raw) {
      sessionStorage.removeItem(SEED_KEY)
      const seed = JSON.parse(raw)
      const seedTitle = 'Generated 15‑Day Plan'
      const id = crypto.randomUUID()
      const newSession: ChatSession = { 
        id, 
        title: seedTitle, 
        messages: [{ role: 'user', content: 'Generate my diagnosis and 15‑day plan based on my profile.' }], 
        createdAt: Date.now() 
      }
      const next = [newSession, ...sessions]
      setSessions(next)
      saveSessions(next)
      setCurrentId(id)

      // auto-call pipeline
      void runPipeline(id, seed)
      return
    }

    // Only create a new chat if no sessions exist and no seeded chat
    if (!currentId && sessions.length === 0) {
      newChat()
    } else if (!currentId && sessions.length > 0) {
      // If sessions exist but no currentId, select the first one
      setCurrentId(sessions[0].id)
    }
  }, [sessions, currentId])

  useEffect(() => { scrollToBottom() }, [currentSession?.messages.length])

  async function runPipeline(sessionId: string, seed: any) {
    try {
      setLoading(true)
      // 1) Predict
      const dRes = await fetch('/api/diagnosis/predict', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: seed.userId, features: seed.context?.features || seed.context })
      })
      const dJson = await dRes.json()
      // 2) Generate plan
      const pRes = await fetch('/api/plans/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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

  async function appendMessage(sessionId: string, msg: ChatMessage) {
    console.log('appendMessage called:', { sessionId, msg, user: user?.id })
    
    setSessions(prev => {
      const next = prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, msg] } : s)
      saveSessions(next)
      return next
    })

    // Get current user and save to Supabase
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (currentUser) {
        console.log('Saving message to database:', {
          user_id: currentUser.id,
          message: msg.content,
          sender_type: msg.role === 'user' ? 'user' : 'admin',
          is_read: true
        })
        
        const { data, error } = await supabase.from('chat_messages').insert({
          user_id: currentUser.id,
          message: msg.content,
          sender_type: msg.role === 'user' ? 'user' : 'admin',
          is_read: true
        })
        
        if (error) {
          console.error('Database insert error:', error)
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          })
        } else {
          console.log('Message saved successfully:', data)
        }
      } else {
        console.log('No user logged in, skipping database save')
      }
    } catch (error) {
      console.error('Failed to get user or save message to database:', error)
    }
  }

  function newChat() {
    const id = crypto.randomUUID()
    const title = `Chat ${new Date().toLocaleString()}`
    const sess: ChatSession = { id, title, messages: [], createdAt: Date.now() }
    const next = [sess, ...sessions]
    setSessions(next)
    saveSessions(next)
    setCurrentId(id)
  }

  async function sendMessage() {
    if (!currentSession || !input.trim()) return
    const text = input.trim()
    setInput('')
    await appendMessage(currentSession.id, { role: 'user', content: text })
    setChatLoading(true)
    try {
      const resp = await fetch('/api/assistant/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [
          ...currentSession.messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: text }
        ] })
      })
      const raw = await resp.text()
      let data: any = null
      try { data = JSON.parse(raw) } catch { /* non-JSON */ }
      if (!resp.ok) {
        const errMsg = data?.error || raw?.slice(0, 200) || 'Chat error'
        throw new Error(errMsg)
      }
      const answer = data?.text || ''
      await appendMessage(currentSession.id, { role: 'assistant', content: answer || 'No response.' })
    } catch (e: any) {
      await appendMessage(currentSession.id, { role: 'assistant', content: `Sorry, I hit an error. ${e?.message || ''}` })
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background flex flex-col">
        <div className="p-3 border-b">
          <Button className="w-full" onClick={newChat}>New Chat</Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sessions.map(s => (
            <button key={s.id} onClick={() => setCurrentId(s.id)} className={`w-full text-left px-3 py-2 rounded hover:bg-accent ${currentId === s.id ? 'bg-accent' : ''}`}>
              <div className="text-sm font-medium truncate">{s.title}</div>
              <div className="text-xs text-muted-foreground truncate">{new Date(s.createdAt).toLocaleString()}</div>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="text-xs text-muted-foreground px-2">No chats yet.</div>
          )}
        </div>
      </aside>

      {/* Chat */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div ref={viewportRef} className="flex-1 overflow-y-auto p-4 space-y-3 relative">
          {!currentSession && (
            <div className="text-center text-muted-foreground">Start a new chat or generate a plan from dashboard.</div>
          )}
          
          {/* Welcome message for new chats */}
          <AnimatePresence>
            {currentSession && currentSession.messages.length === 0 && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome!</h2>
                  <p className="text-muted-foreground">
                    I'm your AI assistant for Ayurvedic health and diabetes management.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ask me anything about your health, Prakriti, or lifestyle recommendations.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {currentSession && currentSession.messages.map((m, i) => (
            <div key={i} className={`max-w-3xl ${m.role === 'user' ? 'ml-auto' : ''}`}>
              <div className={`rounded-md p-3 border ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                {m.role === 'user' ? (
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</pre>
                ) : (
                  <MarkdownRenderer content={m.content} />
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="max-w-3xl">
              <div className="rounded-md p-3 border bg-card">
                <FloatingDots />
              </div>
            </div>
          )}
          {chatLoading && (
            <div className="max-w-3xl">
              <div className="rounded-md p-3 border bg-card">
                <FloatingDots />
              </div>
            </div>
          )}
        </div>
        <div className="border-t bg-background p-3">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <Input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Send a message…" 
              onKeyDown={e => { if (e.key === 'Enter') sendMessage() }} 
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!input.trim() || chatLoading}>Send</Button>
          </div>
        </div>
      </main>
    </div>
  )
}


