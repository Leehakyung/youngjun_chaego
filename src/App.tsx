import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { RequireOnboarding } from '@/components/RequireOnboarding'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import OnboardingPage from '@/pages/OnboardingPage'
import SignupPage from '@/pages/SignupPage'
import { useAuthStore } from '@/store/useAuthStore'
import { useOnboardingStatusStore } from '@/store/useOnboardingStatusStore'

export function App() {
  const init = useAuthStore((state) => state.init)
  const user = useAuthStore((state) => state.user)
  const fetchStatus = useOnboardingStatusStore((state) => state.fetchStatus)
  const resetStatus = useOnboardingStatusStore((state) => state.reset)

  useEffect(() => init(), [init])

  useEffect(() => {
    if (user) {
      fetchStatus(user.id)
    } else {
      resetStatus()
    }
  }, [user, fetchStatus, resetStatus])

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequireOnboarding requireCompleted={true}>
              <LandingPage />
            </RequireOnboarding>
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/onboarding"
          element={
            <RequireOnboarding requireCompleted={false}>
              <OnboardingPage />
            </RequireOnboarding>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
