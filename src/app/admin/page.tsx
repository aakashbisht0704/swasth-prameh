import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { checkAdminRoleServer, getUsersWithOnboarding } from '@/lib/admin-utils'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin - SwasthPrameh',
  description: 'Administration dashboard for SwasthPrameh',
}

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Check if user is admin
  const isAdmin = await checkAdminRoleServer()
  if (!isAdmin) {
    redirect('/dashboard')
  }

  // Fetch users data
  let users: any[] = []
  try {
    users = await getUsersWithOnboarding()
  } catch (error) {
    console.error('Error fetching users:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <AdminDashboard users={users} adminId={user.id} />
    </div>
  )
}