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
      .eq('id', user.id)
      .maybeSingle()
      
    if (profileFetchError) {
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
          id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '', 
          email: user.email || null,
          gender: user.user_metadata?.gender || '', 
          dob: user.user_metadata?.dob ? new Date(user.user_metadata.dob).toISOString().split('T')[0] : null,
          role: 'user' // Default role
        })
        
      if (insertError) {
        // Try upsert instead in case of conflict
        const { error: upsertError } = await supabase
          .from('user_profiles')
          .upsert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
            email: user.email || null,
            gender: user.user_metadata?.gender || '',
            role: 'user',
          }, { onConflict: 'id' })
        
        if (upsertError) {
          throw upsertError
        }
      }
    } else {
      // Ensure email and role are set if missing
      const updates: any = {}
      if (!profile.email && user.email) {
        updates.email = user.email
      }
      if (!profile.role) {
        updates.role = 'user'
      }
      if (Object.keys(updates).length > 0) {
        await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', user.id)
      }
    }
  } catch (error) {
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
      if (error.message.includes('relation "public.onboarding" does not exist')) {
      }
      return false
    }
      
    return !!onboarding
  } catch (error) {
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
      throw error
    }
  } catch (error) {
    throw error
  }
}
