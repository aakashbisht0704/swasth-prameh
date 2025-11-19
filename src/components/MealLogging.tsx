'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { trackActivity } from '@/lib/activity-tracking'

interface PlanDay {
  day: number
  morning: string
  meals: string // Legacy format: "Breakfast: ... Lunch: ... Dinner: ..."
  evening: string
  // New structured format (optional for backward compatibility)
  breakfast?: string
  lunch?: string
  dinner?: string
}

interface Plan {
  id: string
  user_id: string
  summary: string | null
  plan: PlanDay[]
  plan_json?: any
  markdown_table?: string
  created_at: string
}

interface MealLoggingProps {
  userId: string
}

export function MealLogging({ userId }: MealLoggingProps) {
  const [plan, setPlan] = useState<Plan | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadPlan()
  }, [userId])

  const loadPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()  // Use maybeSingle() instead of single()
      
      // maybeSingle() returns null if no rows found, no error
      if (error) {
        console.error('Database error:', error)
        toast.error('Failed to load diet plan')
        setPlan(getDefaultPlan())
        return
      }
      
      if (data) {
        // Parse plan_json from database format
        const parsedPlan: Plan = {
          ...data,
          plan: data.plan_json?.plan || data.plan_json || getDefaultPlan().plan,
          summary: data.summary || 'Ayurvedic diet plan'
        }
        console.log('Loaded plan from database:', parsedPlan)
        setPlan(parsedPlan)
      } else {
        // Show default plan if no AI plan exists
        console.log('No plans found, showing default plan')
        setPlan(getDefaultPlan())
      }
    } catch (error) {
      console.error('Error loading plan:', error)
      toast.error('Failed to load diet plan')
      setPlan(getDefaultPlan())
    }
  }

  const getDefaultPlan = (): Plan => {
    return {
      id: 'default',
      user_id: userId,
      summary: 'Balanced Ayurvedic diet plan focusing on whole foods, proper timing, and dosha balance.',
      plan: [
        {
          day: 1,
          morning: 'Warm water with lemon, herbal tea',
          meals: 'Breakfast: Oatmeal with fruits and nuts. Lunch: Dal, brown rice, vegetables, roti. Dinner: Vegetable soup, salad',
          evening: 'Herbal tea, light walk'
        },
        {
          day: 2,
          morning: 'Turmeric milk, soaked almonds',
          meals: 'Breakfast: Poha with vegetables. Lunch: Quinoa pulao, dal. Dinner: Moong dal khichdi, yogurt',
          evening: 'Chamomile tea, meditation'
        },
        {
          day: 3,
          morning: 'Warm water with honey, gentle yoga',
          meals: 'Breakfast: Ragi dosa with coconut chutney. Lunch: Mixed vegetable curry, brown rice. Dinner: Lentil soup, roasted vegetables',
          evening: 'Triphala powder with warm water'
        },
        {
          day: 4,
          morning: 'Herbal tea, fruits',
          meals: 'Breakfast: Vegetable upma. Lunch: Rajma, brown rice, salad. Dinner: Vegetable stew, roti',
          evening: 'Pranayama, warm milk with turmeric'
        },
        {
          day: 5,
          morning: 'Aloe vera juice, soaked walnuts',
          meals: 'Breakfast: Sprouted moong salad. Lunch: Sambar, brown rice, vegetables. Dinner: Vegetable khichdi, pickles',
          evening: 'Green tea, light walk'
        },
        {
          day: 6,
          morning: 'Warm water with lemon, meditation',
          meals: 'Breakfast: Besan chilla with vegetables. Lunch: Dal fry, roti, vegetables. Dinner: Tomato soup, salad',
          evening: 'Herbal tea, journaling'
        },
        {
          day: 7,
          morning: 'Turmeric milk, dates',
          meals: 'Breakfast: Poha with peas. Lunch: Quinoa with vegetables, dal. Dinner: Moong dal khichdi, roasted papad',
          evening: 'Ashwagandha powder with warm milk'
        },
        {
          day: 8,
          morning: 'Warm water with honey, gentle yoga',
          meals: 'Breakfast: Oatmeal with fruits. Lunch: Mixed dal, brown rice, vegetables. Dinner: Lentil soup, salad',
          evening: 'Herbal tea, pranayama'
        },
        {
          day: 9,
          morning: 'Aloe vera juice, soaked almonds',
          meals: 'Breakfast: Vegetable paratha with yogurt. Lunch: Dal tadka, roti, vegetables. Dinner: Vegetable stew, brown rice',
          evening: 'Triphala powder with warm water'
        },
        {
          day: 10,
          morning: 'Herbal tea, fruits',
          meals: 'Breakfast: Sprouted moong salad. Lunch: Sambar, brown rice, vegetables. Dinner: Moong dal khichdi, pickles',
          evening: 'Pranayama, warm milk with turmeric'
        },
        {
          day: 11,
          morning: 'Warm water with lemon, meditation',
          meals: 'Breakfast: Besan chilla with vegetables. Lunch: Rajma, brown rice, salad. Dinner: Tomato soup, salad',
          evening: 'Herbal tea, light walk'
        },
        {
          day: 12,
          morning: 'Turmeric milk, dates',
          meals: 'Breakfast: Poha with vegetables. Lunch: Quinoa pulao, dal. Dinner: Vegetable khichdi, yogurt',
          evening: 'Green tea, journaling'
        },
        {
          day: 13,
          morning: 'Aloe vera juice, soaked walnuts',
          meals: 'Breakfast: Vegetable upma. Lunch: Mixed vegetable curry, brown rice. Dinner: Lentil soup, roti',
          evening: 'Herbal tea, meditation'
        },
        {
          day: 14,
          morning: 'Warm water with honey, gentle yoga',
          meals: 'Breakfast: Oatmeal with fruits and nuts. Lunch: Dal fry, roti, vegetables. Dinner: Moong dal khichdi, roasted vegetables',
          evening: 'Ashwagandha powder with warm milk'
        },
        {
          day: 15,
          morning: 'Turmeric milk, soaked almonds',
          meals: 'Breakfast: Ragi dosa with coconut chutney. Lunch: Dal, brown rice, vegetables, roti. Dinner: Vegetable soup, salad',
          evening: 'Triphala powder with warm water, reflection'
        }
      ],
      created_at: new Date().toISOString()
    }
  }

  const handleGeneratePlan = async () => {
    setLoading(true)
    try {
      // Track the click
      await trackActivity(userId, 'generate_plan_click')
      
      const response = await fetch('/api/plans/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      })

      if (!response.ok) throw new Error('Failed to generate plan')

      const data = await response.json()
      toast.success('New plan generated!')
      
      // Reload the plan
      loadPlan()
    } catch (error) {
      console.error('Error generating plan:', error)
      toast.error('Failed to generate new plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your 15-Day Diet Plan</h1>
          <p className="text-muted-foreground">
            Follow this personalized Ayurvedic meal plan for optimal health
          </p>
        </div>
        <Button 
          onClick={handleGeneratePlan} 
          disabled={loading}
          className="rounded-xl"
        >
          {loading ? 'Generating...' : 'Generate New Plan'}
        </Button>
      </div>

      {plan && (
        <>
          <Card className="rounded-xl shadow-md border-border bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-2">Plan Overview</h3>
              <p className="text-muted-foreground">{plan.summary}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plan.plan.map((day) => (
              <Card key={day.day} className="rounded-xl shadow-md border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Day {day.day}</span>
                    <span className="text-2xl">📅</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-1 flex items-center">
                      🌅 Morning
                    </h4>
                    <p className="text-sm text-muted-foreground">{day.morning}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2 flex items-center">
                      🍽️ Meals
                    </h4>
                    <div className="space-y-3">
                      {(() => {
                        // Check if we have new structured format (all three meals as separate fields)
                        const hasNewFormat = day.breakfast && day.lunch && day.dinner
                        
                        if (hasNewFormat) {
                          // New structured format - all three meals exist
                          return (
                            <>
                              <div>
                                <span className="font-bold text-sm text-foreground">Breakfast:</span>
                                <p className="text-sm text-muted-foreground mt-1 ml-0">{day.breakfast}</p>
                              </div>
                              <div>
                                <span className="font-bold text-sm text-foreground">Lunch:</span>
                                <p className="text-sm text-muted-foreground mt-1 ml-0">{day.lunch}</p>
                              </div>
                              <div>
                                <span className="font-bold text-sm text-foreground">Dinner:</span>
                                <p className="text-sm text-muted-foreground mt-1 ml-0">{day.dinner}</p>
                              </div>
                            </>
                          )
                        }
                        
                        // Try to parse legacy format from meals field
                        const mealsText = day.meals || ''
                        if (mealsText) {
                          // Better parsing: split by meal keywords and extract content
                          // Use [\s\S] instead of . to match any character including newlines
                          const breakfastRegex = /Breakfast[:\s]+([\s\S]+?)(?=\s*(?:Lunch|Dinner|$))/i
                          const lunchRegex = /Lunch[:\s]+([\s\S]+?)(?=\s*(?:Dinner|$))/i
                          const dinnerRegex = /Dinner[:\s]+([\s\S]+?)(?=\s*(?:Breakfast|Lunch|$)|$)/i
                          
                          const breakfastMatch = mealsText.match(breakfastRegex)
                          const lunchMatch = mealsText.match(lunchRegex)
                          const dinnerMatch = mealsText.match(dinnerRegex)
                          
                          // If we found at least one meal, display them
                          if (breakfastMatch || lunchMatch || dinnerMatch) {
                            return (
                              <>
                                {breakfastMatch && (
                                  <div>
                                    <span className="font-bold text-sm text-foreground">Breakfast:</span>
                                    <p className="text-sm text-muted-foreground mt-1 ml-0">{breakfastMatch[1].trim().replace(/\.$/, '')}</p>
                                  </div>
                                )}
                                {lunchMatch && (
                                  <div>
                                    <span className="font-bold text-sm text-foreground">Lunch:</span>
                                    <p className="text-sm text-muted-foreground mt-1 ml-0">{lunchMatch[1].trim().replace(/\.$/, '')}</p>
                                  </div>
                                )}
                                {dinnerMatch && (
                                  <div>
                                    <span className="font-bold text-sm text-foreground">Dinner:</span>
                                    <p className="text-sm text-muted-foreground mt-1 ml-0">{dinnerMatch[1].trim().replace(/\.$/, '')}</p>
                                  </div>
                                )}
                              </>
                            )
                          }
                          
                          // Fallback: show as-is if parsing fails
                          return <p className="text-sm text-muted-foreground">{day.meals}</p>
                        }
                        
                        // If we have partial new format (some meals but not all), show what we have
                        if (day.breakfast || day.lunch || day.dinner) {
                          return (
                            <>
                              {day.breakfast && (
                                <div>
                                  <span className="font-bold text-sm text-foreground">Breakfast:</span>
                                  <p className="text-sm text-muted-foreground mt-1 ml-0">{day.breakfast}</p>
                                </div>
                              )}
                              {day.lunch && (
                                <div>
                                  <span className="font-bold text-sm text-foreground">Lunch:</span>
                                  <p className="text-sm text-muted-foreground mt-1 ml-0">{day.lunch}</p>
                                </div>
                              )}
                              {day.dinner && (
                                <div>
                                  <span className="font-bold text-sm text-foreground">Dinner:</span>
                                  <p className="text-sm text-muted-foreground mt-1 ml-0">{day.dinner}</p>
                                </div>
                              )}
                            </>
                          )
                        }
                        
                        // Final fallback
                        return <p className="text-sm text-muted-foreground">No meal information available</p>
                      })()}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-1 flex items-center">
                      🌙 Evening
                    </h4>
                    <p className="text-sm text-muted-foreground">{day.evening}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
