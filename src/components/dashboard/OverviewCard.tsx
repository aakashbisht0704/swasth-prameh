'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface OverviewCardProps {
  title: string
  children: React.ReactNode
  icon?: string
}

export function OverviewCard({ title, children, icon }: OverviewCardProps) {
  return (
    <Card className="bg-card rounded-xl shadow-md hover:shadow-lg transition-shadow border border-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
        {children}
      </div>
    </Card>
  )
}

interface PrakritiCardProps {
  prakritiSummary?: any
  prakritiTotals?: any
}

export function PrakritiCard({ prakritiSummary, prakritiTotals }: PrakritiCardProps) {
  return (
    <OverviewCard title="Prakriti Constitution" icon="🧘">
      {prakritiSummary ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {prakritiSummary.dominant || 'Not assessed'}
            </div>
            <div className="text-sm text-muted-foreground">Dominant Dosha</div>
          </div>
          {prakritiTotals && (
            <div className="space-y-3">
              {Object.entries(prakritiTotals).map(([dosha, score]) => (
                <div key={dosha} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground capitalize font-medium">{dosha}</span>
                    <span className="text-muted-foreground">{score as number}%</span>
                  </div>
                  <Progress value={score as number} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          Complete your Prakriti assessment to see your constitution.
        </p>
      )}
    </OverviewCard>
  )
}

interface LifestyleCardProps {
  onboarding?: any
}

export function LifestyleCard({ onboarding }: LifestyleCardProps) {
  return (
    <OverviewCard title="Lifestyle" icon="🏃">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Diet:</span>
          <span className="text-foreground font-medium">{onboarding?.diet || 'Not specified'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Exercise:</span>
          <span className="text-foreground font-medium">{onboarding?.exercise || 'Not specified'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Sleep:</span>
          <span className="text-foreground font-medium">{onboarding?.sleep || 'Not specified'}</span>
        </div>
      </div>
    </OverviewCard>
  )
}

interface ParikshaCardProps {
  onboarding?: any
}

export function ParikshaCard({ onboarding }: ParikshaCardProps) {
  return (
    <OverviewCard title="Ashtvidha Pariksha" icon="🔍">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Nadi:</span>
          <span className="text-foreground font-medium">{onboarding?.nadi || 'Not assessed'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Mutra:</span>
          <span className="text-foreground font-medium">{onboarding?.mutra || 'Not assessed'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Mala:</span>
          <span className="text-foreground font-medium">{onboarding?.mala || 'Not assessed'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Jiwha:</span>
          <span className="text-foreground font-medium">{onboarding?.jihwa || 'Not assessed'}</span>
        </div>
      </div>
    </OverviewCard>
  )
}

interface AIRecommendationCardProps {
  userId: string
}

export function AIRecommendationCard({ userId }: AIRecommendationCardProps) {
  return (
    <OverviewCard title="AI System" icon="🤖">
      <div className="py-4">
        <DashboardAIWidget userId={userId} />
      </div>
    </OverviewCard>
  )
}

// Import missing component
import { DashboardAIWidget } from '@/components/DashboardAIWidget'

