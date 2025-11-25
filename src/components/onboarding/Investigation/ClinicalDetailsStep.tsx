'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ClinicalDetailsStepProps {
  onNext: (data: any) => void
  onBack: () => void
  initialData?: any
}

export function ClinicalDetailsStep({ onNext, onBack, initialData }: ClinicalDetailsStepProps) {
  const [hba1c, setHba1c] = useState<string>(initialData?.hba1c?.toString() || '')
  const [hba1cDate, setHba1cDate] = useState<string>(initialData?.hba1c_date || '')
  const [fbs, setFbs] = useState<string>(initialData?.fbs?.toString() || '')
  const [ppbs, setPpbs] = useState<string>(initialData?.ppbs?.toString() || '')
  const [diabetesType, setDiabetesType] = useState<string>(initialData?.diabetes_type || '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (hba1c) {
      const hba1cValue = parseFloat(hba1c)
      if (isNaN(hba1cValue) || hba1cValue < 3.0 || hba1cValue > 20.0) {
        newErrors.hba1c = 'HbA1c must be between 3.0 and 20.0'
      }
      if (!hba1cDate) {
        newErrors.hba1cDate = 'Please provide the date of HbA1c test'
      } else {
        const testDate = new Date(hba1cDate)
        const today = new Date()
        if (testDate > today) {
          newErrors.hba1cDate = 'Test date cannot be in the future'
        }
      }
    }

    if (fbs) {
      const fbsValue = parseInt(fbs)
      if (isNaN(fbsValue) || fbsValue <= 20 || fbsValue >= 1000) {
        newErrors.fbs = 'FBS must be between 20 and 1000 mg/dL'
      }
    }

    if (ppbs) {
      const ppbsValue = parseInt(ppbs)
      if (isNaN(ppbsValue) || ppbsValue <= 20 || ppbsValue >= 1000) {
        newErrors.ppbs = 'PPBS must be between 20 and 1000 mg/dL'
      }
    }

    // At least one clinical value should be provided
    if (!hba1c && !fbs && !ppbs) {
      newErrors.general = 'Please provide at least one clinical value (HbA1c, FBS, or PPBS)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const data = {
      hba1c: hba1c ? parseFloat(hba1c) : null,
      hba1c_date: hba1cDate || null,
      fbs: fbs ? parseInt(fbs) : null,
      ppbs: ppbs ? parseInt(ppbs) : null,
      diabetes_type: diabetesType || null,
    }

    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinical Details</CardTitle>
          <CardDescription>
            Please provide your latest clinical test results. At least one value is required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* HbA1c */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hba1c">
                HbA1c Value (%) <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="hba1c"
                type="number"
                step="0.1"
                min="3.0"
                max="20.0"
                placeholder="e.g., 7.2"
                value={hba1c}
                onChange={(e) => {
                  setHba1c(e.target.value)
                  if (errors.hba1c) setErrors({ ...errors, hba1c: '' })
                }}
                aria-invalid={!!errors.hba1c}
                aria-describedby={errors.hba1c ? 'hba1c-error' : undefined}
              />
              {errors.hba1c && (
                <p className="text-sm text-destructive" id="hba1c-error">
                  {errors.hba1c}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="hba1c_date">
                Date of Last HbA1c Test <span className="text-muted-foreground">(If HbA1c provided)</span>
              </Label>
              <Input
                id="hba1c_date"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={hba1cDate}
                onChange={(e) => {
                  setHba1cDate(e.target.value)
                  if (errors.hba1cDate) setErrors({ ...errors, hba1cDate: '' })
                }}
                aria-invalid={!!errors.hba1cDate}
                aria-describedby={errors.hba1cDate ? 'hba1c-date-error' : undefined}
              />
              {errors.hba1cDate && (
                <p className="text-sm text-destructive" id="hba1c-date-error">
                  {errors.hba1cDate}
                </p>
              )}
            </div>
          </div>

          {/* FBS and PPBS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fbs">
                Fasting Blood Sugar (FBS) mg/dL <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="fbs"
                type="number"
                min="20"
                max="1000"
                placeholder="e.g., 110"
                value={fbs}
                onChange={(e) => {
                  setFbs(e.target.value)
                  if (errors.fbs) setErrors({ ...errors, fbs: '' })
                }}
                aria-invalid={!!errors.fbs}
                aria-describedby={errors.fbs ? 'fbs-error' : undefined}
              />
              {errors.fbs && (
                <p className="text-sm text-destructive" id="fbs-error">
                  {errors.fbs}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ppbs">
                Post-Prandial Blood Sugar (PPBS) mg/dL <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <Input
                id="ppbs"
                type="number"
                min="20"
                max="1000"
                placeholder="e.g., 165"
                value={ppbs}
                onChange={(e) => {
                  setPpbs(e.target.value)
                  if (errors.ppbs) setErrors({ ...errors, ppbs: '' })
                }}
                aria-invalid={!!errors.ppbs}
                aria-describedby={errors.ppbs ? 'ppbs-error' : undefined}
              />
              {errors.ppbs && (
                <p className="text-sm text-destructive" id="ppbs-error">
                  {errors.ppbs}
                </p>
              )}
            </div>
          </div>

          {/* Diabetes Type */}
          <div className="space-y-2">
            <Label htmlFor="diabetes_type">Type of Diabetes (if diagnosed)</Label>
            <RadioGroup
              value={diabetesType}
              onValueChange={setDiabetesType}
              id="diabetes_type"
              aria-label="Type of Diabetes"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Type 1" id="type1" />
                <Label htmlFor="type1" className="font-normal cursor-pointer">
                  Type 1
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Type 2" id="type2" />
                <Label htmlFor="type2" className="font-normal cursor-pointer">
                  Type 2
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Not diagnosed" id="not_diagnosed" />
                <Label htmlFor="not_diagnosed" className="font-normal cursor-pointer">
                  Not diagnosed
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

