'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Star, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  planId?: string
  onFeedbackSubmitted?: () => void
}

export function FeedbackModal({ isOpen, onClose, userId, planId, onFeedbackSubmitted }: FeedbackModalProps) {
  const [score, setScore] = useState(0)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (score === 0) {
      toast.error('Please select a rating')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: userId,
          plan_id: planId,
          score,
          notes: notes.trim() || null
        })

      if (error) throw error

      toast.success('Thank you for your feedback!')
      setScore(0)
      setNotes('')
      onClose()
      onFeedbackSubmitted?.()
    } catch (error: any) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setScore(0)
    setNotes('')
    setHoveredStar(0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>How was your 15-day plan?</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-1"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setScore(star)}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredStar || score)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                {score === 1 && 'Poor'}
                {score === 2 && 'Fair'}
                {score === 3 && 'Good'}
                {score === 4 && 'Very Good'}
                {score === 5 && 'Excellent'}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Additional comments (optional)
              </label>
              <textarea
                id="notes"
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Tell us what worked well or what could be improved..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading || score === 0} className="flex-1">
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
