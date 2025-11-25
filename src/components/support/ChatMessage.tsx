'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { SupportMessage } from '@/types/support'
import { cn } from '@/lib/utils'

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

interface ChatMessageProps {
  message: SupportMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isSystem = message.sender_role === 'system'
  const isSupport = message.sender_role === 'support' || message.sender_role === 'admin'
  const isUser = message.sender_role === 'user'

  const senderName = message.sender?.full_name || message.sender?.email || 'Unknown'
  const senderInitials = senderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (isSystem) {
    return (
      <div className="flex items-center justify-center py-2">
        <Badge variant="outline" className="text-xs">
          {message.message}
        </Badge>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-2',
        isSupport ? 'flex-row' : 'flex-row-reverse'
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender?.avatar_url || undefined} />
        <AvatarFallback>{senderInitials}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'flex flex-col gap-1 max-w-[80%]',
          isSupport ? 'items-start' : 'items-end'
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{senderName}</span>
          {isSupport && (
            <Badge variant="secondary" className="text-xs">
              {message.sender_role === 'admin' ? 'Admin' : 'Support'}
            </Badge>
          )}
        </div>
        <div
          className={cn(
            'rounded-lg px-3 py-2 text-sm',
            isSupport
              ? 'bg-muted text-foreground'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {message.message}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTime(message.created_at)}</span>
          {message.is_read && isUser && (
            <span className="text-primary">✓ Read</span>
          )}
        </div>
      </div>
    </div>
  )
}

