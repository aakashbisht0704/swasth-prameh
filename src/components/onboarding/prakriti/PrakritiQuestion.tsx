'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface PrakritiQuestionProps {
  id: string
  label: string
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function PrakritiQuestion({ id, label, value, onChange, disabled = false }: PrakritiQuestionProps) {
  const intensityLabels = [
    'Not at all',
    'Slightly',
    'Somewhat',
    'Moderately',
    'Quite a bit',
    'Very much',
    'Completely'
  ]

  // Ensure value is always a number (0-6)
  const sliderValue = typeof value === 'number' ? value : 0

  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-sm font-medium leading-relaxed">
        {label}
      </Label>
      
      <div className="space-y-2">
        <Slider
          id={id}
          min={0}
          max={6}
          step={1}
          value={[sliderValue]}
          onValueChange={(values) => {
            // Always call onChange, even if value is 0
            const newValue = values[0]
            onChange(newValue)
          }}
          disabled={disabled}
          className="w-full"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>6</span>
        </div>
        
        <div className="text-center">
          <span className={cn(
            "text-sm font-medium",
            sliderValue === 0 && "text-muted-foreground",
            sliderValue > 0 && sliderValue < 3 && "text-blue-600 dark:text-blue-400",
            sliderValue >= 3 && sliderValue < 5 && "text-purple-600 dark:text-purple-400", 
            sliderValue >= 5 && "text-green-600 dark:text-green-400"
          )}>
            {intensityLabels[sliderValue]}
          </span>
        </div>
      </div>
    </div>
  )
}
