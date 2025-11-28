import { supabase } from './supabase'

export type ActivityType = 
  | 'dashboard_view'
  | 'ai_recommendations_click'
  | 'generate_plan_click'
  | 'yoga_video_click'
  | 'yoga_video_watch'

export interface ActivityMetadata {
  video_id?: string
  video_duration?: number // in seconds
  video_title?: string
  [key: string]: any
}

export async function trackActivity(
  userId: string,
  activityType: ActivityType,
  metadata?: ActivityMetadata
): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        metadata: metadata || {},
      })

    if (error) {
    }
  } catch (error) {
  }
}

export async function getActivityStats(userId: string, days: number = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      return null
    }

    return data
  } catch (error) {
    return null
  }
}

export async function getYogaMinutes(userId: string, days: number = 30) {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('user_activities')
      .select('metadata')
      .eq('user_id', userId)
      .eq('activity_type', 'yoga_video_watch')
      .gte('created_at', startDate.toISOString())

    if (error) {
      return 0
    }

    const totalMinutes = data?.reduce((sum, activity) => {
      const duration = activity.metadata?.video_duration || 0
      return sum + (duration / 60) // Convert seconds to minutes
    }, 0) || 0

    return Math.round(totalMinutes)
  } catch (error) {
    return 0
  }
}

