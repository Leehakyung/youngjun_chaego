import { useAuthStore } from '@/store/useAuthStore'
import { useOnboardingStatusStore } from '@/store/useOnboardingStatusStore'

export type AuthGateStatus =
  | { state: 'checking' }
  | { state: 'unauthenticated' }
  | { state: 'error' }
  | { state: 'ready'; onboarding_completed: boolean }

export function useAuthGate(): AuthGateStatus {
  const isInitializing = useAuthStore((state) => state.isInitializing)
  const user = useAuthStore((state) => state.user)
  const phase = useOnboardingStatusStore((state) => state.phase)
  const onboarding_completed = useOnboardingStatusStore((state) => state.onboarding_completed)

  if (isInitializing) return { state: 'checking' }
  if (!user) return { state: 'unauthenticated' }
  if (phase === 'idle' || phase === 'loading') return { state: 'checking' }
  if (phase === 'error' || onboarding_completed === null) return { state: 'error' }

  return { state: 'ready', onboarding_completed }
}
