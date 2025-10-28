'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { ChatWidget } from '@/components/chat/ChatWidget'
import DashboardAIWidget from '@/components/DashboardAIWidget'
import { DashboardWithFeedback } from '@/components/DashboardWithFeedback'
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton'
import { ErrorFallback } from '@/components/ErrorFallback'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { MealLogging } from '@/components/MealLogging'
import { YogaVideos } from '@/components/YogaVideos'
import { DoshaDistributionChart } from '@/components/dashboard/DoshaDistributionChart'
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
      // Load user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
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
      console.error('Error loading user data:', err)
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
              <div className="bg-muted rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  Welcome back, {userProfile?.full_name || 'User'}!!
                </h1>
                <p className="text-base text-muted-foreground">
                  Monitor your health and track your progress with personalised insights
                </p>
              </div>

              {/* Grid Layout: 2 Rows × 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Left: Prakriti Constitution */}
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                  <h2 className="text-xl font-semibold mb-4 text-primary">Prakriti Constitution</h2>
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

                {/* Top Right: Lifestyle */}
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">Lifestyle</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Diet:</span>
                      <span className="text-foreground font-medium">{onboarding?.diet || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Exercise:</span>
                      <span className="text-foreground font-medium">{onboarding?.exercise || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sleep:</span>
                      <span className="text-foreground font-medium">{onboarding?.sleep || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Left: Ashtvidha Pariksha */}
                <div className="bg-card rounded-xl p-6 shadow-md border border-border">
                  <h2 className="text-xl font-semibold mb-4 text-primary">Ashtvidha Pariksha</h2>
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

                {/* Bottom Right: AI System */}
                <div className="bg-card rounded-xl p-6 shadow-md border border-border flex flex-col">
                  <h2 className="text-xl font-semibold mb-4 text-foreground">AI System</h2>
                  <div className="flex-1 flex items-center justify-center">
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
      
      {user && <ChatWidget userId={user.id} />}
    </div>
  )
}