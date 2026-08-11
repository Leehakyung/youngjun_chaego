import { Link, useNavigate } from 'react-router-dom'

import { supabase } from '@/api/supabase'
import { useAuthStore } from '@/store/useAuthStore'
import { logger } from '@/utils/logger'

const navLinkClass =
  'font-body text-[11px] font-medium tracking-[0.14em] text-tan uppercase transition-colors duration-150 ease-out hover:text-lime'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      logger.warn('로그아웃 실패', error)
      return
    }
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between gap-4 bg-espresso px-8 py-5">
      <Link to="/" className="font-display text-lg font-bold tracking-[0.05em] text-cream">
        랜덤 단어 뽑기
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="font-body text-[11px] tracking-[0.02em] text-cream">{user.email}</span>
            <button type="button" onClick={handleLogout} className={navLinkClass}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={navLinkClass}>
              로그인
            </Link>
            <Link to="/signup" className={navLinkClass}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
