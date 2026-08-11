import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthCard } from '@/components/AuthCard'
import { ExplanationPanel } from '@/components/ExplanationPanel'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { WordCard } from '@/components/WordCard'
import { useProfile } from '@/hooks/useProfile'
import { useWordStore } from '@/store/useWordStore'
import { getExpectedFeatureLabel, getPickButtonLabel, getWelcomeSubtitle } from '@/utils/personalization'

function LandingPage() {
  const navigate = useNavigate()
  const profileState = useProfile()
  const currentWord = useWordStore((state) => state.currentWord)
  const isExplanationOpen = useWordStore((state) => state.isExplanationOpen)
  const pickRandomWord = useWordStore((state) => state.pickRandomWord)
  const toggleExplanation = useWordStore((state) => state.toggleExplanation)

  const needsOnboarding =
    profileState.status === 'empty' ||
    (profileState.status === 'success' && !profileState.profile.onboarding_completed)

  useEffect(() => {
    if (needsOnboarding) navigate('/onboarding', { replace: true })
  }, [needsOnboarding, navigate])

  if (profileState.status === 'loading') {
    return (
      <div className="flex min-h-svh flex-col bg-cream">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <p className="font-body text-sm text-tan">불러오는 중...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (profileState.status === 'error') {
    return (
      <div className="flex min-h-svh flex-col bg-cream">
        <Header />
        <main className="flex flex-1 items-center justify-center px-6">
          <p className="text-center font-body text-sm text-coral">{profileState.message}</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (profileState.status === 'empty') {
    return null
  }

  if (!profileState.profile.onboarding_completed) {
    return null
  }

  const { profile } = profileState

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />

      <main className="mx-auto flex w-full max-w-[600px] flex-1 flex-col gap-6 px-6 py-10">
        <AuthCard title={`${profile.email ?? '학습자'}님, 환영합니다!`}>
          <p className="font-body text-xs text-tan">{getWelcomeSubtitle(profile.purpose)}</p>
        </AuthCard>

        <WordCard word={currentWord} emptyStateHint={getExpectedFeatureLabel(profile.expected_feature)} />

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={pickRandomWord}
            className="min-h-12 rounded-sm bg-forest px-7 py-3 font-body text-xs font-semibold tracking-[0.12em] text-lime uppercase transition-colors duration-150 ease-out hover:bg-espresso"
          >
            {getPickButtonLabel(profile.purpose)}
          </button>

          <button
            type="button"
            onClick={toggleExplanation}
            disabled={!currentWord}
            className="min-h-12 rounded-sm border border-black px-7 py-3 font-body text-xs font-semibold tracking-[0.12em] text-black uppercase transition-colors duration-150 ease-out hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black"
          >
            설명 도와줘
          </button>
        </div>

        {currentWord ? <ExplanationPanel isOpen={isExplanationOpen} word={currentWord} /> : null}
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage
