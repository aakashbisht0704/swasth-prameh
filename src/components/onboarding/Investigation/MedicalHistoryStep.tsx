'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface MedicalHistoryStepProps {
  onNext: (data: any) => void
  onBack: () => void
  initialData?: any
}

export function MedicalHistoryStep({ onNext, onBack, initialData }: MedicalHistoryStepProps) {
  const [durationYears, setDurationYears] = useState<string>(initialData?.duration_years?.toString() || '')
  const [currentMedication, setCurrentMedication] = useState<string>(initialData?.current_medication || '')
  const [recentFluctuations, setRecentFluctuations] = useState<string>(
    initialData?.recent_fluctuations === true ? 'Yes' : initialData?.recent_fluctuations === false ? 'No' : ''
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      duration_years: durationYears ? parseInt(durationYears) : null,
      current_medication: currentMedication || null,
      recent_fluctuations: recentFluctuations === 'Yes' ? true : recentFluctuations === 'No' ? false : null,
    }

    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Medical & Diabetes History</CardTitle>
          <CardDescription>
            Please provide information about your diabetes history and current medication status.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Duration of Diabetes */}
          <div className="space-y-2">
            <Label htmlFor="duration_years">
              Duration of diabetes (years) <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="duration_years"
              type="number"
              min="0"
              max="100"
              placeholder="e.g., 5"
              value={durationYears}
              onChange={(e) => setDurationYears(e.target.value)}
              aria-label="Duration of diabetes in years"
            />
          </div>

          {/* Current Medications */}
          <div className="space-y-2">
            <Label htmlFor="current_medication">Current medications</Label>
            <RadioGroup
              value={currentMedication}
              onValueChange={setCurrentMedication}
              id="current_medication"
              aria-label="Current medications"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Oral tablets" id="oral" />
                <Label htmlFor="oral" className="font-normal cursor-pointer">
                  Oral tablets
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Insulin" id="insulin" />
                <Label htmlFor="insulin" className="font-normal cursor-pointer">
                  Insulin
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Both" id="both" />
                <Label htmlFor="both" className="font-normal cursor-pointer">
                  Both
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="None" id="none" />
                <Label htmlFor="none" className="font-normal cursor-pointer">
                  None
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Recent Fluctuations */}
          <div className="space-y-2">
            <Label htmlFor="recent_fluctuations">Any recent sugar fluctuations?</Label>
            <RadioGroup
              value={recentFluctuations}
              onValueChange={setRecentFluctuations}
              id="recent_fluctuations"
              aria-label="Recent sugar fluctuations"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id="fluctuations_yes" />
                <Label htmlFor="fluctuations_yes" className="font-normal cursor-pointer">
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id="fluctuations_no" />
                <Label htmlFor="fluctuations_no" className="font-normal cursor-pointer">
                  No
                </Label>
              </div>
            </RadioGroup>
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

