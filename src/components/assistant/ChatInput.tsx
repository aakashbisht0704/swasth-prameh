'use client'

import { useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
  placeholder = 'Ask anything about Ayurvedic Diabetes Management...',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }, [value])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading && !disabled) {
        onSubmit()
      }
    }
  }

  const handleSubmit = () => {
    if (value.trim() && !isLoading && !disabled) {
      onSubmit()
    }
  }

  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-4xl px-4 py-4">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className={cn(
              'flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-0',
              'disabled:opacity-50',
              'max-h-[200px] overflow-y-auto'
            )}
          />
          <Button
            onClick={handleSubmit}
            disabled={!value.trim() || isLoading || disabled}
            size="icon"
            className="h-9 w-9 shrink-0 rounded-lg"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

