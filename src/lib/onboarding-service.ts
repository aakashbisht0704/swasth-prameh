import { supabase } from './supabase'
import type { Database } from './database.types'

type Tables = Database['public']['Tables']
type OnboardingInsert = Tables['onboarding']['Insert']
type OnboardingRow = Tables['onboarding']['Row']

export type OnboardingInput = {
  user_id: string
  age: number
  gender: string
  diabetes_type: string
  diagnosis_date: string
  current_medications?: string[]
  ayurvedic_experience?: boolean
  prakriti_scores?: any
  prakriti_totals?: any
  prakriti_summary?: any
  lifestyle?: any
  medical_history?: any
}

export type OnboardingData = OnboardingRow

export class OnboardingService {
  private static handleError(error: Error, context: string): never {
    throw new Error(`${context}: ${error.message}`)
  }

  static async saveOnboardingData(input: OnboardingInput): Promise<boolean> {
    try {
      // Prepare onboarding data
      const onboardingData: OnboardingInsert = {
        user_id: input.user_id,
        age: input.age,
        gender: input.gender,
        diabetes_type: input.diabetes_type,
        diagnosis_date: input.diagnosis_date,
        current_medications: input.current_medications ?? [],
        ayurvedic_experience: input.ayurvedic_experience ?? false,
        prakriti_scores: input.prakriti_scores,
        prakriti_totals: input.prakriti_totals,
        prakriti_summary: input.prakriti_summary,
        lifestyle: input.lifestyle,
        medical_history: input.medical_history
      }

      // Insert or update onboarding data
      const { error: onboardingError } = await supabase
        .from('onboarding')
        .upsert(onboardingData, { onConflict: 'user_id' })

      if (onboardingError) {
        this.handleError(onboardingError, 'Failed to save onboarding data')
      }

      // Update user status
      const { error: userError } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('id', input.user_id)

      if (userError) {
        this.handleError(userError, 'Failed to update user status')
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(error, 'Error in onboarding process')
      }
      throw error
    }
  }

  static async getOnboardingData(userId: string): Promise<OnboardingData | null> {
    try {
      const { data, error } = await supabase
        .from('onboarding')
        .select()
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        this.handleError(error, 'Failed to fetch onboarding data')
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(error, 'Error fetching onboarding data')
      }
      throw error
    }
  }

  static async isOnboardingComplete(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_completed')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        this.handleError(error, 'Failed to check onboarding status')
      }

      return data?.onboarding_completed ?? false
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(error, 'Error checking onboarding status')
      }
      throw error
    }
  }

  static async savePrakritiScores(
    userId: string, 
    prakritiData: {
      prakriti_scores: any
      prakriti_totals: any
      prakriti_summary: any
    }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('onboarding')
        .update({
          prakriti_scores: prakritiData.prakriti_scores,
          prakriti_totals: prakritiData.prakriti_totals,
          prakriti_summary: prakritiData.prakriti_summary
        })
        .eq('user_id', userId)

      if (error) {
        this.handleError(error, 'Failed to save Prakriti scores')
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        this.handleError(error, 'Error saving Prakriti scores')
      }
      throw error
    }
  }
}
