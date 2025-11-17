'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, MessageSquare, Trash2, X, User, LogOut, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import Link from 'next/link'

export type Chat = {
  id: string
  title: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  createdAt: number
  updatedAt: number
  tab?: 'assistant' // For future expansion
}

type ChatSidebarProps = {
  chats: Chat[]
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  isMobile?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export function ChatSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isMobile = false,
  isOpen = false,
  onClose,
}: ChatSidebarProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const handleDelete = (chatId: string) => {
    if (showDeleteConfirm === chatId) {
      onDeleteChat(chatId)
      setShowDeleteConfirm(null)
    } else {
      setShowDeleteConfirm(chatId)
      setTimeout(() => setShowDeleteConfirm(null), 3000)
    }
  }

  const truncateTitle = (title: string) => {
    return title.length > 25 ? title.slice(0, 25) + '...' : title
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#111214] text-white">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            SwasthPrameh
          </h1>
        </div>
        <Button
          onClick={() => {
            onNewChat()
            if (isMobile && onClose) onClose()
          }}
          className="w-full bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Begin a New Chat
        </Button>
      </div>

      {/* Chat Type Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <span>💬</span>
          <span>Assistant Chats</span>
          <span className="text-white/50">({chats.length})</span>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-white/50">
            No assistant chats yet. Start a new conversation!
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="group relative"
                onMouseEnter={() => setHoveredChatId(chat.id)}
                onMouseLeave={() => setHoveredChatId(null)}
              >
                <button
                  onClick={() => {
                    onSelectChat(chat.id)
                    if (isMobile && onClose) onClose()
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                    currentChatId === chat.id
                      ? 'bg-[#222428] text-white'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm flex-1 truncate">{truncateTitle(chat.title)}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {hoveredChatId === chat.id && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(chat.id)
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-colors"
                      title="Delete chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  )}
                </AnimatePresence>

                {showDeleteConfirm === chat.id && (
                  <div className="absolute right-2 top-full mt-1 bg-[#222428] border border-white/20 rounded-lg p-2 text-xs text-white shadow-lg z-10">
                    Click again to confirm
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="border-t border-white/10 p-4">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <User className="h-4 w-4" />
              </div>
              <span className="text-sm text-white/70 truncate">{user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Link href="/auth">
            <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[320px] z-50"
            >
              <div className="relative h-full">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    )
  }

  return <aside className="w-[320px] flex-shrink-0 border-r border-white/10">{sidebarContent}</aside>
}

