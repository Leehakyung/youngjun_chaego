import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthGate } from '@/hooks/useAuthGate'

interface RequireOnboardingProps {
  requireCompleted: boolean
  children: ReactNode
}

export function RequireOnboarding({ requireCompleted, children }: RequireOnboardingProps) {
  const gate = useAuthGate()

  if (gate.state === 'checking') {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream font-body text-sm text-tan">
        불러오는 중...
      </div>
    )
  }

  if (gate.state === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  if (gate.state === 'error') {
    return (
      <div className="flex min-h-svh items-center justify-center bg-cream px-6 text-center font-body text-sm text-coral">
        상태를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.
      </div>
    )
  }

  if (requireCompleted && !gate.onboarding_completed) {
    return <Navigate to="/onboarding" replace />
  }

  if (!requireCompleted && gate.onboarding_completed) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
