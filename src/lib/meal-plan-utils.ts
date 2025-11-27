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

// Get all meals from OTHER prakritis (for cross-contamination detection)
function getOtherPrakritiMeals(currentPrakriti: PrakritiType): Set<string> {
  const allPrakritis: PrakritiType[] = ['kaphaj', 'pittaj', 'vataja']
  const otherPrakritis = allPrakritis.filter(p => p !== currentPrakriti)
  const otherMeals = new Set<string>()
  
  otherPrakritis.forEach(prakriti => {
    const items = getAllowedMealItems(prakriti)
    items.forEach(item => otherMeals.add(item))
  })
  
  return otherMeals
}

// Validate a meal plan against canonical items with strict prakriti checking
export function validateMealPlan(
  plan: any, 
  prakriti: PrakritiType
): { valid: boolean; invalidItems: string[]; crossContamination: string[] } {
  const invalidItems: string[] = []
  const crossContamination: string[] = []
  const allowedItems = getAllowedMealItems(prakriti)
  const otherPrakritiMeals = getOtherPrakritiMeals(prakriti)
  
  if (!plan || !Array.isArray(plan)) {
    return { valid: false, invalidItems: ['Plan is not a valid array'], crossContamination: [] }
  }
  
  plan.forEach((day: any, index: number) => {
    const meals = [
      { slot: 'breakfast', text: day.breakfast },
      { slot: '12pm', text: day['12pm'] || day.snack12 || day.midMorning },
      { slot: 'lunch', text: day.lunch },
      { slot: '6pm', text: day['6pm'] || day.snack6 || day.evening },
      { slot: 'dinner', text: day.dinner }
    ].filter(m => m.text)
    
    meals.forEach(({ slot, text }) => {
      const normalizedMeal = text.toLowerCase().trim()
      
      // FIRST check: Is this meal in the allowed list for this prakriti?
      // Use exact match or very close match (at least 80% word overlap)
      const isAllowed = allowedItems.some(item => {
        const normalizedItem = item.toLowerCase().trim()
        
        // Exact match
        if (normalizedMeal === normalizedItem) return true
        
        // Check word overlap for compound meals
        const itemWords = normalizedItem.split(/\s+/).filter(w => w.length > 2)
        const mealWords = normalizedMeal.split(/\s+/).filter(w => w.length > 2)
        
        if (itemWords.length === 0 || mealWords.length === 0) {
          // Fallback to substring match for single words
          return normalizedMeal.includes(normalizedItem) || normalizedItem.includes(normalizedMeal)
        }
        
        // Check if at least 80% of item words are in the meal
        const matchingWords = itemWords.filter(w => mealWords.includes(w))
        return matchingWords.length >= Math.ceil(itemWords.length * 0.8)
      })
      
      // If it's allowed for this prakriti, it's valid (even if it also appears in other lists)
      if (isAllowed) {
        return // Skip further checks - this meal is valid
      }
      
      // If NOT allowed for this prakriti, check if it's from another prakriti (cross-contamination)
      // Only flag as cross-contamination if it's NOT in current list BUT appears in another list
      const isFromOtherPrakriti = Array.from(otherPrakritiMeals).some(otherMeal => {
        const normalizedOther = otherMeal.toLowerCase().trim()
        // Check if the meal text contains a significant portion of the other prakriti's meal
        // Use a more strict check: the meal should match at least 70% of the other meal's words
        const otherWords = normalizedOther.split(/\s+/).filter(w => w.length > 2)
        const mealWords = normalizedMeal.split(/\s+/).filter(w => w.length > 2)
        const matchingWords = otherWords.filter(w => mealWords.includes(w))
        return matchingWords.length >= Math.ceil(otherWords.length * 0.7)
      })
      
      if (isFromOtherPrakriti) {
        crossContamination.push(`Day ${index + 1} ${slot}: ${text} (appears to be from another prakriti)`)
      } else {
        // Not in current list and not in other lists - just invalid
        invalidItems.push(`Day ${index + 1} ${slot}: ${text}`)
      }
    })
  })
  
  return {
    valid: invalidItems.length === 0 && crossContamination.length === 0,
    invalidItems,
    crossContamination
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

