'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { trackActivity } from '@/lib/activity-tracking'
import { AlertCircle, CheckCircle2, Calendar, Clock, UtensilsCrossed } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface PlanDay {
  day: string
  breakfast: string
  '12pm': string
  lunch: string
  '6pm': string
  dinner: string
}

interface Plan {
  id: string
  user_id: string
  plan_type: 'sample' | 'ai'
  prakriti: string
  start_date: string
  end_date: string
  is_active: boolean
  summary: string
  payload: PlanDay[]
  created_at: string
}

interface MealLoggingProps {
  userId: string
}

interface UserPrakriti {
  prakriti: string | null
  hasOnboarding: boolean
}

export function MealLogging({ userId }: MealLoggingProps) {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [userPrakriti, setUserPrakriti] = useState<UserPrakriti>({ prakriti: null, hasOnboarding: false })
  const [loading, setLoading] = useState(true)
  const [applyingPlan, setApplyingPlan] = useState(false)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [allergies, setAllergies] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load user prakriti
      await loadUserPrakriti()
      
      // Load current plan
      await loadCurrentPlan()
      
      // Load allergies from investigation
      await loadAllergies()
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load meal plan data')
    } finally {
      setLoading(false)
    }
  }

  const loadUserPrakriti = async () => {
    try {
      // Try user_profiles first
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('prakriti')
        .eq('id', userId)
        .single()

      if (profile?.prakriti) {
        setUserPrakriti({ prakriti: profile.prakriti, hasOnboarding: true })
        return
      }

      // Try onboarding
      const { data: onboarding } = await supabase
        .from('onboarding')
        .select('dominant_dosha, prakriti_summary')
        .eq('user_id', userId)
        .single()

      if (onboarding) {
        const prakriti = onboarding.dominant_dosha || onboarding.prakriti_summary?.dominant
        setUserPrakriti({ 
          prakriti: prakriti || null, 
          hasOnboarding: true 
        })
      } else {
        setUserPrakriti({ prakriti: null, hasOnboarding: false })
      }
    } catch (error) {
      console.error('Error loading prakriti:', error)
      setUserPrakriti({ prakriti: null, hasOnboarding: false })
    }
  }

  const loadCurrentPlan = async () => {
    try {
      const response = await fetch(`/api/plans/current?user_id=${userId}`)
      const data = await response.json()
      
      if (data.plan) {
        setPlan(data.plan)
        // Set selected day to today or first day
        if (data.plan.payload && data.plan.payload.length > 0) {
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
          const dayExists = data.plan.payload.find((d: PlanDay) => d.day === today)
          setSelectedDay(dayExists ? today : data.plan.payload[0].day)
        }
      } else {
        setPlan(null)
      }
    } catch (error) {
      console.error('Error loading plan:', error)
      setPlan(null)
    }
  }

  const loadAllergies = async () => {
    try {
      const { data: onboarding } = await supabase
        .from('onboarding')
        .select('investigation')
        .eq('user_id', userId)
        .single()

      if (onboarding?.investigation?.medical_history?.allergies) {
        const allergyText = onboarding.investigation.medical_history.allergies
        // Simple parsing - split by comma or newline
        const allergyList = allergyText.split(/[,\n]/).map(a => a.trim().toLowerCase()).filter(Boolean)
        setAllergies(allergyList)
      }
    } catch (error) {
      console.error('Error loading allergies:', error)
    }
  }

  const handleApplySamplePlan = async () => {
    setApplyingPlan(true)
    try {
      await trackActivity(userId, 'apply_sample_plan_click')
      
      const response = await fetch('/api/plans/apply-sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to apply sample plan')
      }

      toast.success('Sample plan applied successfully!')
      await loadCurrentPlan()
    } catch (error: any) {
      console.error('Error applying sample plan:', error)
      toast.error(error.message || 'Failed to apply sample plan')
    } finally {
      setApplyingPlan(false)
    }
  }

  const handleGenerateAIPlan = async () => {
    setGeneratingPlan(true)
    try {
      await trackActivity(userId, 'generate_ai_plan_click')
      
      const response = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan')
      }

      toast.success('AI plan generated successfully!')
      await loadCurrentPlan()
    } catch (error: any) {
      console.error('Error generating plan:', error)
      toast.error(error.message || 'Failed to generate plan')
    } finally {
      setGeneratingPlan(false)
    }
  }

  const handleMarkMealEaten = async (day: string, mealSlot: string, menuText: string) => {
    try {
      const response = await fetch('/api/meals/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          plan_id: plan?.id,
          date: new Date().toISOString().split('T')[0],
          meal_slot: mealSlot === '12pm' ? 'snack12' : mealSlot === '6pm' ? 'snack6' : mealSlot,
          menu_text: menuText,
          source: 'plan',
          created_via: 'meal_logging_ui'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to log meal')
      }

      toast.success('Meal marked as eaten!')
      await trackActivity(userId, 'meal_marked_eaten')
    } catch (error) {
      console.error('Error marking meal:', error)
      toast.error('Failed to mark meal as eaten')
    }
  }

  const checkAllergyConflict = (mealText: string): string | null => {
    if (allergies.length === 0) return null
    
    const normalizedMeal = mealText.toLowerCase()
    const conflict = allergies.find(allergy => normalizedMeal.includes(allergy))
    return conflict || null
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-64 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // No prakriti - show CTA to complete assessment
  if (!userPrakriti.hasOnboarding || !userPrakriti.prakriti) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meal Logging</h1>
          <p className="text-muted-foreground">
            Track your meals from your personalized diet plan
          </p>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-4">
              <p className="font-semibold">Complete your Prakriti Assessment to generate a personalized diet plan</p>
              <p className="text-sm text-muted-foreground">
                Your meal plan will be customized based on your unique Ayurvedic constitution (Prakriti).
              </p>
              <Button 
                onClick={() => router.push('/onboarding')}
                className="mt-2"
              >
                Go to Prakriti Assessment
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Has prakriti but no plan - show CTA to apply sample plan
  if (!plan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meal Logging</h1>
          <p className="text-muted-foreground">
            Track your meals from your personalized diet plan
          </p>
        </div>
        
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              Apply Your {userPrakriti.prakriti.charAt(0).toUpperCase() + userPrakriti.prakriti.slice(1)} Diet Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              You have completed your Prakriti assessment. Apply a 7-day sample plan based on your {userPrakriti.prakriti} constitution, 
              or generate a custom AI-powered 15-day plan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleApplySamplePlan}
                disabled={applyingPlan}
                className="flex-1"
              >
                {applyingPlan ? 'Applying...' : 'Apply 7-Day Sample Plan'}
              </Button>
              <Button 
                onClick={handleGenerateAIPlan}
                disabled={generatingPlan}
                variant="outline"
                className="flex-1"
              >
                {generatingPlan ? 'Generating...' : 'Generate AI Plan (15 Days)'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sample plans are based on canonical Ayurvedic meal plans. AI plans are personalized based on your investigation data.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Has plan - show meal plan
  const currentDay = plan.payload.find((d: PlanDay) => d.day === selectedDay) || plan.payload[0]
  const daysOfWeek = plan.payload.map((d: PlanDay) => d.day)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Meal Plan</h1>
          <p className="text-muted-foreground">
            {plan.plan_type === 'sample' ? '7-day' : '15-day'} {plan.prakriti} plan
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateAIPlan}
            disabled={generatingPlan}
            variant="outline"
            size="sm"
          >
            {generatingPlan ? 'Generating...' : 'Regenerate Plan (AI)'}
          </Button>
        </div>
      </div>

      {/* Plan Metadata */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant={plan.plan_type === 'sample' ? 'default' : 'secondary'}>
                {plan.plan_type === 'sample' ? 'Sample Plan' : 'AI Generated'}
              </Badge>
              <span className="text-muted-foreground">
                {plan.prakriti.charAt(0).toUpperCase() + plan.prakriti.slice(1)} Plan
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(plan.start_date).toLocaleDateString()} - {new Date(plan.end_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Selector */}
      <div className="flex flex-wrap gap-2">
        {daysOfWeek.map((day: string) => (
          <Button
            key={day}
            variant={selectedDay === day ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </Button>
        ))}
      </div>

      {/* Current Day Meals */}
      {currentDay && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { slot: 'breakfast', label: 'Breakfast', icon: '🌅' },
            { slot: '12pm', label: '12 PM Snack', icon: '🍎' },
            { slot: 'lunch', label: 'Lunch', icon: '🍽️' },
            { slot: '6pm', label: '6 PM Snack', icon: '🥜' },
            { slot: 'dinner', label: 'Dinner', icon: '🌙' }
          ].map(({ slot, label, icon }) => {
            const mealText = currentDay[slot as keyof PlanDay] as string
            if (!mealText) return null
            
            const allergyConflict = checkAllergyConflict(mealText)
            const mealSlot = slot === '12pm' ? 'snack12' : slot === '6pm' ? 'snack6' : slot

            return (
              <Card 
                key={slot} 
                className={`${allergyConflict ? 'border-warning bg-warning/5' : ''}`}
              >
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span>{icon}</span>
                      {label}
                    </span>
                    {allergyConflict && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertCircle className="h-4 w-4 text-warning" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Check with doctor: contains {allergyConflict}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className={`text-sm ${allergyConflict ? 'text-muted-foreground line-through' : ''}`}>
                    {mealText}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      From SwasthPrameh {plan.prakriti.charAt(0).toUpperCase() + plan.prakriti.slice(1)} Plan
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkMealEaten(selectedDay || '', mealSlot, mealText)}
                      className="h-7 text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Mark Eaten
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
