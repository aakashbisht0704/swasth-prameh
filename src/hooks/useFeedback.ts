'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface FeedbackData {
  userId: string
  planId?: string
  lastPlanDate?: string
}

export function useFeedback({ userId, planId, lastPlanDate }: FeedbackData) {
  const [shouldShowFeedback, setShouldShowFeedback] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasExistingFeedback, setHasExistingFeedback] = useState(false)

  useEffect(() => {
    checkFeedbackEligibility()
  }, [userId, planId, lastPlanDate])

  const checkFeedbackEligibility = async () => {
    if (!userId || !lastPlanDate) return

    try {
      // Check if there's existing feedback for this plan
      if (planId) {
        const { data: existingFeedback } = await supabase
          .from('feedback')
          .select('id')
          .eq('user_id', userId)
          .eq('plan_id', planId)
          .maybeSingle()

        if (existingFeedback) {
          setHasExistingFeedback(true)
          return
        }
      }

      // Check if 15 days have passed since the last plan
      const planDate = new Date(lastPlanDate)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - planDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff >= 15) {
        setShouldShowFeedback(true)
      }
    } catch (error) {
      console.error('Error checking feedback eligibility:', error)
    }
  }

  const showFeedbackModal = () => {
    setIsModalOpen(true)
  }

  const hideFeedbackModal = () => {
    setIsModalOpen(false)
  }

  const onFeedbackSubmitted = () => {
    setShouldShowFeedback(false)
    setHasExistingFeedback(true)
    setIsModalOpen(false)
  }

  return {
    shouldShowFeedback,
    isModalOpen,
    hasExistingFeedback,
    showFeedbackModal,
    hideFeedbackModal,
    onFeedbackSubmitted
  }
}
