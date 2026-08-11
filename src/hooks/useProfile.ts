import { useEffect, useState } from 'react'

import { supabase } from '@/api/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import type { Profile } from '@/types/profile'
import { logger } from '@/utils/logger'

export type ProfileState =
  | { status: 'loading' }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'success'; profile: Profile }

export function useProfile(): ProfileState {
  const user = useAuthStore((state) => state.user)
  const [state, setState] = useState<ProfileState>({ status: 'loading' })

  useEffect(() => {
    if (!user) {
      setState({ status: 'loading' })
      return
    }

    let isCancelled = false
    setState({ status: 'loading' })

    supabase
      .from('profiles')
      .select('id, email, onboarding_completed, purpose, main_problem, expected_feature')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (isCancelled) return

        if (error) {
          logger.error('프로필 조회 실패', error)
          setState({ status: 'error', message: '프로필을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.' })
          return
        }

        if (!data) {
          setState({ status: 'empty' })
          return
        }

        setState({ status: 'success', profile: data })
      })

    return () => {
      isCancelled = true
    }
  }, [user])

  return state
}
