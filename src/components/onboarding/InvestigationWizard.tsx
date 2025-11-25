'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ClinicalDetailsStep } from './Investigation/ClinicalDetailsStep'
import { MedicalHistoryStep } from './Investigation/MedicalHistoryStep'
import { DietaryHabitsStep } from './Investigation/DietaryHabitsStep'
import { ReviewSubmitStep } from './Investigation/ReviewSubmitStep'
import type { StepProps } from './OnboardingStepper'

export interface InvestigationData {
  clinical: {
    hba1c?: number | null
    hba1c_date?: string | null
    fbs?: number | null
    ppbs?: number | null
    diabetes_type?: 'Type 1' | 'Type 2' | 'Not diagnosed' | null
  }
  medical_history: {
    duration_years?: number | null
    current_medication?: 'Oral tablets' | 'Insulin' | 'Both' | 'None' | null
    recent_fluctuations?: boolean | null
  }
  dietary_habits: {
    meals_per_day?: '2' | '3' | '4' | 'More' | null
    fixed_timing?: 'Yes' | 'No' | null
    skip_meals?: 'Never' | 'Sometimes' | 'Often' | null
    breakfast_type?: string | null
    lunch_type?: string | null
    dinner_type?: string | null
    snack_preference?: 'Fruits' | 'Namkeen' | 'Biscuits' | 'Fast food' | 'Sweets' | null
    sweets_frequency?: 'Rarely' | 'Sometimes' | 'Daily' | null
    sugary_drinks?: 'Never' | 'Occasionally' | 'Frequently' | null
    refined_food_frequency?: 'Rarely' | 'Weekly' | 'Daily' | null
    cooking_oil?: 'Mustard oil' | 'Groundnut oil' | 'Sunflower oil' | 'Olive oil' | 'Ghee' | null
    deep_fried_frequency?: 'Rarely' | 'Weekly' | 'Often' | null
    taste_preference?: 'Very salty' | 'Very sweet' | 'Very spicy' | 'Mild' | null
    extra_salt?: 'Yes' | 'No' | null
    water_intake?: '<1L' | '1–2L' | '2–3L' | '>3L' | null
    tea_coffee?: 'None' | '1 cup/day' | '2–3 cups/day' | '>3 cups/day' | null
    drink_during_meals?: 'Yes' | 'No' | null
    speed_of_eating?: 'Slow' | 'Average' | 'Fast' | null
    multitask_eating?: 'Always' | 'Sometimes' | 'Never' | null
    appetite_level?: 'Low' | 'Moderate' | 'Strong' | null
    dinner_time?: 'Before 7 PM' | '7–9 PM' | 'After 9 PM' | null
    lie_down_after_meals?: 'Yes' | 'No' | null
    digestive_symptoms?: 'Never' | 'Sometimes' | 'Often' | null
    skin_boils_present?: 'Yes' | 'No' | null
    skin_boils_recurrent?: 'Yes' | 'No' | null
    skin_boils_heal_slowly?: 'Yes' | 'No' | null
    skin_boils_itching?: 'Yes' | 'No' | null
    on_diabetes_medication?: 'Yes' | 'No' | null
    medication_name_and_dose?: string | null
    others?: string | null
  }
  meta?: {
    created_at?: string
    updated_at?: string
  }
}

interface InvestigationWizardProps extends StepProps {
  initialData?: any
}

const INVESTIGATION_STEPS = [
  { id: 'clinical', label: 'Clinical Details' },
  { id: 'medical', label: 'Medical History' },
  { id: 'dietary', label: 'Dietary Habits' },
  { id: 'review', label: 'Review & Submit' },
]

export function InvestigationWizard({ onNext, onBack, initialData }: InvestigationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [investigationData, setInvestigationData] = useState<InvestigationData>(
    initialData?.investigation || {
      clinical: {},
      medical_history: {},
      dietary_habits: {},
    }
  )

  const updateData = (section: keyof InvestigationData, data: any) => {
    setInvestigationData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
      meta: {
        ...prev.meta,
        updated_at: new Date().toISOString(),
      },
    }))
  }

  const handleStepNext = (data: any) => {
    if (currentStep === 0) {
      updateData('clinical', data)
      setCurrentStep(1)
    } else if (currentStep === 1) {
      updateData('medical_history', data)
      setCurrentStep(2)
    } else if (currentStep === 2) {
      updateData('dietary_habits', data)
      setCurrentStep(3)
    }
  }

  const handleStepBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinalSubmit = () => {
    const finalData = {
      ...investigationData,
      meta: {
        created_at: investigationData.meta?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
    onNext({ investigation: finalData })
  }

  const progress = ((currentStep + 1) / INVESTIGATION_STEPS.length) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Investigation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Please provide detailed information about your clinical status, medical history, and dietary habits.
          </p>
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {INVESTIGATION_STEPS.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2">
              {INVESTIGATION_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`text-xs ${
                    index === currentStep
                      ? 'font-semibold text-primary'
                      : index < currentStep
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground/50'
                  }`}
                >
                  {step.label}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="mt-6">
            {currentStep === 0 && (
              <ClinicalDetailsStep
                onNext={handleStepNext}
                onBack={handleStepBack}
                initialData={investigationData.clinical}
              />
            )}
            {currentStep === 1 && (
              <MedicalHistoryStep
                onNext={handleStepNext}
                onBack={handleStepBack}
                initialData={investigationData.medical_history}
              />
            )}
            {currentStep === 2 && (
              <DietaryHabitsStep
                onNext={handleStepNext}
                onBack={handleStepBack}
                initialData={investigationData.dietary_habits}
              />
            )}
            {currentStep === 3 && (
              <ReviewSubmitStep
                onNext={handleFinalSubmit}
                onBack={handleStepBack}
                investigationData={investigationData}
                onEdit={(stepIndex) => setCurrentStep(stepIndex)}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

