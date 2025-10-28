export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
  Tables: {
    chat_messages: {
      Row: {
        id: string
        user_id: string
        admin_id: string | null
        message: string
        sender_type: 'user' | 'admin'
        is_read: boolean
        created_at: string
        updated_at: string
      }
      Insert: {
        id?: string
        user_id: string
        admin_id?: string | null
        message: string
        sender_type: 'user' | 'admin'
        is_read?: boolean
        created_at?: string
        updated_at?: string
      }
      Update: {
        id?: string
        user_id?: string
        admin_id?: string | null
        message?: string
        sender_type?: 'user' | 'admin'
        is_read?: boolean
        created_at?: string
        updated_at?: string
      }
      Relationships: [
        {
          foreignKeyName: "chat_messages_user_id_fkey"
          columns: ["user_id"]
          referencedRelation: "users"
          referencedColumns: ["id"]
        },
        {
          foreignKeyName: "chat_messages_admin_id_fkey"
          columns: ["admin_id"]
          referencedRelation: "users"
          referencedColumns: ["id"]
        }
      ]
    },
      onboarding: {
        Row: {
          id: string
          user_id: string
          age: number
          gender: string
          diabetes_type: string
          diagnosis_date: string
          current_medications: string[]
          ayurvedic_experience: boolean
          report_url: string | null
          prakriti_vata: string | null
          prakriti_pitta: string | null
          prakriti_kapha: string | null
          medical_history: string | null
          nadi: string | null
          mutra: string | null
          mala: string | null
          jihwa: string | null
          shabda: string | null
          sparsha: string | null
          drik: string | null
          akriti: string | null
          diet: string | null
          exercise: string | null
          sleep: string | null
          prakriti_scores: any | null
          prakriti_totals: any | null
          prakriti_summary: any | null
          lifestyle: any | null
          medical_history: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age: number
          gender: string
          diabetes_type: string
          diagnosis_date: string
          current_medications?: string[]
          ayurvedic_experience?: boolean
          report_url?: string | null
          prakriti_vata?: string | null
          prakriti_pitta?: string | null
          prakriti_kapha?: string | null
          medical_history?: string | null
          nadi?: string | null
          mutra?: string | null
          mala?: string | null
          jihwa?: string | null
          shabda?: string | null
          sparsha?: string | null
          drik?: string | null
          akriti?: string | null
          diet?: string | null
          exercise?: string | null
          sleep?: string | null
          prakriti_scores?: any | null
          prakriti_totals?: any | null
          prakriti_summary?: any | null
          lifestyle?: any | null
          medical_history?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age?: number
          gender?: string
          diabetes_type?: string
          diagnosis_date?: string
          current_medications?: string[]
          ayurvedic_experience?: boolean
          report_url?: string | null
          prakriti_vata?: string | null
          prakriti_pitta?: string | null
          prakriti_kapha?: string | null
          medical_history?: any | null
          nadi?: string | null
          mutra?: string | null
          mala?: string | null
          jihwa?: string | null
          shabda?: string | null
          sparsha?: string | null
          drik?: string | null
          akriti?: string | null
          diet?: string | null
          exercise?: string | null
          sleep?: string | null
          prakriti_scores?: any
          prakriti_totals?: any
          prakriti_summary?: any
          lifestyle?: any
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      },
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          gender: string
          dob: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          gender: string
          dob?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          gender?: string
          dob?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          plan_id: string | null
          score: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id?: string | null
          score: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string | null
          score?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "plans"
            referencedColumns: ["id"]
          }
        ]
      }
      contact: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          id: string
          user_id: string
          diagnosis_id: string | null
          plan_json: any
          summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          diagnosis_id?: string | null
          plan_json: any
          summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          diagnosis_id?: string | null
          plan_json?: any
          summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plans_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plans_diagnosis_id_fkey"
            columns: ["diagnosis_id"]
            referencedRelation: "diagnosis"
            referencedColumns: ["id"]
          }
        ]
      }
      diagnosis: {
        Row: {
          id: string
          user_id: string
          input_features: any
          ml_output: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          input_features: any
          ml_output: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          input_features?: any
          ml_output?: any
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnosis_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}