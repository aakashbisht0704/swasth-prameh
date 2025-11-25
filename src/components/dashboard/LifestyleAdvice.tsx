'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface LifestyleAdviceProps {
  lifestyle: any
  investigation?: any
}

export function LifestyleAdvice({ lifestyle, investigation }: LifestyleAdviceProps) {
  const [advice, setAdvice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only fetch advice if lifestyle data exists
    if (!lifestyle || Object.keys(lifestyle).length === 0) {
      return
    }

    const fetchAdvice = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/lifestyle/advice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lifestyle, investigation }),
        })

        const data = await response.json()
        
        if (response.ok) {
          setAdvice(data.advice || 'Unable to generate advice at this time.')
        } else {
          setError(data.error || 'Failed to load advice')
          setAdvice(data.advice || null) // Use fallback advice if provided
        }
      } catch (err) {
        console.error('Error fetching lifestyle advice:', err)
        setError('Failed to load advice')
      } finally {
        setLoading(false)
      }
    }

    fetchAdvice()
  }, [lifestyle])

  if (!lifestyle || Object.keys(lifestyle).length === 0) {
    return null
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating personalized advice...</span>
            </div>
          ) : error && !advice ? (
            <p className="text-sm text-muted-foreground italic">
              {error}
            </p>
          ) : advice ? (
            <div className="space-y-1">
              <p className="text-xs font-medium text-primary mb-1">💡 Ayurvedic Insight</p>
              <p className="text-sm text-foreground leading-relaxed">
                {advice}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

