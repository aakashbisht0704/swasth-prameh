import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface UserData {
  id: string
  email: string
  full_name?: string
  phone?: string | null
}

/**
 * Creates or updates user records in both users and user_profiles tables
 */
export async function ensureUserExists(user: User): Promise<void> {
  try {
    // Create/update user record in users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
        phone: user.phone || null,
        onboarding_completed: false,
      }, { onConflict: 'id' })
    
    if (userError) {
      console.error('Error upserting user:', userError.message)
      // If the error is about table not existing, provide helpful message
      if (userError.message.includes('relation "public.users" does not exist')) {
        throw new Error('Database tables not set up. Please run the database setup script in Supabase.')
      }
      throw userError
    }
    
    // Check if user_profiles record exists
    const { data: profile, error: profileFetchError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
      
    if (profileFetchError) {
      console.error('Error fetching user_profiles:', profileFetchError.message)
      if (profileFetchError.message.includes('relation "public.user_profiles" does not exist')) {
        throw new Error('Database tables not set up. Please run the database setup script in Supabase.')
      }
      throw profileFetchError
    }
    
    // Create user_profiles record if it doesn't exist
    if (!profile) {
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({ 
          user_id: user.id, 
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '', 
          gender: '', 
          dob: null 
        })
        
      if (insertError) {
        console.error('Error inserting user_profiles:', insertError.message)
        throw insertError
      }
    }
  } catch (error) {
    console.error('Error in ensureUserExists:', error)
    throw error
  }
}

/**
 * Checks if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  try {
    const { data: onboarding, error } = await supabase
      .from('onboarding')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()
      
    if (error) {
      console.error('Error checking onboarding status:', error)
      if (error.message.includes('relation "public.onboarding" does not exist')) {
        console.warn('Onboarding table does not exist. Please run the database setup script.')
      }
      return false
    }
      
    return !!onboarding
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return false
  }
}

/**
 * Gets the appropriate redirect URL for a user based on their onboarding status
 */
export async function getRedirectUrl(userId: string): Promise<string> {
  const hasOnboarding = await hasCompletedOnboarding(userId)
  return hasOnboarding ? '/dashboard' : '/onboarding'
}

/**
 * Updates user onboarding completion status
 */
export async function markOnboardingCompleted(userId: string, fullName?: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        onboarding_completed: true,
        ...(fullName && { full_name: fullName })
      })
      .eq('id', userId)
      
    if (error) {
      console.error('Error updating user onboarding status:', error.message)
      throw error
    }
  } catch (error) {
    console.error('Error in markOnboardingCompleted:', error)
    throw error
  }
}
