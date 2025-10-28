// Ayurvedic diet plans for different dosha types
// Based on traditional Ayurvedic principles for diabetes management

export interface DietPlanDay {
  day: string
  breakfast: string
  midMorning: string
  lunch: string
  evening: string
  dinner: string
}

export interface DietPlan {
  doshaType: 'Kaphaj' | 'Pittaj' | 'Vataja' | 'Balanced'
  days: DietPlanDay[]
}

export const KAPHAJ_DIET_PLAN: DietPlan = {
  doshaType: 'Kaphaj',
  days: [
    {
      day: 'Monday',
      breakfast: 'Moong dal chila with ginger tea',
      midMorning: 'Apple',
      lunch: '2 Barley roti + Ridge gourd curry (tori) + Moong dal soup',
      evening: 'Pomegranate',
      dinner: 'Bottle gourd soup (lauki) + 2 roti'
    },
    {
      day: 'Tuesday',
      breakfast: 'Besan chila with coriander chutney',
      midMorning: 'Papaya',
      lunch: 'Bajra roti + Bitter gourd sabji (karela) + Masoor dal',
      evening: 'Amla juice',
      dinner: 'Ridge gourd curry + Moong dal + 2 rotis'
    },
    {
      day: 'Wednesday',
      breakfast: 'Light poha with peas',
      midMorning: 'Orange',
      lunch: 'Old red rice + Lauki sabji + Masoor dal',
      evening: 'Jamun (if in season)',
      dinner: 'Ash gourd + 2 rotis'
    },
    {
      day: 'Thursday',
      breakfast: 'Oats chilla',
      midMorning: 'Guava',
      lunch: 'Jowar roti + Ivy gourd curry + Sprouted lentil salad',
      evening: 'Ginger-cinnamon tea',
      dinner: 'Moong dal + 2 rotis'
    },
    {
      day: 'Friday',
      breakfast: 'Ragi upma + Coriander chutney',
      midMorning: 'Guava',
      lunch: 'Barley rotis + Ash gourd curry + Toor dal',
      evening: 'Warm gudmar tea',
      dinner: 'Black gram dal + Ragi rotis'
    },
    {
      day: 'Saturday',
      breakfast: 'Moong dal dosa + Methi chutney',
      midMorning: 'Apple',
      lunch: 'Rajma + Old red rice',
      evening: 'Ginger cinnamon tea',
      dinner: 'Tindora sabji + Roti'
    },
    {
      day: 'Sunday',
      breakfast: 'Daliya / Scrambled eggs with black pepper',
      midMorning: 'Sweet lime',
      lunch: 'Jowar roti + Bottle gourd curry + Masoor dal',
      evening: 'Nuts (almonds, walnuts)',
      dinner: 'Spinach curry + Roti'
    }
  ]
}

export const PITTAJ_DIET_PLAN: DietPlan = {
  doshaType: 'Pittaj',
  days: [
    {
      day: 'Monday',
      breakfast: 'Poha with coriander',
      midMorning: 'Papaya',
      lunch: 'Brown rice + Moong dal',
      evening: 'Coconut water',
      dinner: 'Ridge gourd (tori) sabji + 2 rotis'
    },
    {
      day: 'Tuesday',
      breakfast: 'Masala oats',
      midMorning: 'Grapes',
      lunch: 'Brown rice + Chana dal',
      evening: 'Sweet lime juice',
      dinner: 'Ivy gourd curry + Rotis'
    },
    {
      day: 'Wednesday',
      breakfast: 'Ragi prantha with ghee',
      midMorning: 'Guava',
      lunch: 'Red rice + Masoor dal',
      evening: 'Fennel seed tea',
      dinner: 'Barley khichdi'
    },
    {
      day: 'Thursday',
      breakfast: 'Lauki prantha',
      midMorning: 'Watermelon',
      lunch: 'Rotis + Toor dal + Ash gourd curry',
      evening: 'Coconut water',
      dinner: 'Moong dal + Snake gourd sabji + Rotis'
    },
    {
      day: 'Friday',
      breakfast: 'Poha with chutney',
      midMorning: 'Pomegranate',
      lunch: 'Ragi chapati + Ridge gourd curry + Horse gram soup',
      evening: 'Amla juice',
      dinner: 'Barley khichdi + Pumpkin curry'
    },
    {
      day: 'Saturday',
      breakfast: 'Oats chilla with coriander chutney',
      midMorning: 'Apple',
      lunch: 'Brown rice + Ivy gourd sabji + Moong dal',
      evening: 'Coconut water',
      dinner: 'Bottle gourd curry + Chapatis'
    },
    {
      day: 'Sunday',
      breakfast: 'Ragi daliya with raisins',
      midMorning: 'Sweet lime slices',
      lunch: 'Red rice + Spinach curry + Chana dal',
      evening: '',
      dinner: 'Moong dal + Ash gourd curry + Chapatis'
    }
  ]
}

export const VATAAJA_DIET_PLAN: DietPlan = {
  doshaType: 'Vataja',
  days: [
    {
      day: 'Monday',
      breakfast: 'Warm daliya with ghee',
      midMorning: 'Apple',
      lunch: 'Wheat chapati + Bottle gourd curry + Moong dal',
      evening: 'Warm milk with nutmeg',
      dinner: 'Rice + Ridge gourd curry + Ghee'
    },
    {
      day: 'Tuesday',
      breakfast: 'Poha with cumin',
      midMorning: 'Dates',
      lunch: 'Brown rice + Pumpkin curry + Masoor dal',
      evening: 'Warm ginger tea',
      dinner: 'Chapati + Spinach sabji'
    },
    {
      day: 'Wednesday',
      breakfast: 'Ragi chilla',
      midMorning: 'Pomegranate',
      lunch: 'Jowar roti + Lauki curry + Chana dal',
      evening: 'Turmeric milk',
      dinner: 'Moong dal khichdi with ghee'
    },
    {
      day: 'Thursday',
      breakfast: 'Oats chilla',
      midMorning: 'Guava',
      lunch: 'Wheat roti + Urad dal (soft)',
      evening: 'Herbal tea',
      dinner: 'Rice + Ash gourd curry'
    },
    {
      day: 'Friday',
      breakfast: 'Daliya with ghee',
      midMorning: 'Black grapes (soaked)',
      lunch: 'Makai roti + Toor dal',
      evening: 'Warm milk',
      dinner: 'Spinach curry with chapati'
    },
    {
      day: 'Saturday',
      breakfast: 'Poha with cumin',
      midMorning: 'Jamun',
      lunch: 'Bajra roti + Ivy gourd curry',
      evening: 'Fox nuts',
      dinner: 'Bottle gourd curry + Chapati'
    },
    {
      day: 'Sunday',
      breakfast: 'Ragi upma with ghee',
      midMorning: 'Apple',
      lunch: 'Wheat chapati + Lauki leaves curry + Soft dal',
      evening: 'Ginger tea',
      dinner: 'Foxtail millets + Spinach curry'
    }
  ]
}

// Get diet plan based on dosha type
export function getDietPlan(doshaType: string): DietPlan | null {
  const normalizedDosha = doshaType.toLowerCase()
  
  if (normalizedDosha.includes('kapha') || normalizedDosha.includes('kaphaj')) {
    return KAPHAJ_DIET_PLAN
  } else if (normalizedDosha.includes('pitta') || normalizedDosha.includes('pittaj')) {
    return PITTAJ_DIET_PLAN
  } else if (normalizedDosha.includes('vata') || normalizedDosha.includes('vataja') || normalizedDosha.includes('vataaja')) {
    return VATAAJA_DIET_PLAN
  }
  
  return null
}

// Export all plans
export const ALL_DIET_PLANS = [KAPHAJ_DIET_PLAN, PITTAJ_DIET_PLAN, VATAAJA_DIET_PLAN]

