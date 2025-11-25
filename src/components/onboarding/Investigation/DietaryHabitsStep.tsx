'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DietaryHabitsStepProps {
  onNext: (data: any) => void
  onBack: () => void
  initialData?: any
}

export function DietaryHabitsStep({ onNext, onBack, initialData }: DietaryHabitsStepProps) {
  const [formData, setFormData] = useState({
    meals_per_day: initialData?.meals_per_day || '',
    fixed_timing: initialData?.fixed_timing || '',
    skip_meals: initialData?.skip_meals || '',
    breakfast_type: initialData?.breakfast_type || '',
    lunch_type: initialData?.lunch_type || '',
    dinner_type: initialData?.dinner_type || '',
    snack_preference: initialData?.snack_preference || '',
    sweets_frequency: initialData?.sweets_frequency || '',
    sugary_drinks: initialData?.sugary_drinks || '',
    refined_food_frequency: initialData?.refined_food_frequency || '',
    cooking_oil: initialData?.cooking_oil || '',
    deep_fried_frequency: initialData?.deep_fried_frequency || '',
    taste_preference: initialData?.taste_preference || '',
    extra_salt: initialData?.extra_salt || '',
    water_intake: initialData?.water_intake || '',
    tea_coffee: initialData?.tea_coffee || '',
    drink_during_meals: initialData?.drink_during_meals || '',
    speed_of_eating: initialData?.speed_of_eating || '',
    multitask_eating: initialData?.multitask_eating || '',
    appetite_level: initialData?.appetite_level || '',
    dinner_time: initialData?.dinner_time || '',
    lie_down_after_meals: initialData?.lie_down_after_meals || '',
    digestive_symptoms: initialData?.digestive_symptoms || '',
    skin_boils_present: initialData?.skin_boils_present || '',
    skin_boils_recurrent: initialData?.skin_boils_recurrent || '',
    skin_boils_heal_slowly: initialData?.skin_boils_heal_slowly || '',
    skin_boils_itching: initialData?.skin_boils_itching || '',
    on_diabetes_medication: initialData?.on_diabetes_medication || '',
    medication_name_and_dose: initialData?.medication_name_and_dose || '',
    others: initialData?.others || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.meals_per_day) {
      newErrors.meals_per_day = 'Please select number of meals per day'
    }
    if (!formData.water_intake) {
      newErrors.water_intake = 'Please select water intake'
    }
    if (!formData.cooking_oil) {
      newErrors.cooking_oil = 'Please select preferred cooking oil'
    }
    if (!formData.on_diabetes_medication) {
      newErrors.on_diabetes_medication = 'Please indicate if you are on diabetes medication'
    }

    // If on medication, medication name and dose is required
    if (formData.on_diabetes_medication === 'Yes' && !formData.medication_name_and_dose?.trim()) {
      newErrors.medication_name_and_dose = 'Please provide medication name and dose'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const data = {
      ...formData,
      medication_name_and_dose: formData.medication_name_and_dose?.trim() || null,
      others: formData.others?.trim() || null,
    }

    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dietary Habits</CardTitle>
          <CardDescription>
            Please provide detailed information about your dietary patterns and eating habits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Daily Meal Pattern */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Daily Meal Pattern</h3>
            
            <div className="space-y-2">
              <Label htmlFor="meals_per_day">
                How many meals do you eat per day? <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.meals_per_day}
                onValueChange={(value) => updateField('meals_per_day', value)}
                id="meals_per_day"
                aria-label="Meals per day"
                aria-required="true"
                aria-invalid={!!errors.meals_per_day}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="meals_2" />
                  <Label htmlFor="meals_2" className="font-normal cursor-pointer">2</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="meals_3" />
                  <Label htmlFor="meals_3" className="font-normal cursor-pointer">3</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="meals_4" />
                  <Label htmlFor="meals_4" className="font-normal cursor-pointer">4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="More" id="meals_more" />
                  <Label htmlFor="meals_more" className="font-normal cursor-pointer">More</Label>
                </div>
              </RadioGroup>
              {errors.meals_per_day && (
                <p className="text-sm text-destructive">{errors.meals_per_day}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fixed_timing">Do you follow a fixed meal timing?</Label>
              <RadioGroup
                value={formData.fixed_timing}
                onValueChange={(value) => updateField('fixed_timing', value)}
                id="fixed_timing"
                aria-label="Fixed meal timing"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="timing_yes" />
                  <Label htmlFor="timing_yes" className="font-normal cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="timing_no" />
                  <Label htmlFor="timing_no" className="font-normal cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skip_meals">Do you skip meals frequently?</Label>
              <Select value={formData.skip_meals} onValueChange={(value) => updateField('skip_meals', value)}>
                <SelectTrigger id="skip_meals" aria-label="Skip meals frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Sometimes">Sometimes</SelectItem>
                  <SelectItem value="Often">Often</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Food Composition */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Food Composition & Choices</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="breakfast_type">What does your typical breakfast include?</Label>
                <Input
                  id="breakfast_type"
                  placeholder="e.g., Light, traditional"
                  value={formData.breakfast_type}
                  onChange={(e) => updateField('breakfast_type', e.target.value)}
                  aria-label="Typical breakfast"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lunch_type">What do you eat for lunch generally?</Label>
                <Input
                  id="lunch_type"
                  placeholder="e.g., Home-cooked"
                  value={formData.lunch_type}
                  onChange={(e) => updateField('lunch_type', e.target.value)}
                  aria-label="Typical lunch"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dinner_type">What does your dinner usually look like?</Label>
                <Input
                  id="dinner_type"
                  placeholder="e.g., Light"
                  value={formData.dinner_type}
                  onChange={(e) => updateField('dinner_type', e.target.value)}
                  aria-label="Typical dinner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="snack_preference">Snacks preference:</Label>
              <RadioGroup
                value={formData.snack_preference}
                onValueChange={(value) => updateField('snack_preference', value)}
                id="snack_preference"
                aria-label="Snack preference"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Fruits" id="snack_fruits" />
                  <Label htmlFor="snack_fruits" className="font-normal cursor-pointer">Fruits</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Namkeen" id="snack_namkeen" />
                  <Label htmlFor="snack_namkeen" className="font-normal cursor-pointer">Namkeen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Biscuits" id="snack_biscuits" />
                  <Label htmlFor="snack_biscuits" className="font-normal cursor-pointer">Biscuits</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Fast food" id="snack_fastfood" />
                  <Label htmlFor="snack_fastfood" className="font-normal cursor-pointer">Fast food</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Sweets" id="snack_sweets" />
                  <Label htmlFor="snack_sweets" className="font-normal cursor-pointer">Sweets</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Sugar & Carbohydrate Intake */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sugar & Carbohydrate Intake</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sweets_frequency">How often do you consume sweets?</Label>
                <Select
                  value={formData.sweets_frequency}
                  onValueChange={(value) => updateField('sweets_frequency', value)}
                >
                  <SelectTrigger id="sweets_frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rarely">Rarely</SelectItem>
                    <SelectItem value="Sometimes">Sometimes</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugary_drinks">How often do you drink sugary beverages?</Label>
                <Select
                  value={formData.sugary_drinks}
                  onValueChange={(value) => updateField('sugary_drinks', value)}
                >
                  <SelectTrigger id="sugary_drinks">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never">Never</SelectItem>
                    <SelectItem value="Occasionally">Occasionally</SelectItem>
                    <SelectItem value="Frequently">Frequently</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="refined_food_frequency">Frequency of refined foods (white rice, maida, bread):</Label>
                <Select
                  value={formData.refined_food_frequency}
                  onValueChange={(value) => updateField('refined_food_frequency', value)}
                >
                  <SelectTrigger id="refined_food_frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rarely">Rarely</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Oil, Ghee & Fat Intake */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Oil, Ghee & Fat Intake</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cooking_oil">
                  Preferred cooking medium <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.cooking_oil}
                  onValueChange={(value) => updateField('cooking_oil', value)}
                  id="cooking_oil"
                  aria-required="true"
                  aria-invalid={!!errors.cooking_oil}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Mustard oil" id="oil_mustard" />
                    <Label htmlFor="oil_mustard" className="font-normal cursor-pointer">Mustard oil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Groundnut oil" id="oil_groundnut" />
                    <Label htmlFor="oil_groundnut" className="font-normal cursor-pointer">Groundnut oil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sunflower oil" id="oil_sunflower" />
                    <Label htmlFor="oil_sunflower" className="font-normal cursor-pointer">Sunflower oil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Olive oil" id="oil_olive" />
                    <Label htmlFor="oil_olive" className="font-normal cursor-pointer">Olive oil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ghee" id="oil_ghee" />
                    <Label htmlFor="oil_ghee" className="font-normal cursor-pointer">Ghee</Label>
                  </div>
                </RadioGroup>
                {errors.cooking_oil && (
                  <p className="text-sm text-destructive">{errors.cooking_oil}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="deep_fried_frequency">Do you consume deep-fried foods?</Label>
                <Select
                  value={formData.deep_fried_frequency}
                  onValueChange={(value) => updateField('deep_fried_frequency', value)}
                >
                  <SelectTrigger id="deep_fried_frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rarely">Rarely</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Often">Often</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Salt & Taste Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Salt & Taste Preferences</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taste_preference">Do you prefer foods that are:</Label>
                <RadioGroup
                  value={formData.taste_preference}
                  onValueChange={(value) => updateField('taste_preference', value)}
                  id="taste_preference"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Very salty" id="taste_salty" />
                    <Label htmlFor="taste_salty" className="font-normal cursor-pointer">Very salty</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Very sweet" id="taste_sweet" />
                    <Label htmlFor="taste_sweet" className="font-normal cursor-pointer">Very sweet</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Very spicy" id="taste_spicy" />
                    <Label htmlFor="taste_spicy" className="font-normal cursor-pointer">Very spicy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Mild" id="taste_mild" />
                    <Label htmlFor="taste_mild" className="font-normal cursor-pointer">Mild</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="extra_salt">Do you add extra salt to food?</Label>
                <RadioGroup
                  value={formData.extra_salt}
                  onValueChange={(value) => updateField('extra_salt', value)}
                  id="extra_salt"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="salt_yes" />
                    <Label htmlFor="salt_yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="salt_no" />
                    <Label htmlFor="salt_no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Water & Beverage Habits */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Water & Beverage Habits</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="water_intake">
                  Average water intake per day <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.water_intake}
                  onValueChange={(value) => updateField('water_intake', value)}
                  id="water_intake"
                  aria-required="true"
                  aria-invalid={!!errors.water_intake}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="<1L" id="water_lt1" />
                    <Label htmlFor="water_lt1" className="font-normal cursor-pointer">&lt;1L</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1–2L" id="water_1to2" />
                    <Label htmlFor="water_1to2" className="font-normal cursor-pointer">1–2L</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2–3L" id="water_2to3" />
                    <Label htmlFor="water_2to3" className="font-normal cursor-pointer">2–3L</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value=">3L" id="water_gt3" />
                    <Label htmlFor="water_gt3" className="font-normal cursor-pointer">&gt;3L</Label>
                  </div>
                </RadioGroup>
                {errors.water_intake && (
                  <p className="text-sm text-destructive">{errors.water_intake}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tea_coffee">Tea/Coffee consumption:</Label>
                <Select
                  value={formData.tea_coffee}
                  onValueChange={(value) => updateField('tea_coffee', value)}
                >
                  <SelectTrigger id="tea_coffee">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="1 cup/day">1 cup/day</SelectItem>
                    <SelectItem value="2–3 cups/day">2–3 cups/day</SelectItem>
                    <SelectItem value=">3 cups/day">&gt;3 cups/day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="drink_during_meals">Do you drink water during meals?</Label>
                <RadioGroup
                  value={formData.drink_during_meals}
                  onValueChange={(value) => updateField('drink_during_meals', value)}
                  id="drink_during_meals"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="drink_yes" />
                    <Label htmlFor="drink_yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="drink_no" />
                    <Label htmlFor="drink_no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Eating Behaviors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Eating Behaviors</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="speed_of_eating">Speed of eating:</Label>
                <Select
                  value={formData.speed_of_eating}
                  onValueChange={(value) => updateField('speed_of_eating', value)}
                >
                  <SelectTrigger id="speed_of_eating">
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slow">Slow</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Fast">Fast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="multitask_eating">Do you eat while multitasking (TV/phone)?</Label>
                <Select
                  value={formData.multitask_eating}
                  onValueChange={(value) => updateField('multitask_eating', value)}
                >
                  <SelectTrigger id="multitask_eating">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Always">Always</SelectItem>
                    <SelectItem value="Sometimes">Sometimes</SelectItem>
                    <SelectItem value="Never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appetite_level">Appetite level:</Label>
                <Select
                  value={formData.appetite_level}
                  onValueChange={(value) => updateField('appetite_level', value)}
                >
                  <SelectTrigger id="appetite_level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Strong">Strong</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Night Routine & Digestion */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Night Routine & Digestion</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dinner_time">How late is your usual dinner time?</Label>
                <Select
                  value={formData.dinner_time}
                  onValueChange={(value) => updateField('dinner_time', value)}
                >
                  <SelectTrigger id="dinner_time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Before 7 PM">Before 7 PM</SelectItem>
                    <SelectItem value="7–9 PM">7–9 PM</SelectItem>
                    <SelectItem value="After 9 PM">After 9 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lie_down_after_meals">Do you lie down immediately after eating?</Label>
                <RadioGroup
                  value={formData.lie_down_after_meals}
                  onValueChange={(value) => updateField('lie_down_after_meals', value)}
                  id="lie_down_after_meals"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="lie_yes" />
                    <Label htmlFor="lie_yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="lie_no" />
                    <Label htmlFor="lie_no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="digestive_symptoms">
                Do you experience bloating, acidity, heaviness after meals?
              </Label>
              <Select
                value={formData.digestive_symptoms}
                onValueChange={(value) => updateField('digestive_symptoms', value)}
              >
                <SelectTrigger id="digestive_symptoms">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Sometimes">Sometimes</SelectItem>
                  <SelectItem value="Often">Often</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Skin Boils */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Skin Health</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skin_boils_present">
                  Do you experience small boils/pustules on thighs, groin, abdomen, or buttocks, neck?
                </Label>
                <RadioGroup
                  value={formData.skin_boils_present}
                  onValueChange={(value) => updateField('skin_boils_present', value)}
                  id="skin_boils_present"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="boils_yes" />
                    <Label htmlFor="boils_yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="boils_no" />
                    <Label htmlFor="boils_no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.skin_boils_present === 'Yes' && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                  <div className="space-y-2">
                    <Label htmlFor="skin_boils_recurrent">Are they recurrent?</Label>
                    <RadioGroup
                      value={formData.skin_boils_recurrent}
                      onValueChange={(value) => updateField('skin_boils_recurrent', value)}
                      id="skin_boils_recurrent"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="recurrent_yes" />
                        <Label htmlFor="recurrent_yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="recurrent_no" />
                        <Label htmlFor="recurrent_no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skin_boils_heal_slowly">Do they heal slowly or leave marks?</Label>
                    <RadioGroup
                      value={formData.skin_boils_heal_slowly}
                      onValueChange={(value) => updateField('skin_boils_heal_slowly', value)}
                      id="skin_boils_heal_slowly"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="heal_yes" />
                        <Label htmlFor="heal_yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="heal_no" />
                        <Label htmlFor="heal_no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skin_boils_itching">Any associated itching or irritation pain?</Label>
                    <RadioGroup
                      value={formData.skin_boils_itching}
                      onValueChange={(value) => updateField('skin_boils_itching', value)}
                      id="skin_boils_itching"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Yes" id="itching_yes" />
                        <Label htmlFor="itching_yes" className="font-normal cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="No" id="itching_no" />
                        <Label htmlFor="itching_no" className="font-normal cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Medication */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Diabetes Medication</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="on_diabetes_medication">
                  Are you currently taking any diabetes medication? <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={formData.on_diabetes_medication}
                  onValueChange={(value) => updateField('on_diabetes_medication', value)}
                  id="on_diabetes_medication"
                  aria-required="true"
                  aria-invalid={!!errors.on_diabetes_medication}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="med_yes" />
                    <Label htmlFor="med_yes" className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="med_no" />
                    <Label htmlFor="med_no" className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
                {errors.on_diabetes_medication && (
                  <p className="text-sm text-destructive">{errors.on_diabetes_medication}</p>
                )}
              </div>

              {formData.on_diabetes_medication === 'Yes' && (
                <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                  <Label htmlFor="medication_name_and_dose">
                    Medication name and dose <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="medication_name_and_dose"
                    placeholder="e.g., Metformin 500 mg twice daily"
                    value={formData.medication_name_and_dose}
                    onChange={(e) => updateField('medication_name_and_dose', e.target.value)}
                    aria-required="true"
                    aria-invalid={!!errors.medication_name_and_dose}
                  />
                  {errors.medication_name_and_dose && (
                    <p className="text-sm text-destructive">{errors.medication_name_and_dose}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Others */}
          <div className="space-y-2">
            <Label htmlFor="others">Others (optional)</Label>
            <Textarea
              id="others"
              placeholder="Any additional information about your dietary habits..."
              value={formData.others}
              onChange={(e) => updateField('others', e.target.value)}
              rows={3}
              aria-label="Additional dietary information"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Continue</Button>
      </div>
    </form>
  )
}

