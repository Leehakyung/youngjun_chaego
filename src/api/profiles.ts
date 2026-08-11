import { supabase } from '@/api/supabase'
import { logger } from '@/utils/logger'

export async function fetchOnboardingCompleted(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', userId)
    .single()

  if (error) {
    logger.error('onboarding_completed 조회 실패', error)
    throw error
  }

  return data.onboarding_completed
}
