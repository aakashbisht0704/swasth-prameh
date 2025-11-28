'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import DashboardAIWidget from '@/components/DashboardAIWidget'
import { DashboardWithFeedback } from '@/components/DashboardWithFeedback'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import { ErrorFallback } from '@/components/ErrorFallback'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { MealLogging } from '@/components/MealLogging'
import { YogaVideos } from '@/components/YogaVideos'
import { DoshaDistributionChart } from '@/components/dashboard/DoshaDistributionChart'
import { LifestyleAdvice } from '@/components/dashboard/LifestyleAdvice'
import { ActivityStreak } from '@/components/dashboard/ActivityStreak'
import { YogaMinutes } from '@/components/dashboard/YogaMinutes'
import { trackActivity } from '@/lib/activity-tracking'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [onboarding, setOnboarding] = useState<any>(null)
  const [latestPlan, setLatestPlan] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          window.location.href = '/auth'
          return
        }
        setUser(user)
        
        // Track dashboard view
        await trackActivity(user.id, 'dashboard_view')
        
        // Load user data
        await loadUserData(user.id)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    getUser()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      // Load user profile (user_profiles.id = auth.users.id)
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setUserProfile(profile)

      // Load onboarding data
      const { data: onboardingData } = await supabase
        .from('onboarding')
        .select('*')
        .eq('user_id', userId)
        .single()
      setOnboarding(onboardingData)

      // Load latest plan
      const { data: planData } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      setLatestPlan(planData)
    } catch (err) {
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <ErrorFallback error={error} resetError={() => setError(null)} />
  }

  if (!user) {
    return null
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardWithFeedback userId={user.id}>
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-2xl p-6 md:p-8 shadow-sm border border-primary/20">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      Welcome back, {userProfile?.full_name || 'User'}!
                    </h1>
                    <p className="text-base text-muted-foreground">
                      Monitor your health and track your progress with personalised insights
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Row - Activity Streak & Yoga Minutes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityStreak userId={user.id} />
                <YogaMinutes userId={user.id} />
              </div>

              {/* Main Content Grid - Redesigned */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Prakriti Constitution - Full Width on Mobile, 2 columns on Desktop */}
                <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-md border border-border">
                  <h2 className="text-lg font-semibold mb-4 text-primary">Prakriti Constitution</h2>
                  {onboarding?.prakriti_totals ? (
                    <>
                      {/* Progress bars */}
                      <div className="space-y-3 mb-6">
                        {Object.entries(onboarding.prakriti_totals).map(([dosha, score]) => {
                          const doshaScore = score as number
                          return (
                            <div key={dosha} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-foreground font-medium capitalize">{dosha.replace('_total', '')}</span>
                                <span className="text-muted-foreground">{doshaScore}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all" 
                                  style={{ width: `${doshaScore}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      
                      {/* Pie Chart */}
                      <DoshaDistributionChart 
                        data={Object.entries(onboarding.prakriti_totals).map(([dosha, score]) => ({
                          name: dosha.replace('_total', ''),
                          value: score as number
                        }))}
                      />
                      
                      {onboarding?.prakriti_summary?.dominant && (
                        <div className="text-center mt-4">
                          <div className="text-sm font-medium text-primary">
                            {onboarding.prakriti_summary.dominant} Constitution
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Complete your Prakriti assessment to see your constitution.
                    </p>
                  )}
                </div>

                {/* Lifestyle */}
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">Lifestyle</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diet:</span>
                      <span className="text-foreground font-medium">
                        {onboarding?.lifestyle?.diet_type 
                          ? onboarding.lifestyle.diet_type.charAt(0).toUpperCase() + onboarding.lifestyle.diet_type.slice(1)
                          : onboarding?.investigation?.dietary_habits?.meals_per_day
                          ? `${onboarding.investigation.dietary_habits.meals_per_day} meals/day`
                          : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exercise:</span>
                      <span className="text-foreground font-medium">
                        {onboarding?.lifestyle?.exercise_regularly 
                          ? onboarding.lifestyle.exercise_regularly === 'Yes' ? 'Regular' : 'Irregular'
                          : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sleep:</span>
                      <span className="text-foreground font-medium">
                        {onboarding?.lifestyle?.sleep_hours 
                          ? `${onboarding.lifestyle.sleep_hours} hours`
                          : 'Not specified'}
                      </span>
                    </div>
                    {onboarding?.investigation?.dietary_habits?.water_intake && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Water Intake:</span>
                        <span className="text-foreground font-medium">
                          {onboarding.investigation.dietary_habits.water_intake}
                        </span>
                      </div>
                    )}
                    {onboarding?.investigation?.dietary_habits?.cooking_oil && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cooking Oil:</span>
                        <span className="text-foreground font-medium">
                          {onboarding.investigation.dietary_habits.cooking_oil}
                        </span>
                      </div>
                    )}
                  </div>
                  <LifestyleAdvice 
                    lifestyle={onboarding?.lifestyle} 
                    investigation={onboarding?.investigation}
                  />
                </div>

                {/* Ashtvidha Pariksha */}
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                  <h2 className="text-lg font-semibold mb-4 text-primary">Ashtvidha Pariksha</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nadi:</span>
                      <span className="text-foreground font-medium">{onboarding?.nadi || 'Not assessed'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mutra:</span>
                      <span className="text-foreground font-medium">{onboarding?.mutra || 'Normal'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mala:</span>
                      <span className="text-foreground font-medium">{onboarding?.mala || 'Normal'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jiwha:</span>
                      <span className="text-foreground font-medium">{onboarding?.jihwa || 'Clean'}</span>
                    </div>
                  </div>
                </div>

                {/* AI System */}
                <div className="lg:col-span-2 bg-card rounded-xl p-6 shadow-md border border-border">
                  <h2 className="text-lg font-semibold mb-4 text-foreground">AI Recommendations</h2>
                  <div className="flex items-center justify-center">
                    <DashboardAIWidget userId={user.id} context={onboarding} />
                  </div>
                </div>
              </div>
            </div>
          </DashboardWithFeedback>
        )
      case 'meals':
        return <MealLogging userId={user.id} />
      case 'yoga':
        return <YogaVideos userId={user.id} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="flex h-screen">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="py-4 md:py-8 px-4 md:px-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
      
    </div>
  )
}