import type { Database } from '@/types/database'

export type Profile = Pick<
  Database['public']['Tables']['profiles']['Row'],
  'id' | 'email' | 'onboarding_completed' | 'purpose' | 'main_problem' | 'expected_feature'
>
