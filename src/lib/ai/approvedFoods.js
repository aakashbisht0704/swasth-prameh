// Approved foods for each dosha type based on Ayurvedic diabetes meal plans

export const APPROVED_KAPHAJ_FOODS = {
  breakfast: [
    'Moong dal chila with ginger tea',
    'Besan chila with coriander chutney',
    'Light poha with peas',
    'Oats chilla',
    'Ragi upma with coriander chutney',
    'Moong dal dosa with methi chutney',
    'Daliya',
    'Scrambled eggs with black pepper'
  ],
  fruits: ['Apple', 'Papaya', 'Orange', 'Guava', 'Pomegranate', 'Sweet lime', 'Jamun'],
  grains: ['Barley roti', 'Bajra roti', 'Jowar roti', 'Ragi rotis', 'Old red rice'],
  vegetables: ['Ridge gourd (tori/turai)', 'Bottle gourd (lauki)', 'Bitter gourd (karela)', 'Lauki', 'Ash gourd', 'Spinach', 'Tindora (ivy gourd)'],
  legumes: ['Moong dal', 'Masoor dal', 'Black gram dal', 'Toor dal', 'Sprouted lentil salad', 'Rajma'],
  drinks: ['Ginger tea', 'Amla juice', 'Gudmar tea', 'Ginger cinnamon tea', 'Nuts (almonds walnuts)']
}

export const APPROVED_PITTAJ_FOODS = {
  breakfast: [
    'Poha with coriander',
    'Masala oats',
    'Ragi prantha with ghee',
    'Lauki prantha',
    'Oats chilla with coriander chutney',
    'Ragi daliya with raisins'
  ],
  fruits: ['Papaya', 'Grapes', 'Guava', 'Watermelon', 'Pomegranate', 'Apple', 'Sweet lime slices'],
  grains: ['Brown rice', 'Red rice', 'Ragi chapati', 'Rotis', 'Chapatis', 'Barley khichdi'],
  vegetables: ['Ridge gourd (tori)', 'Ivy gourd', 'Ash gourd', 'Ashgourd curry', 'Pumpkin', 'Bottle gourd', 'Snake gourd', 'Spinach'],
  legumes: ['Moong dal', 'Chana dal', 'Masoor dal', 'Toor dal', 'Horse gram soup', 'Urad dal'],
  drinks: ['Coconut water', 'Sweet lime juice', 'Amla juice', 'Fennel seed tea'],
  additions: ['Ghee with rotis']
}

export const APPROVED_VATAAJA_FOODS = {
  breakfast: [
    'Warm daliya with ghee',
    'Poha with cumin',
    'Ragi chilla',
    'Oats chilla',
    'Ragi upma with ghee'
  ],
  fruits: ['Apple', 'Dates', 'Pomegranate', 'Guava', 'Black grapes (soaked)', 'Jamun'],
  grains: ['Wheat chapati', 'Brown rice', 'Jowar roti', 'Makai roti', 'Bajra roti', 'Rice', 'Foxtail millets'],
  vegetables: ['Bottle gourd (lauki)', 'Ridge gourd', 'Pumpkin', 'Lauki', 'Lauki curry', 'Lauki leaves curry', 'Ash gourd', 'Spinach', 'Ivy gourd', 'Spinach curry (sabji)'],
  legumes: ['Moong dal', 'Masoor dal', 'Chana dal', 'Urad dal (soft)', 'Toor dal', 'Moong dal khichdi'],
  additions: ['Ghee', 'Warm milk', 'Warm milk with nutmeg', 'Warm ginger tea', 'Turmeric milk', 'Herbal tea', 'Ginger tea', 'Nutmeg', 'Fox nuts (makhana)']
}

export function getAllApprovedFoods(doshaType) {
  const lowerDosha = doshaType.toLowerCase()
  
  if (lowerDosha.includes('kapha') || lowerDosha.includes('kaphaj')) {
    return APPROVED_KAPHAJ_FOODS
  } else if (lowerDosha.includes('pitta') || lowerDosha.includes('pittaj')) {
    return APPROVED_PITTAJ_FOODS
  } else if (lowerDosha.includes('vata') || lowerDosha.includes('vataja') || lowerDosha.includes('vataaja')) {
    return APPROVED_VATAAJA_FOODS
  }
  
  return null
}

