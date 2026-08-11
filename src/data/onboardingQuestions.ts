import type { OnboardingQuestion } from '@/types/onboarding'

export const onboardingQuestions: readonly [
  OnboardingQuestion<'purpose'>,
  OnboardingQuestion<'mainProblem'>,
  OnboardingQuestion<'expectedFeature'>,
] = [
  {
    id: 'purpose',
    title: '이 서비스를 주로 어떤 역할로 사용하시나요?',
    options: [
      { value: 'role_student', label: '학생 — 수업 중 직접 단어를 뽑아요' },
      { value: 'role_teacher', label: '교사/강사 — 수업을 진행하며 활용해요' },
    ],
  },
  {
    id: 'mainProblem',
    title: '단어를 뽑을 때 가장 아쉬웠던 점은 무엇인가요?',
    options: [
      { value: 'difficulty_mismatch', label: '난이도가 나한테 안 맞았다' },
      { value: 'category_mismatch', label: '관심 없는 주제/카테고리가 자주 나왔다' },
      { value: 'repeated_words', label: '같은 단어가 반복돼서 지루했다' },
    ],
  },
  {
    id: 'expectedFeature',
    title: '앞으로 가장 써보고 싶은 기능은 무엇인가요?',
    options: [
      { value: 'feature_favorites', label: '즐겨찾기 (자주 틀리는 단어 저장)' },
      { value: 'feature_learning_stats', label: '학습 기록 (내가 푼 단어 통계)' },
      { value: 'feature_timer', label: '타이머 (제한 시간 모드)' },
      { value: 'feature_voice_output', label: '발음 듣기 (음성 출력)' },
    ],
  },
]
