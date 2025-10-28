'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  className?: string
}

export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      </div>
      <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
    </div>
  )
}

// Alternative floating dots animation
export function FloatingDots({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      <div className="relative">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0s]"></div>
        <div className="absolute top-0 left-0 w-3 h-3 bg-primary/60 rounded-full animate-ping [animation-delay:0s]"></div>
      </div>
      <div className="relative">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="absolute top-0 left-0 w-3 h-3 bg-primary/60 rounded-full animate-ping [animation-delay:0.2s]"></div>
      </div>
      <div className="relative">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
        <div className="absolute top-0 left-0 w-3 h-3 bg-primary/60 rounded-full animate-ping [animation-delay:0.4s]"></div>
      </div>
    </div>
  )
}

// Wave-like floating animation
export function WaveDots({ className }: TypingIndicatorProps) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.1s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse [animation-delay:0.4s]"></div>
      </div>
      <span className="text-sm text-muted-foreground ml-3">AI is typing...</span>
    </div>
  )
}
