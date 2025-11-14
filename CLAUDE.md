# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Admin Template은 Next.js 16 기반의 관리자 대시보드 템플릿입니다. **FSD (Feature-Sliced Design)** 아키텍처 패턴을 따르며, 확장 가능하고 유지보수가 용이한 구조를 제공합니다.

### 핵심 원칙: 우직실 (우아함, 직관성, 실용성)
- **우아함**: 불필요한 복잡성 없이 깔끔한 구조
- **직관성**: 누가 봐도 바로 이해되는 명확한 코드
- **실용성**: 과도한 추상화보다 실제 개발과 유지보수에 도움되는 구조
- **오버엔지니어링 금지**: 컨텍스트와 상황에 맞는 적절한 수준의 개발

## 기술 스택

### Core
- **Framework**: Next.js 16.0.3 (App Router)
- **React**: 19.2.0 (React Compiler 활성화)
- **Language**: TypeScript (Strict Mode)
- **Node.js**: 24.3.0
- **Package Manager**: Yarn

### Styling & UI
- **CSS Framework**: Tailwind CSS V4 (PostCSS 플러그인)
- **UI Library**: Shadcn UI (New York 스타일, CSS Variables)
- **Icons**: Lucide React
- **Theme**: next-themes (다크모드 지원)

### Forms & Validation
- **Form**: React Hook Form
- **Validation**: Zod

### Fonts
- **영문**: Poppins (Google Fonts)
- **한글**: Pretendard (Local Fonts)

## 프로젝트 구조 (FSD 레이어)

```
src/
├── app/                      # Next.js App Router (라우팅 레이어)
│   ├── (auth)/              # 인증 라우트 그룹 (레이아웃 없음)
│   │   └── auth/
│   │       ├── sign-in/
│   │       ├── sign-up/
│   │       └── forgot-password/
│   ├── (protected)/         # 보호된 라우트 (Sidebar + Header + Breadcrumb)
│   │   ├── settings/
│   │   └── page.tsx
│   ├── unauthorized/        # 권한 없음 페이지
│   ├── layout.tsx          # Root 레이아웃
│   └── globals.css         # 글로벌 스타일
│
├── features/                # 기능 레이어 (비즈니스 로직)
│   └── auth/
│       └── ui/             # 인증 관련 UI 컴포넌트
│           ├── sign-in-form.tsx
│           ├── sign-up-form.tsx
│           └── forgot-password-form.tsx
│
├── widgets/                 # 위젯 레이어 (복합 UI 위젯)
│   ├── app-sidebar/        # 사이드바 (메뉴, 유저 정보)
│   │   ├── app-sidebar.tsx
│   │   ├── nav-main.tsx
│   │   ├── nav-user.tsx
│   │   └── team-switcher.tsx
│   ├── app-breadcrumb/     # 브레드크럼
│   │   └── app-breadcrumb.tsx
│   └── app-header.tsx      # 헤더
│
├── entities/                # 엔티티 레이어 (비즈니스 엔티티)
│                           # 향후 사용 예정
│
├── shared/                  # 공유 레이어
│   ├── ui/                 # 재사용 가능한 UI 컴포넌트 (59개)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ... (56개 추가)
│   ├── utils/              # 유틸리티 함수
│   │   └── cn.ts
│   └── hooks/              # 커스텀 훅
│       └── use-mobile.tsx
│
├── fonts/                   # 커스텀 폰트
│   └── PretendardVariable.woff2
│
└── mocks/                   # Mock 데이터 (향후 사용)
```

### FSD 레이어 설명

1. **app/**: Next.js App Router 라우팅
   - 페이지 구성과 라우팅만 담당
   - 비즈니스 로직은 features/로 분리

2. **features/**: 기능별 비즈니스 로직
   - 특정 기능(인증, 결제 등)의 로직과 UI
   - 독립적으로 재사용 가능한 기능 단위

3. **widgets/**: 복합 UI 위젯
   - 여러 컴포넌트를 조합한 복합 위젯
   - 예: Sidebar, Header, Breadcrumb

4. **entities/**: 비즈니스 엔티티
   - 도메인 모델 (User, Product 등)
   - 향후 사용 예정

5. **shared/**: 공유 리소스
   - UI 컴포넌트, 유틸리티, 훅 등
   - 프로젝트 전역에서 재사용

## 라우팅 패턴

### Route Groups
Next.js의 Route Groups를 사용하여 레이아웃을 구분합니다.

1. **(auth)**: 인증 페이지
   - 경로: `/auth/sign-in`, `/auth/sign-up`, `/auth/forgot-password`
   - 레이아웃: 없음 (인증 페이지용 깔끔한 UI)

2. **(protected)**: 보호된 페이지
   - 경로: `/`, `/settings`
   - 레이아웃: Sidebar + Header + Breadcrumb
   - 인증이 필요한 모든 페이지

3. **unauthorized**: 권한 없음
   - 경로: `/unauthorized`
   - 권한이 없는 사용자에게 표시

## 개발 워크플로우

### 개발 명령어

```bash
# 개발 서버 실행 (http://localhost:3000)
yarn dev

# 프로덕션 빌드
yarn build

# 프로덕션 서버 실행
yarn start

# ESLint 실행
yarn lint
```

### Claude Code용 빌드
Claude Code에서 빌드 시 `.next-claude` 디렉토리를 사용합니다.

```bash
# Claude Code 전용 빌드
IS_CLAUDE=1 yarn build
```

이는 `next.config.ts`에서 다음과 같이 설정됩니다:
```typescript
{
  distDir: process.env.IS_CLAUDE ? '.next-claude' : undefined
}
```

`.gitignore`에 `/.next-claude/`가 추가되어 있습니다.

## UI 컴포넌트 가이드

### Shadcn UI (59개 컴포넌트)
모든 UI 컴포넌트는 `/src/shared/ui/`에 위치합니다.

#### 주요 카테고리

**Form 관련**
- button, input, textarea, select, checkbox, radio-group
- form, label, switch, slider
- date-picker, calendar

**Layout**
- card, container, separator, sidebar
- resizable, scroll-area

**Feedback**
- alert, alert-dialog, dialog, drawer
- toast, sonner, popover, tooltip

**Data Display**
- table, chart, avatar, badge
- collapsible, accordion, tabs

**Navigation**
- breadcrumb, dropdown-menu, menubar
- navigation-menu, pagination

### 사용 예시

```typescript
// 컴포넌트 import
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card } from '@/shared/ui/card';

// 사용
<Button variant="default">클릭</Button>
<Input type="email" placeholder="이메일" />
<Card>...</Card>
```

## 코딩 컨벤션

### 파일 및 폴더 네이밍
- **kebab-case** 사용
- 컴포넌트 파일: `user-profile.tsx`
- 페이지 폴더: `user-settings/`
- 유틸리티 파일: `format-date.ts`

### 코드 네이밍
- **컴포넌트**: PascalCase (`UserProfile`)
- **함수/변수**: camelCase (`getUserData`)
- **상수**: SCREAMING_SNAKE_CASE (`API_BASE_URL`)
- **타입/인터페이스**: PascalCase (`UserData`, `ApiResponse`)

### Git 컨벤션

#### 커밋 메시지
```
타입: 제목

본문 (선택사항)
```

**타입 분류**:
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 코드 개선 및 리팩토링
- `docs`: 문서 관련 변경
- `style`: 코드 포맷팅
- `test`: 테스트 추가 또는 수정
- `chore`: 빌드, 설정 파일 변경

#### 브랜치 전략
- **`main`**: 프로덕션 배포 브랜치
- **`dev`**: 개발 브랜치 (기본 작업 브랜치)
- **`feat/*`**: 기능 개발 브랜치
- **`hotfix/*`**: 긴급 수정 브랜치

## 설정 파일

### next.config.ts
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.IS_CLAUDE ? '.next-claude' : undefined,
  experimental: {
    reactCompiler: true, // React Compiler 활성화
  },
};

export default nextConfig;
```

### tsconfig.json
- Strict mode 활성화
- Path alias: `@/*` → `./src/*`
- 모든 TypeScript strict 옵션 활성화

### components.json (Shadcn UI)
```json
{
  "style": "new-york",       // UI 스타일
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",  // 기본 색상
    "cssVariables": true     // CSS Variables 사용
  },
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/shared/utils",
    "ui": "@/shared/ui",
    "lib": "@/shared/utils",
    "hooks": "@/shared/hooks"
  }
}
```

### Tailwind CSS V4
- PostCSS 플러그인 방식
- CSS Variables 기반 테마
- `globals.css`에서 @import로 설정

## 새로운 기능 추가 시

### 1. features/ 레이어에 기능 추가
```typescript
// src/features/feature-name/ui/component-name.tsx
export function ComponentName() {
  // 기능별 비즈니스 로직과 UI
}
```

### 2. widgets/ 레이어에 복합 위젯 추가
```typescript
// src/widgets/widget-name/widget-name.tsx
export function WidgetName() {
  // 여러 컴포넌트를 조합한 위젯
}
```

### 3. app/ 라우팅 추가
```typescript
// src/app/(protected)/new-page/page.tsx
export default function NewPage() {
  // 페이지 구성 (비즈니스 로직은 features/에서 import)
}
```

### 4. shared/ UI 컴포넌트 추가
Shadcn UI CLI 사용:
```bash
npx shadcn@latest add component-name
```

## 주요 의존성

### 프로덕션 의존성
- `next`: 16.0.3
- `react`, `react-dom`: 19.2.0
- `@hookform/resolvers`: 3.9.1
- `react-hook-form`: 7.54.2
- `zod`: 3.24.1
- `tailwindcss`: 4.0.12
- `lucide-react`: 0.469.0
- `next-themes`: 0.4.6

### 개발 의존성
- `typescript`: 5.7.2
- `eslint`: 9.18.0
- `@eslint/eslintrc`: 3.2.0

## 중요 참고사항

1. **React Compiler 활성화**: Next.js 16에서 React Compiler가 활성화되어 있으므로, 불필요한 `useMemo`, `useCallback` 사용을 지양합니다.

2. **Tailwind V4**: V4는 PostCSS 플러그인 방식이므로, `tailwind.config.ts`보다 `globals.css`에서 설정을 관리합니다.

3. **FSD 패턴 준수**: 새로운 코드 추가 시 반드시 적절한 레이어(features, widgets, shared)에 배치합니다.

4. **경로 alias**: `@/`로 시작하는 경로는 `src/`를 가리킵니다.

5. **우직실 원칙**: 우아하고, 직관적이며, 실용적인 코드를 작성합니다. 오버엔지니어링을 지양합니다.
