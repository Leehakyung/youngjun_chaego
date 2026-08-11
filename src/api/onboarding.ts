import { supabase } from '@/api/supabase'
import type { OnboardingAnswers } from '@/types/onboarding'

export async function saveOnboardingAnswers(userId: string, answers: OnboardingAnswers): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({
      purpose: answers.purpose,
      main_problem: answers.mainProblem,
      expected_feature: answers.expectedFeature,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) throw error
}
