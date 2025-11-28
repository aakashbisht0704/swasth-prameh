'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import type { SupportActivityLog } from '@/types/support'
import toast from 'react-hot-toast'

export function ActivityLog() {
  const [activities, setActivities] = useState<SupportActivityLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('support_activity_log')
        .select(`
          *,
          user:user_profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(500)

      if (error) throw error
      setActivities(data || [])
    } catch (error) {
      toast.error('Failed to load activity log')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={fetchActivities} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({activities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {activities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No activities found</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 border rounded-lg flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{activity.action}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {activity.entity_type}
                      </span>
                    </div>
                    <p className="text-sm">
                      By: {activity.user?.full_name || activity.user?.email || 'System'}
                    </p>
                    {Object.keys(activity.metadata || {}).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {JSON.stringify(activity.metadata)}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

