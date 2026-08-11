import { create } from 'zustand'

import { fetchOnboardingCompleted } from '@/api/profiles'
import { logger } from '@/utils/logger'

type OnboardingStatusPhase = 'idle' | 'loading' | 'loaded' | 'error'

interface OnboardingStatusStore {
  phase: OnboardingStatusPhase
  // 컬럼명(onboarding_completed)을 그대로 사용 — 별칭을 만들지 않기로 함
  onboarding_completed: boolean | null
  fetchStatus: (userId: string) => Promise<void>
  markCompleted: () => void
  reset: () => void
}

export const useOnboardingStatusStore = create<OnboardingStatusStore>((set) => ({
  phase: 'idle',
  onboarding_completed: null,
  fetchStatus: async (userId) => {
    set({ phase: 'loading' })
    try {
      const onboarding_completed = await fetchOnboardingCompleted(userId)
      set({ phase: 'loaded', onboarding_completed })
    } catch (error) {
      logger.error('온보딩 상태 조회 실패', error)
      set({ phase: 'error', onboarding_completed: null })
    }
  },
  markCompleted: () => set({ phase: 'loaded', onboarding_completed: true }),
  reset: () => set({ phase: 'idle', onboarding_completed: null }),
}))
