'use client'

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
          sizeClasses[size]
        )}
      />
    </div>
  )
}

interface LoadingTextProps {
  text?: string
  className?: string
}

export function LoadingText({ text = 'Loading...', className }: LoadingTextProps) {
  return (
    <div className={cn('flex items-center space-x-2 text-gray-500', className)}>
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  )
}
