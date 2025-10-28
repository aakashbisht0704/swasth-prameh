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
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
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
            value === 0 && "text-muted-foreground",
            value > 0 && value < 3 && "text-blue-600 dark:text-blue-400",
            value >= 3 && value < 5 && "text-purple-600 dark:text-purple-400", 
            value >= 5 && "text-green-600 dark:text-green-400"
          )}>
            {intensityLabels[value]}
          </span>
        </div>
      </div>
    </div>
  )
}
