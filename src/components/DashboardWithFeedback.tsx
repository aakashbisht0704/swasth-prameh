'use client'

import { useFeedback } from '@/hooks/useFeedback'
import { FeedbackModal } from '@/components/FeedbackModal'
import { useEffect } from 'react'

interface DashboardWithFeedbackProps {
  userId: string
  planId?: string
  lastPlanDate?: string
  children: React.ReactNode
}

export function DashboardWithFeedback({ userId, planId, lastPlanDate, children }: DashboardWithFeedbackProps) {
  const {
    shouldShowFeedback,
    isModalOpen,
    showFeedbackModal,
    hideFeedbackModal,
    onFeedbackSubmitted
  } = useFeedback({ userId, planId, lastPlanDate })

  useEffect(() => {
    // Show feedback modal after a short delay if eligible
    if (shouldShowFeedback) {
      const timer = setTimeout(() => {
        showFeedbackModal()
      }, 2000) // 2 second delay

      return () => clearTimeout(timer)
    }
  }, [shouldShowFeedback, showFeedbackModal])

  return (
    <>
      {children}
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={hideFeedbackModal}
        userId={userId}
        planId={planId}
        onFeedbackSubmitted={onFeedbackSubmitted}
      />
    </>
  )
}
