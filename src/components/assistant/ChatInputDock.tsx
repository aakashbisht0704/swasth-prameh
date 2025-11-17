'use client'

import { useState, KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { Paperclip, Mic, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ChatInputDockProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading?: boolean
  disabled?: boolean
}

export function ChatInputDock({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  disabled = false,
}: ChatInputDockProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading && !disabled) {
        onSubmit()
      }
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white/95 backdrop-blur-md border-t border-gray-200 p-4">
      <div className="w-full max-w-[1080px]">
        <div
          className={`flex items-center gap-3 rounded-full bg-white border-2 shadow-xl transition-all ${
            isFocused ? 'border-purple-500' : 'border-black'
          }`}
        >
          {/* Attachment Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            title="Attach file"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="type your prompt here"
            disabled={disabled || isLoading}
            className="flex-1 border-none bg-transparent px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
          />

          {/* Microphone Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
            title="Voice input"
            disabled={disabled}
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* Send Button */}
          <motion.button
            onClick={onSubmit}
            disabled={!value.trim() || isLoading || disabled}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
              value.trim() && !isLoading && !disabled
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white/50 cursor-not-allowed'
            }`}
            whileHover={value.trim() && !isLoading && !disabled ? { scale: 1.05 } : {}}
            whileTap={value.trim() && !isLoading && !disabled ? { scale: 0.9 } : {}}
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-5 w-5" />
              </motion.div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

