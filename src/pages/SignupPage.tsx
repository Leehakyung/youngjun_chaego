import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from '@/api/supabase'
import { AuthCard } from '@/components/AuthCard'
import { Button } from '@/components/Button'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { TextField } from '@/components/TextField'
import { logger } from '@/utils/logger'

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      logger.warn('회원가입 실패', error)
      setErrorMessage(error.message)
      setIsSubmitting(false)
      return
    }

    setIsSubmitting(false)
    // 이메일 확인이 필요 없는 프로젝트 설정이면 가입 즉시 세션이 생겨 '/'(→ /onboarding)로,
    // 이메일 확인이 필요하면 세션이 없으므로 로그인 화면으로 보낸다.
    navigate(data.session ? '/' : '/login')
  }

  return (
    <div className="flex min-h-svh flex-col bg-cream">
      <Header />

      <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center gap-4 px-6 py-10">
        <AuthCard title="회원가입">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <TextField
              label="이메일"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              label="비밀번호"
              type="password"
              name="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {errorMessage ? (
              <p role="alert" className="font-body text-xs text-coral">
                {errorMessage}
              </p>
            ) : null}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '가입 중...' : '회원가입'}
            </Button>
          </form>
        </AuthCard>

        <p className="text-center font-body text-xs text-tan">
          이미 계정이 있나요?{' '}
          <Link to="/login" className="font-semibold text-forest hover:underline">
            로그인
          </Link>
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default SignupPage
