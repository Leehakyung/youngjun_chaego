# 온보딩 기능 TECHSPEC

> 참고 문서: [PRD.MD](../../PRD.MD) · [ONBOARDING_QUESTIONS.md](../../ONBOARDING_QUESTIONS.md) · [irep-design-system.md](../irep-design-system.md) · [supabase/onboarding_profiles.sql](../../supabase/onboarding_profiles.sql)

---

## 1. 목적 및 범위

회원가입/로그인 이후 사용자가 온보딩 질문(목적 · 문제 · 기대 기능)에 답하고, 그 답변을 `profiles` 테이블에 저장한 뒤, 답변에 따라 게임 화면(대시보드)을 개인화한다.

**이번 작업 범위**

1. 온보딩 멀티스텝 폼
2. 가입/로그인 후 온보딩 라우팅
3. 온보딩 답변 저장
4. `profiles` 읽기
5. 대시보드 개인화

**범위 밖**

- `profiles` 테이블/RLS/트리거 설계 — [supabase/onboarding_profiles.sql](../../supabase/onboarding_profiles.sql)에 이미 완료됨. 이번 스펙은 이를 소비하는 프론트엔드만 다룬다.
- 교사용 대시보드, 즐겨찾기, 학습 기록, 타이머, 발음 듣기 등 `expected_feature`/`purpose(role_teacher)` 답변이 가리키는 실제 기능 구현 — PRD 기준 v2 항목이며 미구현 상태. 이번 스펙에서는 "이 답을 저장하고, 답에 맞는 최소한의 화면 신호(강조 배지·안내 문구)만 노출"하는 수준까지만 다룬다. (§7 참고)

---

## 2. 현재 상태 (코드베이스 분석)

| 영역 | 현재 상태 |
|---|---|
| 라우팅 (`src/App.tsx`) | `/`, `/signup`, `/login` 세 개만 존재. 온보딩 라우트·가드 없음 |
| 가입/로그인 후 이동 | `SignupPage` → `/login`, `LoginPage` → `/` (온보딩 완료 여부 확인 없음) |
| 인증 상태 (`useAuthStore`) | `session`/`user`만 관리. `profiles` 조회 로직 없음 |
| API 레이어 (`src/api/`) | `supabase.ts`(클라이언트 초기화)만 존재. `profiles` CRUD 함수 없음 |
| DB | `profiles` 테이블 + RLS(본인 행만 select/insert/update) + `on_auth_user_created` 트리거(가입 시 `id`, `email` 자동 insert, `onboarding_completed` 기본값 `false`) 완료 |
| 온보딩 질문 정의 | `ONBOARDING_QUESTIONS.md`에 질문 3개, 선택지, 저장 코드값, 화면 분기 로직까지 문서화되어 있음 |
| 단어 데이터 (`src/types/word.ts`) | `category`, `level`(1~5) 필드 이미 존재 → 필터링 기반 개인화 가능 |
| 폼 패턴 | `SignupPage`/`LoginPage` 모두 `useState` + 수동 `handleSubmit`. 폼 라이브러리 없음 |
| 디자인 시스템 | `docs/irep-design-system.md` 토큰(`forest`/`lime`/`cream`/`espresso`/`tan`/`coral`/`gray-l`)이 `Button`/`TextField`/`AuthCard`/`Header`에 이미 적용됨 |

---

## 3. 의존성 검토

**신규 의존성 없음.**

- 멀티스텝 폼: 질문 3개, 각 단일 선택 — 로컬 `useState`(단계 인덱스 + 답변 객체)로 충분. `react-hook-form`/`zod` 도입은 이 규모에 비해 과함.
- 라우트 가드: `react-router-dom`(기존 v7)의 `<Navigate>` + 커스텀 wrapper 컴포넌트로 해결. 별도 라우팅 라이브러리 불필요.
- 데이터 fetch: 기존 `@supabase/supabase-js` 클라이언트(`src/api/supabase.ts`) 재사용. React Query 등 미도입.

---

## 4. 타입 정의

### `src/types/profile.ts` (신규)

```ts
export type Purpose = 'role_student' | 'role_teacher'

export type MainProblem = 'difficulty_mismatch' | 'category_mismatch' | 'repeated_words'

export type ExpectedFeature =
  | 'feature_favorites'
  | 'feature_learning_stats'
  | 'feature_timer'
  | 'feature_voice_output'

export interface Profile {
  id: string
  email: string | null
  onboardingCompleted: boolean
  purpose: Purpose | null
  mainProblem: MainProblem | null
  expectedFeature: ExpectedFeature | null
}

export interface OnboardingAnswers {
  purpose: Purpose
  mainProblem: MainProblem
  expectedFeature: ExpectedFeature
}
```

- DB 컬럼(`purpose`, `main_problem`, `expected_feature`)은 CHECK 제약 없는 `text`이므로, 코드값 유효성은 애플리케이션 레이어(온보딩 폼의 선택지)에서만 보장된다. DB-TS 매핑은 `src/api/profiles.ts`에서 snake_case ↔ camelCase 변환을 전담한다.

---

## 5. API 레이어 — `src/api/profiles.ts` (신규)

```ts
import { supabase } from '@/api/supabase'
import type { OnboardingAnswers, Profile } from '@/types/profile'

export async function fetchProfile(userId: string): Promise<Profile> { ... }

export async function saveOnboardingAnswers(
  userId: string,
  answers: OnboardingAnswers,
): Promise<Profile> { ... }
```

- `fetchProfile`: `profiles` 테이블에서 `id = userId` 행을 `select('*').single()`로 조회 후 camelCase `Profile`로 매핑.
- `saveOnboardingAnswers`: `purpose`/`main_problem`/`expected_feature`와 `onboarding_completed: true`, `updated_at: now()`를 `update().eq('id', userId).select().single()`로 반영.
- 두 함수 모두 `logger.error`로 실패를 기록하고 에러를 그대로 throw — 호출부(store)에서 상태로 변환.

---

## 6. 상태 관리 — `src/store/useProfileStore.ts` (신규)

`useAuthStore`(인증)와 `useWordStore`(단어)처럼 단일 책임으로 분리한다.

```ts
interface ProfileStore {
  profile: Profile | null
  isLoading: boolean
  fetchProfile: (userId: string) => Promise<void>
  applyOnboardingAnswers: (userId: string, answers: OnboardingAnswers) => Promise<void>
  reset: () => void
}
```

- `fetchProfile`: 로딩 시작 → `api/profiles.fetchProfile` 호출 → `profile` 갱신.
- `applyOnboardingAnswers`: `api/profiles.saveOnboardingAnswers` 호출 → 성공 시 `profile` 갱신(로컬 상태를 서버 응답으로 동기화, 재조회 불필요).
- `reset`: 로그아웃 시 `profile`을 `null`로 초기화.

`useAuthStore`는 그대로 두고, `App.tsx`에서 `user` 변화를 관찰해 `useProfileStore`를 연동한다(두 store를 합치지 않음 — 인증과 프로필은 갱신 주기가 다름).

```ts
// src/App.tsx
const user = useAuthStore((s) => s.user)
const fetchProfile = useProfileStore((s) => s.fetchProfile)
const resetProfile = useProfileStore((s) => s.reset)

useEffect(() => {
  if (user) fetchProfile(user.id)
  else resetProfile()
}, [user, fetchProfile, resetProfile])
```

---

## 7. 라우팅 및 가드

### 라우트 구성 (`src/App.tsx`)

```
/            → RequireOnboardingComplete( LandingPage )
/signup      → SignupPage
/login       → LoginPage
/onboarding  → RequireAuth( RequireOnboardingIncomplete( OnboardingPage ) )
```

### 가드 컴포넌트 (신규)

**`src/components/RequireAuth.tsx`**
- `useAuthStore`의 `isInitializing` 동안 로딩 표시.
- `user`가 없으면 `/login`으로 `<Navigate replace>`.

**`src/components/RequireOnboarding.tsx`**
- `RequireAuth`를 감싸 인증 확인 후, `useProfileStore`의 `profile`/`isLoading`을 확인.
- `mode="complete"` (게임 화면용): `profile.onboardingCompleted === false`면 `/onboarding`으로 이동.
- `mode="incomplete"` (온보딩 화면용): `profile.onboardingCompleted === true`면 `/`로 이동 (이미 완료한 사용자가 온보딩에 재진입하는 것을 막음).

두 모드를 하나의 컴포넌트로 만들지, `RequireOnboardingComplete`/`RequireOnboardingIncomplete` 두 개로 나눌지는 구현 시 가독성 기준으로 결정. 로직은 동일(분기만 반대)하므로 하나의 컴포넌트 + prop을 권장.

### 가입/로그인 이동 경로 변경

- `SignupPage.tsx`: `navigate('/login')` → 그대로 유지(가입 직후 이메일 인증 여부와 무관하게 로그인 화면으로 보내는 기존 흐름 유지). 실제 온보딩 진입은 로그인 성공 시점에 `RequireOnboarding` 가드가 처리.
- `LoginPage.tsx`: `navigate('/')` 유지 — `/`에 걸린 `RequireOnboardingComplete` 가드가 미완료 사용자를 `/onboarding`으로 자동 리다이렉트하므로 `LoginPage`가 직접 분기할 필요 없음.

이렇게 하면 "가입/로그인 이후 어디로 갈지"를 페이지마다 중복 구현하지 않고 가드 하나로 집중시킬 수 있다.

---

## 8. 온보딩 멀티스텝 폼

### 질문 데이터 — `src/data/onboardingQuestions.ts` (신규)

`ONBOARDING_QUESTIONS.md`의 표를 코드화. 예:

```ts
export interface OnboardingQuestion<TValue extends string> {
  id: 'purpose' | 'mainProblem' | 'expectedFeature'
  question: string
  options: { value: TValue; label: string }[]
}

export const onboardingQuestions = [
  { id: 'purpose', question: '이 서비스를 주로 어떤 역할로 사용하시나요?', options: [...] },
  { id: 'mainProblem', question: '단어를 뽑을 때 가장 아쉬웠던 점은 무엇인가요?', options: [...] },
  { id: 'expectedFeature', question: '앞으로 가장 써보고 싶은 기능은 무엇인가요?', options: [...] },
] as const
```

### 컴포넌트

- **`src/components/OnboardingOptionButton.tsx`**: 단일 선택지 버튼. 선택 시 `--c-forest`/`--c-lime` 배경으로 활성 상태 표시(디자인 시스템 `Badge/Active` 톤 재사용). `Button` 컴포넌트를 그대로 쓰기보다 라디오 시맨틱(`role="radio"` 또는 `<button aria-pressed>`)을 가진 별도 컴포넌트로 분리.
- **`src/pages/OnboardingPage.tsx`**: 단계 인덱스(`0~2`)와 답변 객체(`Partial<OnboardingAnswers>`)를 로컬 `useState`로 관리. `AuthCard`와 동일한 카드 레이아웃(`rounded-md border border-gray-l bg-white p-8`)을 재사용해 톤을 통일하고, 상단에 진행 표시(`1 / 3` 텍스트 — 디자인 시스템의 "Restraint" 원칙에 따라 프로그레스 바 대신 텍스트로 최소화)를 둔다.
  - 선택지 클릭 → 해당 질문 답변 저장 → 마지막 질문이 아니면 다음 단계로, 마지막 질문이면 `useProfileStore.applyOnboardingAnswers` 호출 후 `navigate('/')`.
  - 이전 단계로 되돌아가는 "이전" 버튼 제공(각 질문이 이미 답변된 상태를 유지해야 하므로 답변 객체는 매 단계 유지).

---

## 9. 온보딩 답변 저장

- 저장 트리거: `OnboardingPage`에서 마지막 질문 답변 직후, `useProfileStore.applyOnboardingAnswers(user.id, answers)` 호출.
- 내부적으로 `api/profiles.saveOnboardingAnswers`가 `profiles` 행을 `update`(3개 컬럼 + `onboarding_completed: true`).
- RLS `profiles_update_own` 정책(`auth.uid() = id`)이 이미 있으므로 본인 행 외 업데이트는 DB 레벨에서 차단됨 — 프론트에서 추가 권한 체크 불필요.
- 저장 실패 시(네트워크 오류 등) `OnboardingPage`에 에러 메시지 표시, 마지막 단계에 머무르며 재시도 가능하게 함(기존 `SignupPage`/`LoginPage`의 `errorMessage` 패턴 재사용).

---

## 10. `profiles` 읽기

- 읽기 시점: `App.tsx`에서 `useAuthStore.user`가 채워질 때마다(로그인 직후, 새로고침 후 세션 복원 시 모두 포함) `useProfileStore.fetchProfile(user.id)` 호출.
- 이 흐름 하나로 "로그인 직후 온보딩 여부 확인"과 "새로고침 시 프로필 재확인"을 모두 커버하므로 페이지별로 별도 fetch 로직을 두지 않는다.
- RLS `profiles_select_own` 정책으로 본인 행만 조회 가능.

---

## 11. 대시보드 개인화

`ONBOARDING_QUESTIONS.md`의 "이 답으로 달라지는 화면" 매핑 중, **현재 데이터 구조로 구현 가능한 범위만** 이번 스펙에 포함한다.

| 답변 | 개인화 내용 | 구현 가능 여부 |
|---|---|---|
| `main_problem = difficulty_mismatch` | 단어 뽑기 시 난이도 필터 기본 적용 | 가능 — `Word.level` 존재. `useWordStore`에 `preferredLevel` 필터 추가 |
| `main_problem = category_mismatch` | 선호 카테고리 기본 필터 적용 | 부분 가능 — `Word.category`는 존재하나, "선호 카테고리"를 고르는 질문이 없어 카테고리 값 자체는 온보딩에서 수집되지 않음. 이번 스펙에서는 필터 UI 노출까지만(기본값은 전체) |
| `main_problem = repeated_words` | 최근 나온 단어 자동 제외 | 가능 — `useWordStore`에 최근 히스토리(N개) 배열 추가, `pickDifferentWord`가 히스토리 제외하도록 확장 |
| `purpose = role_student` | 게임 플레이 화면을 첫 화면으로 | 이미 기본 동작(`LandingPage`가 유일한 게임 화면) — 추가 구현 불필요 |
| `purpose = role_teacher` | 교사 대시보드 진입 경로 노출 | **범위 밖** — 교사 대시보드 자체가 미구현(PRD v2). 이번 스펙에서는 `Header`에 안내 배지만 노출(클릭 시 "준비 중" 등) |
| `expected_feature = *` | 즐겨찾기/학습기록/타이머/발음듣기 우선 노출 | **범위 밖** — 해당 기능들이 전부 미구현. 이번 스펙에서는 `profile.expectedFeature` 값을 화면에 안내 문구로만 반영(예: "곧 만나보실 수 있어요") |

### 구현 방식

- `useWordStore`를 확장해 `preferredLevel: WordLevel | null`, `recentWordIds: number[]`(최근 N개) 상태를 추가하고, `pickDifferentWord`가 이 두 값을 반영하도록 수정.
- `LandingPage`가 마운트 시 `useProfileStore.profile`을 읽어 `useWordStore`의 필터 상태를 1회 초기화(`main_problem` 값 기반).
- `purpose`/`expected_feature` 기반 문구는 별도 상태 없이 `LandingPage`에서 `profile` 값을 직접 읽어 조건부 렌더링.

> **결정 필요 사항**: 위 표의 "범위 밖" 두 항목(교사 대시보드 진입 배지, 기대 기능 안내 문구)을 이번 작업에 포함할지, 아니면 답변 저장/개인화 인프라만 만들고 화면 반영은 다음 이터레이션으로 미룰지 확인 필요.

---

## 12. 파일 구조 요약

```
src/
├── api/
│   ├── supabase.ts            (기존)
│   └── profiles.ts            (신규) — fetchProfile, saveOnboardingAnswers
├── components/
│   ├── AuthCard.tsx            (기존, 재사용)
│   ├── Button.tsx               (기존, 재사용)
│   ├── TextField.tsx            (기존)
│   ├── Header.tsx                (기존 — role_teacher 배지 추가 시 수정)
│   ├── RequireAuth.tsx          (신규)
│   ├── RequireOnboarding.tsx    (신규)
│   └── OnboardingOptionButton.tsx (신규)
├── data/
│   ├── words.ts                (기존)
│   └── onboardingQuestions.ts  (신규)
├── pages/
│   ├── LandingPage.tsx         (기존 — 개인화 로직 추가 시 수정)
│   ├── LoginPage.tsx            (기존, 변경 없음)
│   ├── SignupPage.tsx           (기존, 변경 없음)
│   └── OnboardingPage.tsx      (신규)
├── store/
│   ├── useAuthStore.ts          (기존, 변경 없음)
│   ├── useWordStore.ts         (기존 — 필터 상태 추가 시 수정)
│   └── useProfileStore.ts      (신규)
├── types/
│   ├── word.ts                  (기존, 변경 없음)
│   └── profile.ts              (신규)
└── App.tsx                     (기존 — 라우트/프로필 연동 추가)
```

---

## 13. 구현 순서

1. **타입 + API 레이어**: `src/types/profile.ts`, `src/api/profiles.ts`
2. **프로필 스토어**: `src/store/useProfileStore.ts`, `App.tsx`에서 `user` 변화와 연동
3. **온보딩 질문 데이터 + 폼 UI**: `src/data/onboardingQuestions.ts`, `OnboardingOptionButton.tsx`, `OnboardingPage.tsx` (저장 로직 없이 로컬 상태로 스텝 이동까지 먼저 완성)
4. **답변 저장 연결**: `OnboardingPage`의 마지막 스텝에서 `applyOnboardingAnswers` 호출
5. **라우팅/가드**: `RequireAuth.tsx`, `RequireOnboarding.tsx`, `App.tsx`에 라우트 추가
6. **대시보드 개인화**: `useWordStore` 필터 확장, `LandingPage`에서 `profile` 기반 초기화 및 조건부 UI

각 단계는 이전 단계 없이도 독립적으로 타입 체크/빌드가 통과해야 한다(예: 3번은 저장 없이도 폼만으로 동작 확인 가능).

---

## 14. 검증 체크리스트

- [ ] 미인증 사용자가 `/`, `/onboarding` 접근 시 `/login`으로 이동하는지
- [ ] 로그인 직후 `onboarding_completed = false`인 사용자가 `/`로 가면 `/onboarding`으로 자동 이동하는지
- [ ] 온보딩을 이미 완료한 사용자가 `/onboarding`에 직접 접근하면 `/`로 이동하는지
- [ ] 온보딩 3단계를 모두 답변하면 `profiles` 행이 3개 컬럼 + `onboarding_completed = true`로 업데이트되는지 (Supabase 대시보드에서 확인)
- [ ] 새로고침 후에도 세션이 복원되며 `profile`이 다시 fetch되는지
- [ ] `pnpm run lint`, `pnpm run build` 통과
