'use client'

import { AuthForm } from '@/components/auth-form'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-6 bg-zinc-900 rounded-lg shadow flex flex-col items-center">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        <AuthForm />
      </div>
    </div>
  )
}