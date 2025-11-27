// Utility to generate 15-day plans from 7-day canonical plans
import { samplePlans, type CanonicalMealDay } from '@/lib/canonical-plans'

/**
 * Generates a 15-day plan from a 7-day canonical plan
 * Repeats the 7-day cycle twice, then adds one more day
 */
export function generate15DayPlan(canonicalPlan: CanonicalMealDay[]): CanonicalMealDay[] {
  if (!canonicalPlan || canonicalPlan.length !== 7) {
    throw new Error('Canonical plan must have exactly 7 days')
  }

  const days15: CanonicalMealDay[] = []
  
  // Repeat the 7-day cycle twice (14 days)
  for (let i = 0; i < 2; i++) {
    canonicalPlan.forEach((day, index) => {
      days15.push({
        ...day,
        day: `DAY_${days15.length + 1}` // Use DAY_1, DAY_2, etc.
      })
    })
  }
  
  // Add one more day (first day again to make 15)
  days15.push({
    ...canonicalPlan[0],
    day: 'DAY_15'
  })
  
  return days15
}

/**
 * Get canonical plan for a prakriti type
 */
export function getCanonicalPlanForPrakriti(prakriti: 'kaphaj' | 'pittaj' | 'vataja'): CanonicalMealDay[] | null {
  return samplePlans[prakriti] || null
}

