import type { ExpectedFeature, Purpose } from '@/types/onboarding'

const DEFAULT_PURPOSE: Purpose = 'role_student'

const WELCOME_SUBTITLE_BY_PURPOSE: Record<Purpose, string> = {
  role_student: '오늘도 즐겁게 단어를 뽑아볼까요?',
  role_teacher: '학생들과 함께 오늘의 단어를 뽑아보세요',
}

const PICK_BUTTON_LABEL_BY_PURPOSE: Record<Purpose, string> = {
  role_student: '랜덤 단어 뽑기',
  role_teacher: '학생과 함께 뽑기',
}

const EXPECTED_FEATURE_LABEL_BY_VALUE: Record<ExpectedFeature, string> = {
  feature_favorites: '즐겨찾기 (자주 틀리는 단어 저장)',
  feature_learning_stats: '학습 기록 (내가 푼 단어 통계)',
  feature_timer: '타이머 (제한 시간 모드)',
  feature_voice_output: '발음 듣기 (음성 출력)',
}

function isPurpose(value: string): value is Purpose {
  return value in WELCOME_SUBTITLE_BY_PURPOSE
}

function isExpectedFeature(value: string): value is ExpectedFeature {
  return value in EXPECTED_FEATURE_LABEL_BY_VALUE
}

function resolvePurpose(purpose: string | null): Purpose {
  return purpose !== null && isPurpose(purpose) ? purpose : DEFAULT_PURPOSE
}

export function getWelcomeSubtitle(purpose: string | null): string {
  return WELCOME_SUBTITLE_BY_PURPOSE[resolvePurpose(purpose)]
}

export function getPickButtonLabel(purpose: string | null): string {
  return PICK_BUTTON_LABEL_BY_PURPOSE[resolvePurpose(purpose)]
}

export function getExpectedFeatureLabel(expectedFeature: string | null): string | null {
  if (expectedFeature !== null && isExpectedFeature(expectedFeature)) {
    return EXPECTED_FEATURE_LABEL_BY_VALUE[expectedFeature]
  }
  return null
}
