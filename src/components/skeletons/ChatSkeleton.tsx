'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages Skeleton */}
      <div className="flex-1 overflow-auto p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`max-w-3xl ${i % 2 === 0 ? 'ml-auto' : ''}`}>
            <div className={`rounded-md p-3 border ${i % 2 === 0 ? 'bg-primary' : 'bg-card'}`}>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                {i === 3 && <Skeleton className="h-4 w-3/4" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area Skeleton */}
      <div className="p-4 border-t">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  )
}
