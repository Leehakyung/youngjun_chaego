-- =====================================================================
-- 온보딩 답변 저장용 profiles 테이블 + RLS + 신규 가입 트리거
-- Supabase SQL Editor에 그대로 붙여넣어 실행
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) public.profiles 테이블 생성
--    - id: auth.users(id)를 참조하는 PK 겸 FK. 유저 삭제 시 이 행도 함께 삭제(cascade)
--    - purpose / main_problem / expected_feature: 온보딩 질문별 답변 코드값
--      (질문이 3~5개로 고정이라 jsonb 대신 컬럼을 분리해 쿼리를 단순하게 유지)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  onboarding_completed boolean not null default false,
  purpose text, -- 목적 질문 답변. 저장값: role_student | role_teacher
  main_problem text, -- 문제 질문 답변. 저장값: difficulty_mismatch | category_mismatch | repeated_words
  expected_feature text, -- 기대 기능 질문 답변. 저장값: feature_favorites | feature_learning_stats | feature_timer | feature_voice_output
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2) RLS 활성화
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

-- ---------------------------------------------------------------------
-- 3) RLS 정책: select / insert / update 각각 "본인 행만" 허용
--    재실행 가능하도록 기존 동일 이름 정책은 먼저 제거 후 재생성 (데이터에는 영향 없음)
-- ---------------------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------
-- 4) auth.users에 신규 유저가 insert되면 public.profiles에 대응 행을 자동 생성
--    security definer + search_path 고정(빈 문자열)으로 search_path 하이재킹 방지,
--    함수 내부에서는 테이블명을 public.profiles로 완전 경로 지정
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
