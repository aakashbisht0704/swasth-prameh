import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

/**
 * Checks if a user has admin role
 */
export function isAdmin(user: User): boolean {
  return user.user_metadata?.role === 'admin'
}

/**
 * Checks if the current authenticated user is an admin
 */
export async function checkAdminRole(): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return false
    return isAdmin(user)
  } catch (error) {
    console.error('Error checking admin role:', error)
    return false
  }
}

/**
 * Server-side admin role check
 */
export async function checkAdminRoleServer(): Promise<boolean> {
  try {
    const { createServerSupabaseClient } = await import('./supabase-server')
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return false
    return isAdmin(user)
  } catch (error) {
    console.error('Error checking admin role:', error)
    return false
  }
}

/**
 * Gets all users with their onboarding status for admin dashboard
 */
export async function getUsersWithOnboarding() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        full_name,
        phone,
        onboarding_completed,
        created_at,
        user_profiles (
          gender,
          dob
        ),
        onboarding (
          age,
          diabetes_type,
          diagnosis_date,
          medical_history,
          report_url,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

/**
 * Gets chat participants for admin interface
 */
export async function getChatParticipants() {
  try {
    const { data, error } = await supabase
      .rpc('get_chat_participants')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching chat participants:', error)
    throw error
  }
}

/**
 * Gets all messages for a specific user (admin view)
 */
export async function getUserMessages(userId: string) {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user messages:', error)
    throw error
  }
}

/**
 * Gets detailed user information for admin view
 */
export async function getUserDetails(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        user_profiles (*),
        onboarding (*)
      `)
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user details:', error)
    throw error
  }
}
