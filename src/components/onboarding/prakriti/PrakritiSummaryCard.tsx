'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface PrakritiTotals {
  vata_total: number
  pitta_total: number
  kapha_total: number
}

interface PrakritiSummary {
  dominant: string
  mixed?: string[]
  explanation: string
}

interface PrakritiSummaryCardProps {
  totals: PrakritiTotals
  summary: PrakritiSummary
  className?: string
}

export function PrakritiSummaryCard({ totals, summary, className }: PrakritiSummaryCardProps) {
  const { vata_total, pitta_total, kapha_total } = totals
  const maxScore = Math.max(vata_total, pitta_total, kapha_total)
  
  const doshaData = [
    { name: 'Vata', total: vata_total, color: 'bg-blue-500', textColor: 'text-blue-700 dark:text-blue-300' },
    { name: 'Pitta', total: pitta_total, color: 'bg-red-500', textColor: 'text-red-700 dark:text-red-300' },
    { name: 'Kapha', total: kapha_total, color: 'bg-green-500', textColor: 'text-green-700 dark:text-green-300' }
  ]

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Your Prakriti Analysis
          <Badge variant="outline" className="text-sm">
            {summary.dominant}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dosha Scores */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Dosha Scores</h4>
          {doshaData.map((dosha) => {
            const percentage = maxScore > 0 ? (dosha.total / maxScore) * 100 : 0
            return (
              <div key={dosha.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={cn("font-medium", dosha.textColor)}>{dosha.name}</span>
                  <span className="text-sm text-muted-foreground">{dosha.total} points</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Analysis</h4>
          <p className="text-sm leading-relaxed">{summary.explanation}</p>
          
          {summary.mixed && summary.mixed.length > 0 && (
            <div className="flex gap-2 mt-3">
              <span className="text-xs text-muted-foreground">Mixed traits:</span>
              {summary.mixed.map((dosha) => (
                <Badge key={dosha} variant="secondary" className="text-xs">
                  {dosha}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Interpretation */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">What this means:</h4>
          <p className="text-sm text-muted-foreground">
            Your dominant dosha influences your physical constitution, mental tendencies, and health patterns. 
            This analysis helps personalize your Ayurvedic care recommendations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
