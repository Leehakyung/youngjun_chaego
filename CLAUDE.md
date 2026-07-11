프로젝트: {랜덤 단어장 나오는 게임}


기술 스택: React + TypeScript + Vite 
상태 관리: Zustand 
스타일링: Tailwind CSS 
패키지 매니저: pnpm

코드 스타일
TypeScript strict 모드 사용, any 타입 금지 (불가피하면 unknown 사용 후 좁히기)
default export 대신 named export 사용 (단, 페이지/라우트 컴포넌트는 예외 가능)
함수형 컴포넌트와 Hook만 사용, 클래스 컴포넌트 금지
컴포넌트 파일명은 PascalCase (UserCard.tsx), 그 외 유틸/훅은 camelCase
커스텀 훅은 반드시 use 접두사로 시작
import 순서: 외부 라이브러리 → 내부 절대경로 → 상대경로 순으로 정리
절대경로 alias 사용 (@/components/...), 깊은 상대경로(../../../) 금지
console.log 대신 {지정 로거}를 사용 (디버깅 로그를 커밋에 남기지 말 것)
스타일: {예: Tailwind 유틸리티 클래스 우선 사용, 인라인 스타일·커스텀 CSS 최소화}
명령어
{pnpm} run dev: 개발 서버 시작 (Vite, 포트 {5173})
{pnpm} run build: 프로덕션 빌드 (tsc 타입 체크 후 vite build)
{pnpm} run preview: 빌드 결과물 로컬 미리보기
{pnpm} run lint: ESLint 검사
{pnpm} run format: {Prettier} 포맷팅
{pnpm} run test: {테스트 명령어 — 예: Vitest 실행}
배포: {추후 선정}
아키텍처
src/
├── assets/        # 이미지, 폰트 등 정적 리소스
├── components/    # 재사용 가능한 공통 UI 컴포넌트
├── pages/         # 라우트 단위 페이지 컴포넌트
├── hooks/         # 커스텀 훅
├── store/         # 전역 상태 관리 ({상태관리 라이브러리})
├── api/           # API 호출 함수 및 클라이언트 설정
├── types/         # 공유 타입 정의
├── utils/         # 순수 유틸 함수
└── styles/        # 전역 스타일 / 테마
라우팅: {예: React Router v6 — 라우트 정의 위치}
API 통신: {예: axios 인스턴스 위치, React Query 사용 여부}
환경 변수: Vite는 VITE_ 접두사가 붙은 변수만 클라이언트에 노출됨 (import.meta.env.VITE_*)
중요 사항
IMPORTANT: .env 파일은 절대 커밋하지 마세요. VITE_ 접두사 변수는 빌드 결과물에 그대로 노출되므로 비밀 키를 넣지 말 것
새 의존성을 추가하기 전에 먼저 알려주세요 (번들 크기 영향 검토)
{직접 수정하면 안 되는 파일/폴더 — 예: 자동 생성되는 타입, 마이그레이션 등}
{특이한 API 규칙 — 예: 특정 헤더 형식, 인증 토큰 처리 방식}
{프로젝트별 주의점 — 예: 특정 컴포넌트의 렌더링 최적화 이슈, 알려진 우회 처리}
커밋 전 {npm} run lint와 빌드가 통과하는지 확인하세요
참고 문서
프로젝트 개요는 @README.md 참고
사용 가능한 스크립트는 @package.json 참고
{추가 상세 문서 — 예: @docs/api-conventions.md}