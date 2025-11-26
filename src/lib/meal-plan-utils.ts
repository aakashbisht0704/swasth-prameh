// Utility functions for meal plan validation and canonical meal management

import { samplePlans, type CanonicalPlans, type CanonicalMealDay } from '@/lib/canonical-plans'

export type PrakritiType = 'kaphaj' | 'pittaj' | 'vataja'

// Re-export types for convenience
export type { CanonicalMealDay, CanonicalPlans } from '@/lib/canonical-plans'

// Get all allowed meal items for a given prakriti
export function getAllowedMealItems(prakriti: PrakritiType): string[] {
  const plans = samplePlans as CanonicalPlans
  const plan = plans[prakriti]
  
  if (!plan || !Array.isArray(plan)) {
    return []
  }
  
  const items = new Set<string>()
  
  plan.forEach(day => {
    if (day.breakfast) items.add(day.breakfast.toLowerCase().trim())
    if (day['12pm']) items.add(day['12pm'].toLowerCase().trim())
    if (day.lunch) items.add(day.lunch.toLowerCase().trim())
    if (day['6pm']) items.add(day['6pm'].toLowerCase().trim())
    if (day.dinner) items.add(day.dinner.toLowerCase().trim())
  })
  
  return Array.from(items)
}

// Check if a meal item is in the allowed list for a prakriti
export function isAllowedMealItem(mealText: string, prakriti: PrakritiType): boolean {
  const allowedItems = getAllowedMealItems(prakriti)
  const normalizedMeal = mealText.toLowerCase().trim()
  
  // Check for exact match or if the meal contains any allowed item
  return allowedItems.some(item => 
    normalizedMeal.includes(item) || item.includes(normalizedMeal)
  )
}

// Validate a meal plan against canonical items
export function validateMealPlan(
  plan: any, 
  prakriti: PrakritiType
): { valid: boolean; invalidItems: string[] } {
  const invalidItems: string[] = []
  const allowedItems = getAllowedMealItems(prakriti)
  
  if (!plan || !Array.isArray(plan)) {
    return { valid: false, invalidItems: ['Plan is not a valid array'] }
  }
  
  plan.forEach((day: any, index: number) => {
    const meals = [
      day.breakfast,
      day['12pm'] || day.snack12 || day.midMorning,
      day.lunch,
      day['6pm'] || day.snack6 || day.evening,
      day.dinner
    ].filter(Boolean)
    
    meals.forEach((meal: string) => {
      const normalizedMeal = meal.toLowerCase().trim()
      const isAllowed = allowedItems.some(item => 
        normalizedMeal.includes(item) || item.includes(normalizedMeal)
      )
      
      if (!isAllowed) {
        invalidItems.push(`Day ${index + 1}: ${meal}`)
      }
    })
  })
  
  return {
    valid: invalidItems.length === 0,
    invalidItems
  }
}

// Get canonical plan for a prakriti
export function getCanonicalPlan(prakriti: PrakritiType): CanonicalMealDay[] | null {
  const plans = samplePlans as CanonicalPlans
  return plans[prakriti] || null
}

// Normalize prakriti string to canonical form
export function normalizePrakriti(prakriti: string | null | undefined): PrakritiType | null {
  if (!prakriti) return null
  
  const normalized = prakriti.toLowerCase()
  
  if (normalized.includes('kapha') || normalized.includes('kaphaj')) {
    return 'kaphaj'
  } else if (normalized.includes('pitta') || normalized.includes('pittaj')) {
    return 'pittaj'
  } else if (normalized.includes('vata') || normalized.includes('vataja') || normalized.includes('vataaja')) {
    return 'vataja'
  }
  
  return null
}

// Generate a list of allowed items for LLM prompt
export function getAllowedItemsPrompt(prakriti: PrakritiType): string {
  const plan = getCanonicalPlan(prakriti)
  if (!plan) return ''
  
  const items = new Set<string>()
  
  plan.forEach(day => {
    if (day.breakfast) items.add(day.breakfast)
    if (day['12pm']) items.add(day['12pm'])
    if (day.lunch) items.add(day.lunch)
    if (day['6pm']) items.add(day['6pm'])
    if (day.dinner) items.add(day.dinner)
  })
  
  return Array.from(items).join(', ')
}

