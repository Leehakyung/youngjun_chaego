import type { Session, User } from '@supabase/supabase-js'
import { create } from 'zustand'

import { supabase } from '@/api/supabase'

interface AuthStore {
  session: Session | null
  user: User | null
  isInitializing: boolean
  init: () => () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  user: null,
  isInitializing: true,
  init: () => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, isInitializing: false })
    })

    return () => subscription.unsubscribe()
  },
}))
