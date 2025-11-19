'use client'

import { AuthForm } from '@/components/auth-form'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function AuthPageContent() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}
        <AuthForm />
      </div>
    </div>
  )
}

function AuthPageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthPageFallback />}>
      <AuthPageContent />
    </Suspense>
  )
}