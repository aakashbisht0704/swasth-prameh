'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, MessageSquare, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ChatSession } from '@/hooks/useChatSessions'

type SidebarProps = {
  sessions: ChatSession[]
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  isOpen: boolean
  isMobile: boolean
  onClose: () => void
}

export function Sidebar({
  sessions,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isOpen,
  isMobile,
  onClose,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const truncateTitle = (title: string, maxLength = 30) => {
    return title.length > maxLength ? title.slice(0, maxLength) + '...' : title
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Button
          onClick={() => {
            onNewChat()
            if (isMobile) onClose()
          }}
          className="w-full"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No chats yet. Start a new conversation!
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="group relative"
                  onMouseEnter={() => setHoveredId(session.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button
                    onClick={() => {
                      onSelectChat(session.id)
                      if (isMobile) onClose()
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                      currentChatId === session.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {truncateTitle(session.title)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(session.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {hoveredId === session.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteChat(session.id)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete chat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
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
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[320px] z-50 lg:hidden shadow-xl"
            >
              <div className="relative h-full">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 z-10 p-2 rounded-md bg-background border border-border hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    )
  }

  if (!isMobile) {
    return (
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.aside
            key="sidebar-open"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex-shrink-0 overflow-hidden border-r border-border"
          >
            {sidebarContent}
          </motion.aside>
        ) : null}
      </AnimatePresence>
    )
  }

  return null
}

