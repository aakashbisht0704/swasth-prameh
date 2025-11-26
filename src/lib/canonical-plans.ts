// Canonical meal plans - exported as TypeScript for better type safety and Next.js compatibility

export interface CanonicalMealDay {
  day: string
  breakfast: string
  '12pm': string
  lunch: string
  '6pm': string
  dinner: string
}

export interface CanonicalPlans {
  kaphaj: CanonicalMealDay[]
  pittaj: CanonicalMealDay[]
  vataja: CanonicalMealDay[]
}

export const samplePlans: CanonicalPlans = {
  "kaphaj": [
    {
      "day": "MONDAY",
      "breakfast": "Moong dal chila with ginger tea",
      "12pm": "Apple",
      "lunch": "2 Barley roti + Ridge gourd curry (tori) + Moong dal soup",
      "6pm": "Pomegranate",
      "dinner": "Bottle gourd soup (lauki) + 2 roti"
    },
    {
      "day": "TUESDAY",
      "breakfast": "Besan chila with coriander chutney",
      "12pm": "Papaya",
      "lunch": "Bajra roti + Bitter gourd sabji (karela) + Masoor dal",
      "6pm": "Amla juice",
      "dinner": "Ridge gourd curry + Moong dal + 2 rotis"
    },
    {
      "day": "WEDNESDAY",
      "breakfast": "Light poha with peas",
      "12pm": "Orange",
      "lunch": "Old red rice + Lauki sabji + Masoor dal",
      "6pm": "Jamun (if in season)",
      "dinner": "Ash gourd + 2 rotis"
    },
    {
      "day": "THURSDAY",
      "breakfast": "Oats chilla",
      "12pm": "Guava",
      "lunch": "Jowar roti + Ivy gourd curry + Sprouted lentil salad",
      "6pm": "Ginger-cinnamon tea",
      "dinner": "Moong dal + 2 rotis"
    },
    {
      "day": "FRIDAY",
      "breakfast": "Ragi upma + Coriander chutney",
      "12pm": "Guava",
      "lunch": "Barley rotis + Ash gourd curry + Toor dal",
      "6pm": "Warm gudmar tea",
      "dinner": "Black gram dal + Ragi rotis"
    },
    {
      "day": "SATURDAY",
      "breakfast": "Moong dal dosa + Methi chutney",
      "12pm": "Apple",
      "lunch": "Rajma + Old red rice",
      "6pm": "Ginger cinnamon tea",
      "dinner": "Tindora sabji + Roti"
    },
    {
      "day": "SUNDAY",
      "breakfast": "Daliya / Scrambled eggs with black pepper",
      "12pm": "Sweet lime",
      "lunch": "Jowar roti + Bottle gourd curry + Masoor dal",
      "6pm": "Nuts (almonds, walnuts)",
      "dinner": "Spinach curry + Roti"
    }
  ],
  "pittaj": [
    {
      "day": "MONDAY",
      "breakfast": "Poha with coriander",
      "12pm": "Papaya",
      "lunch": "Brown rice + Moong dal",
      "6pm": "Coconut water",
      "dinner": "Ridge gourd (tori) sabji + 2 rotis"
    },
    {
      "day": "TUESDAY",
      "breakfast": "Masala oats",
      "12pm": "Grapes",
      "lunch": "Brown rice + Chana dal",
      "6pm": "Sweet lime juice",
      "dinner": "Ivy gourd curry + Rotis"
    },
    {
      "day": "WEDNESDAY",
      "breakfast": "Ragi prantha with ghee",
      "12pm": "Guava",
      "lunch": "Red rice + Masoor dal",
      "6pm": "Fennel seed tea",
      "dinner": "Barley khichdi"
    },
    {
      "day": "THURSDAY",
      "breakfast": "Lauki prantha",
      "12pm": "Watermelon",
      "lunch": "Rotis + Toor dal + Ash gourd curry",
      "6pm": "Coconut water",
      "dinner": "Moong dal + Snake gourd sabji + Rotis"
    },
    {
      "day": "FRIDAY",
      "breakfast": "Poha with chutney",
      "12pm": "Pomegranate",
      "lunch": "Ragi chapati + Ridge gourd curry + Horse gram soup",
      "6pm": "Amla juice",
      "dinner": "Barley khichdi + Pumpkin curry"
    },
    {
      "day": "SATURDAY",
      "breakfast": "Oats chilla with coriander chutney",
      "12pm": "Apple",
      "lunch": "Brown rice + Ivy gourd sabji + Moong dal",
      "6pm": "Coconut water",
      "dinner": "Bottle gourd curry + Chapatis"
    },
    {
      "day": "SUNDAY",
      "breakfast": "Ragi daliya with raisins",
      "12pm": "Sweet lime slices",
      "lunch": "Red rice + Spinach curry + Chana dal",
      "6pm": "",
      "dinner": "Moong dal + Ash gourd curry + Chapatis"
    }
  ],
  "vataja": [
    {
      "day": "MONDAY",
      "breakfast": "Warm daliya with ghee",
      "12pm": "Apple",
      "lunch": "Wheat chapati + Bottle gourd curry + Moong dal",
      "6pm": "Warm milk with nutmeg",
      "dinner": "Rice + Ridge gourd curry + Ghee"
    },
    {
      "day": "TUESDAY",
      "breakfast": "Poha with cumin",
      "12pm": "Dates",
      "lunch": "Brown rice + Pumpkin curry + Masoor dal",
      "6pm": "Warm ginger tea",
      "dinner": "Chapati + Spinach sabji"
    },
    {
      "day": "WEDNESDAY",
      "breakfast": "Ragi chilla",
      "12pm": "Pomegranate",
      "lunch": "Jowar roti + Lauki curry + Chana dal",
      "6pm": "Turmeric milk",
      "dinner": "Moong dal khichdi with ghee"
    },
    {
      "day": "THURSDAY",
      "breakfast": "Oats chilla",
      "12pm": "Guava",
      "lunch": "Wheat roti + Urad dal (soft)",
      "6pm": "Herbal tea",
      "dinner": "Rice + Ash gourd curry"
    },
    {
      "day": "FRIDAY",
      "breakfast": "Daliya with ghee",
      "12pm": "Black grapes (soaked)",
      "lunch": "Makai roti + Toor dal",
      "6pm": "Warm milk",
      "dinner": "Spinach curry with chapati"
    },
    {
      "day": "SATURDAY",
      "breakfast": "Poha with cumin",
      "12pm": "Jamun",
      "lunch": "Bajra roti + Ivy gourd curry",
      "6pm": "Fox nuts",
      "dinner": "Bottle gourd curry + Chapati"
    },
    {
      "day": "SUNDAY",
      "breakfast": "Ragi upma with ghee",
      "12pm": "Apple",
      "lunch": "Wheat chapati + Lauki leaves curry + Soft dal",
      "6pm": "Ginger tea",
      "dinner": "Foxtail millets + Spinach curry"
    }
  ]
}

