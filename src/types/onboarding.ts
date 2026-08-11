export type Purpose = 'role_student' | 'role_teacher'

export type MainProblem = 'difficulty_mismatch' | 'category_mismatch' | 'repeated_words'

export type ExpectedFeature =
  | 'feature_favorites'
  | 'feature_learning_stats'
  | 'feature_timer'
  | 'feature_voice_output'

export interface OnboardingAnswers {
  purpose: Purpose
  mainProblem: MainProblem
  expectedFeature: ExpectedFeature
}

export type OnboardingQuestionId = keyof OnboardingAnswers

export interface OnboardingOption<TValue extends string> {
  value: TValue
  label: string
}

export interface OnboardingQuestion<TId extends OnboardingQuestionId = OnboardingQuestionId> {
  id: TId
  title: string
  options: readonly OnboardingOption<OnboardingAnswers[TId]>[]
}
