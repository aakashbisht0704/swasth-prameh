'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorFallbackProps {
  error?: Error | null
  resetError: () => void
  title?: string
  description?: string
  showDetails?: boolean
}

export function ErrorFallback({ 
  error, 
  resetError, 
  title = "Something went wrong",
  description = "We encountered an unexpected error. Please try again.",
  showDetails = true
}: ErrorFallbackProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-500/20 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300 text-center">
            {description}
          </p>
          {showDetails && error && (
            <details className="text-xs text-gray-400 bg-black/20 p-2 rounded">
              <summary className="cursor-pointer mb-2">Error details</summary>
              <pre className="whitespace-pre-wrap">{error.message}</pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
            <Button
              onClick={resetError}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
