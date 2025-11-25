'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit } from 'lucide-react'
import type { InvestigationData } from '../InvestigationWizard'

interface ReviewSubmitStepProps {
  onNext: () => void
  onBack: () => void
  investigationData: InvestigationData
  onEdit: (stepIndex: number) => void
}

export function ReviewSubmitStep({ onNext, onBack, investigationData, onEdit }: ReviewSubmitStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      onNext()
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return 'Not provided'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review & Submit</CardTitle>
          <CardDescription>
            Please review your information. You can edit any section before submitting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Clinical Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Clinical Details</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEdit(0)}
                className="text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">HbA1c:</span>{' '}
                <span className="font-medium">
                  {investigationData.clinical?.hba1c ? `${investigationData.clinical.hba1c}%` : 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">HbA1c Date:</span>{' '}
                <span className="font-medium">
                  {investigationData.clinical?.hba1c_date
                    ? new Date(investigationData.clinical.hba1c_date).toLocaleDateString()
                    : 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">FBS:</span>{' '}
                <span className="font-medium">
                  {investigationData.clinical?.fbs ? `${investigationData.clinical.fbs} mg/dL` : 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">PPBS:</span>{' '}
                <span className="font-medium">
                  {investigationData.clinical?.ppbs ? `${investigationData.clinical.ppbs} mg/dL` : 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Diabetes Type:</span>{' '}
                <Badge variant="outline">{formatValue(investigationData.clinical?.diabetes_type)}</Badge>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Medical & Diabetes History</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEdit(1)}
                className="text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Duration (years):</span>{' '}
                <span className="font-medium">{formatValue(investigationData.medical_history?.duration_years)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Current Medication:</span>{' '}
                <Badge variant="outline">{formatValue(investigationData.medical_history?.current_medication)}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Recent Fluctuations:</span>{' '}
                <Badge variant="outline">{formatValue(investigationData.medical_history?.recent_fluctuations)}</Badge>
              </div>
            </div>
          </div>

          {/* Dietary Habits Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Dietary Habits</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEdit(2)}
                className="text-xs"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Meals per day:</span>{' '}
                <Badge variant="outline">{formatValue(investigationData.dietary_habits?.meals_per_day)}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Fixed timing:</span>{' '}
                <Badge variant="outline">{formatValue(investigationData.dietary_habits?.fixed_timing)}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Water intake:</span>{' '}
                <Badge variant="outline">{formatValue(investigationData.dietary_habits?.water_intake)}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Cooking oil:</span>{' '}
                <Badge variant="outline">{formatValue(investigationData.dietary_habits?.cooking_oil)}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">On diabetes medication:</span>{' '}
                <Badge variant="outline">{formatValue(investigationData.dietary_habits?.on_diabetes_medication)}</Badge>
              </div>
              {investigationData.dietary_habits?.medication_name_and_dose && (
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Medication:</span>{' '}
                  <span className="font-medium">{investigationData.dietary_habits.medication_name_and_dose}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit & Continue'}
        </Button>
      </div>
    </div>
  )
}

