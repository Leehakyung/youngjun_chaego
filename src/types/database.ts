export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          onboarding_completed: boolean
          purpose: string | null
          main_problem: string | null
          expected_feature: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          onboarding_completed?: boolean
          purpose?: string | null
          main_problem?: string | null
          expected_feature?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          onboarding_completed?: boolean
          purpose?: string | null
          main_problem?: string | null
          expected_feature?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
