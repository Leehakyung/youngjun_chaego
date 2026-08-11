import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { saveOnboardingAnswers } from '@/api/onboarding'
import { AuthCard } from '@/components/AuthCard'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { OnboardingOptionButton } from '@/components/OnboardingOptionButton'
import { onboardingQuestions } from '@/data/onboardingQuestions'
import { useAuthStore } from '@/store/useAuthStore'
import { useOnboardingStatusStore } from '@/store/useOnboardingStatusStore'
import type { OnboardingAnswers, OnboardingQuestionId } from '@/types/onboarding'
import { logger } from '@/utils/logger'

function OnboardingPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const markCompleted = useOnboardingStatusStore((state) => state.markCompleted)

  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const totalSteps = onboardingQuestions.length
  const currentQuestion = onboardingQuestions[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === totalSteps - 1
  const currentAnswer = answers[currentQuestion.id]
  const allAnswered = onboardingQuestions.every((question) => answers[question.id] !== undefined)

  function handleSelect<TId extends OnboardingQuestionId>(id: TId, value: OnboardingAnswers[TId]) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handlePrev() {
    setStepIndex((index) => Math.max(0, index - 1))
  }

  function handleNext() {
    setStepIndex((index) => Math.min(totalSteps - 1, index + 1))
  }

  async function handleComplete() {
    if (!allAnswered || isSubmitting || !user) return

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      await saveOnboardingAnswers(user.id, answers as OnboardingAnswers)
      markCompleted()
      navigate('/')
    } catch (error) {
      logger.error('온보딩 저장 실패', error)
      setErrorMessage('저장에 실패했습니다. 잠시 후 다시 시도해주세요.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />

      <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center gap-4 px-6 py-10">
        <p className="text-center font-body text-[11px] font-semibold tracking-[0.14em] text-tan uppercase">
          {stepIndex + 1} / {totalSteps}
        </p>

        <AuthCard title={currentQuestion.title}>
          <div role="radiogroup" aria-label={currentQuestion.title} className="flex flex-col gap-3">
            {currentQuestion.options.map((option) => (
              <OnboardingOptionButton
                key={option.value}
                label={option.label}
                selected={currentAnswer === option.value}
                onSelect={() => handleSelect(currentQuestion.id, option.value)}
              />
            ))}
          </div>

          {errorMessage ? (
            <p role="alert" className="font-body text-xs text-coral">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-between gap-3">
            <Button type="button" variant="secondary" onClick={handlePrev} disabled={isFirstStep || isSubmitting}>
              이전
            </Button>

            {isLastStep ? (
              <Button type="button" onClick={handleComplete} disabled={!allAnswered || isSubmitting}>
                {isSubmitting ? '저장 중...' : '완료'}
              </Button>
            ) : (
              <Button type="button" onClick={handleNext} disabled={currentAnswer === undefined}>
                다음
              </Button>
            )}
          </div>
        </AuthCard>
      </main>

      <Footer />
    </div>
  )
}

export default OnboardingPage
