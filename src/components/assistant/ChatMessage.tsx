'use client'

import { motion } from 'motion/react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'

type ChatMessageProps = {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date | null
  metadata?: {
    cta?: string
    buttonLabel?: string
  }
}

export function ChatMessage({ role, content, timestamp, metadata }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] ${isUser ? 'ml-auto' : 'mr-auto'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-lg ${
            isUser
              ? 'bg-gradient-to-br from-[#A78BFA] to-[#8B5CF6] text-white'
              : 'bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white'
          }`}
        >
          <div className="prose prose-invert max-w-none">
            <MarkdownRenderer content={content} />
          </div>

          {metadata?.cta && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors"
              >
                {metadata.buttonLabel || 'Go to Dashboard'}
              </a>
            </div>
          )}

          {timestamp && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs text-white/70">
                {timestamp.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

