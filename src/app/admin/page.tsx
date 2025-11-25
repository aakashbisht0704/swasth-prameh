'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
// Simple tab navigation without external dependency
import { UsersList } from '@/components/admin/UsersList'
import { ChatsDashboard } from '@/components/admin/ChatsDashboard'
import { ActivityLog } from '@/components/admin/ActivityLog'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState('chats')

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          router.push('/dashboard')
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error('Error checking admin:', error)
        router.push('/dashboard')
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Admin Panel</CardTitle>
          <CardDescription>
            Manage users, support chats, and system activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="flex border-b mb-6">
              <button
                onClick={() => setActiveTab('chats')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'chats'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Chats
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'activity'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Activity Log
              </button>
            </div>
            {activeTab === 'chats' && <ChatsDashboard />}
            {activeTab === 'users' && <UsersList />}
            {activeTab === 'activity' && <ActivityLog />}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
