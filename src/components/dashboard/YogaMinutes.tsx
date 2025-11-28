'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getYogaMinutes } from '@/lib/activity-tracking'
import { Clock, TrendingUp } from 'lucide-react'

interface YogaMinutesProps {
  userId: string
}

export function YogaMinutes({ userId }: YogaMinutesProps) {
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [weeklyMinutes, setWeeklyMinutes] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadYogaMinutes()
  }, [userId])

  const loadYogaMinutes = async () => {
    setLoading(true)
    try {
      const total = await getYogaMinutes(userId, 30)
      const weekly = await getYogaMinutes(userId, 7)
      
      setTotalMinutes(total)
      setWeeklyMinutes(weekly)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="rounded-xl shadow-md border-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl shadow-md border-border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Yoga Practice
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-foreground">{totalMinutes}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Minutes (30 days)</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-primary">{weeklyMinutes}</div>
              <div className="text-sm text-muted-foreground">This Week</div>
            </div>
          </div>
          
          {totalMinutes > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Keep up the great work! Regular yoga practice supports your wellness journey.</span>
              </div>
            </div>
          )}

          {totalMinutes === 0 && (
            <div className="pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground text-center py-2">
                Start watching yoga videos to track your practice time
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

