'use client'

import { motion } from 'motion/react'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { cn } from '@/lib/utils'

type ChatMessageProps = {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date | null
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] md:max-w-[75%]',
          isUser ? 'ml-auto' : 'mr-auto'
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3 shadow-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-foreground'
          )}
        >
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <MarkdownRenderer content={content} />
          </div>
          {timestamp && (
            <div className={cn(
              'mt-2 text-xs opacity-70',
              isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}>
              {timestamp.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
