'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getActivityStats } from '@/lib/activity-tracking'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Calendar, TrendingUp, Activity } from 'lucide-react'

interface ActivityStreakProps {
  userId: string
}

export function ActivityStreak({ userId }: ActivityStreakProps) {
  const [activityData, setActivityData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalActivities: 0,
    aiClicks: 0,
    planClicks: 0,
    yogaClicks: 0,
    currentStreak: 0,
  })

  useEffect(() => {
    loadActivityData()
  }, [userId])

  const loadActivityData = async () => {
    setLoading(true)
    try {
      const activities = await getActivityStats(userId, 30)
      
      if (!activities) {
        setLoading(false)
        return
      }

      // Process data for chart
      const dailyData: { [key: string]: { date: string; count: number; ai: number; plan: number; yoga: number } } = {}
      
      activities.forEach((activity: any) => {
        const date = new Date(activity.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        
        if (!dailyData[date]) {
          dailyData[date] = { date, count: 0, ai: 0, plan: 0, yoga: 0 }
        }
        
        dailyData[date].count++
        
        if (activity.activity_type === 'ai_recommendations_click') {
          dailyData[date].ai++
        } else if (activity.activity_type === 'generate_plan_click') {
          dailyData[date].plan++
        } else if (activity.activity_type === 'yoga_video_click') {
          dailyData[date].yoga++
        }
      })

      const chartData = Object.values(dailyData).sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })

      setActivityData(chartData)

      // Calculate stats
      const aiClicks = activities.filter((a: any) => a.activity_type === 'ai_recommendations_click').length
      const planClicks = activities.filter((a: any) => a.activity_type === 'generate_plan_click').length
      const yogaClicks = activities.filter((a: any) => a.activity_type === 'yoga_video_click').length

      // Calculate streak (consecutive days with activity)
      let streak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        const dateStr = checkDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        
        if (dailyData[dateStr] && dailyData[dateStr].count > 0) {
          streak++
        } else if (i > 0) {
          break
        }
      }

      setStats({
        totalActivities: activities.length,
        aiClicks,
        planClicks,
        yogaClicks,
        currentStreak: streak,
      })
    } catch (error) {
      console.error('Error loading activity data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="rounded-xl shadow-md border-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl shadow-md border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity Streak
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{stats.currentStreak} day streak</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Total Activities</div>
              <div className="text-2xl font-bold text-foreground">{stats.totalActivities}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">AI Recommendations</div>
              <div className="text-2xl font-bold text-primary">{stats.aiClicks}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Plans Generated</div>
              <div className="text-2xl font-bold text-primary">{stats.planClicks}</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Yoga Videos</div>
              <div className="text-2xl font-bold text-primary">{stats.yogaClicks}</div>
            </div>
          </div>

          {/* Chart */}
          {activityData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No activity data yet</p>
                <p className="text-sm">Start using the dashboard to see your activity streak!</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

