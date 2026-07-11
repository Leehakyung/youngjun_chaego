# L'OISEAU DÉ — Design System

> Cosmetic & Beauty E-commerce · Framer Template · v1.0

---

## 1. Brand Language

L'OISEAU DÉ는 현대적인 아틀리에 — 우아함과 단순함이 만나는 공간입니다. 디자인 시스템은 자연에서 영감을 받은 보태니컬 럭셔리 감성을 반영합니다.

| 원칙 | 설명 |
|------|------|
| **A. Botanical Palette** | 자연에서 추출한 색상 — 포레스트 그린, 세이지, 크림, 에스프레소. 라임 차트리즈가 땅과 에너지를 잇는 살아있는 악센트 |
| **B. Editorial Scale** | 디스플레이 타이포그래피를 드라마틱하게 사용. Clash Display가 브랜드 개성을 담당 |
| **C. Restraint** | 여백이 최우선 럭셔리. 그리드가 숨쉬어야 함. 장식은 제품 스토리를 돕는 경우에만 |
| **D. Sensory Language** | 카피는 질감 언어 사용: velvet, warm, fresh, radiant. UI 언어도 같은 맥락 유지 |

---

## 2. Color System

> 규칙: 컴포넌트에서는 반드시 시맨틱 토큰(--bg, --fg, --accent)을 사용. 헥스값 직접 입력 금지.

### 2-1. 컬러 프리미티브

#### Neutrals

| 토큰 | 헥스 | 용도 |
|------|------|------|
| `--c-black` | `#000000` | 기본 텍스트, CTA 버튼 배경 |
| `--c-white` | `#ffffff` | 카드 표면, 오버레이 |
| `--c-cream` | `#f7f5ed` | 페이지 배경 |
| `--c-gray-l` | `#ecece4` | 테두리, 뮤트 서페이스 |
| `--c-tan` | `#cacab0` | 서브 텍스트, 구분선 |

#### Earth (EARTH NOIR)

| 토큰 | 헥스 | 용도 |
|------|------|------|
| `--c-espresso` | `#483f36` | 내비게이션 배경, 다크 섹션, 서브 텍스트 |

#### Botanical Greens (VELVET CITRUS)

| 토큰 | 헥스 | 용도 |
|------|------|------|
| `--c-forest` | `#486e46` | 액센트 버튼, 아이콘 |
| `--c-lime` | `#c3e794` | 하이라이트, 배지, 활성 상태 |
| `--c-sage` | `#d7e2c1` | 카드 배경 틴트, 호버 배경 |
| `--c-mint` | `#f0f7ed` | 카테고리 카드 배경 |

#### Accent & Functional

| 토큰 | 헥스 | 용도 |
|------|------|------|
| `--c-gold` | `#e8d695` | 프리미엄 배지, 웜 악센트 |
| `--c-lavender` | `#fef7ff` | 소프트 배경 변형 |
| `--c-coral` | `#ff2244` | 세일 배지, 알림 상태 전용 |

### 2-2. 시맨틱 토큰

| 토큰 | Light | Dark |
|------|-------|------|
| `--bg` | `#f7f5ed` | `#1a1714` |
| `--bg-surface` | `#ffffff` | `#252119` |
| `--bg-muted` | `#ecece4` | `#2e2a25` |
| `--fg` | `#000000` | `#f7f5ed` |
| `--fg-muted` | `#483f36` | `#cacab0` |
| `--fg-subtle` | `#cacab0` | `#7a7268` |
| `--border` | `#ecece4` | `#3a342e` |
| `--accent` | `#486e46` | `#c3e794` |
| `--accent-hi` | `#c3e794` | `#486e46` |

---

## 3. Typography

### 3-1. 폰트 패밀리

| 역할 | 폰트 | 대체 폰트 |
|------|------|----------|
| Display | **Clash Display** | Bahnschrift, Gill Sans MT, Trebuchet MS, sans-serif |
| Body | **Inter** | Segoe UI, system-ui, -apple-system, sans-serif |

```css
--font-display: "Clash Display", "Bahnschrift", "Gill Sans MT", "Trebuchet MS", sans-serif;
--font-body:    "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
```

### 3-2. Clash Display 웨이트

| 웨이트 | 값 | 용도 |
|--------|-----|------|
| Light | 300 | 서브카피, 에디토리얼 캡션 |
| Regular | 400 | 섹션 라벨, 서브헤딩 |
| Medium | 500 | 제품명, 가격 |
| Bold | 700 | 히어로 타이틀, 브랜드명 |

### 3-3. 타입 스케일

| 스타일 | 폰트 | 크기 | 웨이트 | Letter-spacing | Line-height |
|--------|------|------|--------|---------------|-------------|
| Hero XL | Clash Display | 120px | 700 | -0.04em | 0.9 |
| Hero | Clash Display | 80px | 700 | -0.035em | 0.92 |
| Display | Clash Display | 48px | 600 | -0.025em | 1.0 |
| H1 | Clash Display | 36px | 600 | -0.02em | 1.05 |
| H2 | Clash Display | 28px | 500 | -0.015em | 1.1 |
| H3 | Clash Display | 22px | 500 | -0.01em | 1.15 |
| Body LG | Inter | 18px | 400 | — | 1.65 |
| Body | Inter | 15px | 400 | — | 1.6 |
| Body SM | Inter | 13px | 400 | — | 1.55 |
| Label | Inter | 11px | 600 | +0.18em (UC) | — |
| Price | Clash Display | 24px | 500 | -0.01em (tabular) | — |

---

## 4. Spacing

> 4px 기반 단위. 컴포넌트에서 raw px 값 직접 사용 금지.

| 토큰 | 값 | 주요 용도 |
|------|----|----------|
| `--sp-1` | 4px | 최소 간격 |
| `--sp-2` | 8px | 아이콘·텍스트 간격 |
| `--sp-3` | 12px | 작은 내부 패딩 |
| `--sp-4` | 16px | 기본 gap |
| `--sp-5` | 20px | |
| `--sp-6` | 24px | |
| `--sp-8` | 32px | 수평 거터 |
| `--sp-10` | 40px | |
| `--sp-12` | 48px | |
| `--sp-16` | 64px | |
| `--sp-20` | 80px | 섹션 패딩 |
| `--sp-24` | 96px | 최대 여백 |

---

## 5. Layout & Breakpoints

| 이름 | 범위 | 특징 |
|------|------|------|
| Mobile | ≤ 809px | 단일 컬럼, 네비게이션 collapse, 제품 그리드 1열 |
| Tablet | 810px – 1199px | 2열 제품 그리드, 네비게이션 표시 |
| Desktop | ≥ 1200px | 3열 제품 그리드, 풀 레이아웃 |

- **컨테이너 최대 너비**: 1200px
- **수평 거터**: 32px (`--sp-8`)
- **컬럼 시스템**: `repeat(auto-fill, minmax(N, 1fr))` 패턴

---

## 6. Border Radius

| 토큰 | 값 | 용도 |
|------|----|------|
| `--r-sm` | 2px | 버튼, 작은 요소 |
| `--r-md` | 4px | 카드, 인풋 |
| `--r-lg` | 8px | 패널, 모달, 큰 컨테이너 |

---

## 7. Components

### Navigation Bar

```
배경: --c-espresso (#483f36)
브랜드명: Clash Display 18px / 700 / letter-spacing 0.05em / 색상 --c-cream
링크: Inter 11px / 500 / 0.14em UC / 기본색 --c-tan / 활성 --c-cream / 호버 --c-lime
```

### Buttons

| 변형 | 배경 | 텍스트 | 패딩 | Radius |
|------|------|--------|------|--------|
| Primary | `#000` | `#fff` | 14px 28px | `--r-sm` |
| Secondary | transparent | `--fg` | 13px 27px | `--r-sm` (border) |
| Accent | `--c-forest` | `--c-lime` | 14px 28px | `--r-sm` |
| Ghost | transparent | `--c-forest` | 12px 0 | 0 (border-bottom) |

공통: Inter 12px / 600 / 0.12em UC / transition `all 0.18s ease`

### Badges & Tags

| 변형 | 배경 | 텍스트 |
|------|------|--------|
| New | `--c-lime` | `--c-forest` |
| Sale | `--c-coral` | `#fff` |
| Gold | `--c-gold` | `--c-espresso` |
| Muted | `--bg-muted` | `--fg-muted` |

공통: Inter 10px / 600 / 0.14em UC / padding 4px 10px / border-radius 40px

### Product Card

```
카드: background --bg-surface / border 1px --border / border-radius --r-md
이미지 영역: aspect-ratio 3/4
카테고리: Inter 10px / 600 / 0.18em UC / --fg-subtle
제품명: Clash Display 15px / 500 / -0.01em / --fg
현재가: Clash Display 18px / 600 / tabular-nums
정가(취소선): Inter 12px / --fg-subtle
```

---

## 8. Motion

| 이름 | 값 | 용도 |
|------|-----|------|
| Default | `all 0.18s ease` | 버튼·링크 호버 |
| Fade In | `opacity 0.3s ease-out` | 콘텐츠 등장, 모달 |
| Slide Up | `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)` | 히어로 텍스트 (최초 로드만) |

> `prefers-reduced-motion: reduce` 적용 시 모든 transition 비활성화.

---

## 9. CSS 토큰 import

```css
/* src/styles/index.css */
@import './tokens.css';
```

전체 토큰 파일: [`src/styles/tokens.css`](../src/styles/tokens.css)  
시각 문서: [`docs/design-system.html`](./design-system.html)
