# 파일명 & 폴더 구조 컨벤션

프로젝트 전체의 일관성을 위한 파일명 및 폴더 구조 규칙입니다.

## 목차

- [핵심 원칙](#핵심-원칙)
- [파일명 규칙](#파일명-규칙)
- [엔티티 프리픽스 규칙](#엔티티-프리픽스-규칙)
- [폴더 구조 규칙](#폴더-구조-규칙)
- [레이어별 가이드](#레이어별-가이드)
- [실제 예시](#실제-예시)
- [새로운 기능 추가 시](#새로운-기능-추가-시)

---

## 핵심 원칙

### 우직실 (우아함, 직관성, 실용성)

1. **우아함**: 불필요한 중복 없이 깔끔한 구조
2. **직관성**: 파일명만 봐도 역할과 소속이 명확
3. **실용성**: IDE 검색, 복제, 유지보수에 유리

### 일관성 > 완벽함

- 프로젝트 전체가 하나의 패턴을 따르는 것이 중요
- 실무 표준(Next.js/React 커뮤니티)을 우선 참고
- 과도한 오버엔지니어링 지양

---

## 파일명 규칙

### 1. 기본 규칙: kebab-case

모든 파일명은 **kebab-case** (하이픈 구분)를 사용합니다.

\`\`\`
✅ sign-in-form.tsx
✅ use-mobile.ts
✅ app-header.tsx

❌ SignInForm.tsx (PascalCase)
❌ sign_in_form.tsx (snake_case)
❌ signInForm.tsx (camelCase)
\`\`\`

### 2. 파일 유형별 네이밍

| 파일 유형 | 규칙 | 예시 |
|----------|------|------|
| **UI 컴포넌트** | kebab-case | \`sign-in-form.tsx\`<br>\`item-sheet.tsx\` |
| **Hooks** | use-kebab-case | \`use-mobile.ts\`<br>\`use-query-params.ts\` |
| **Server Actions** | kebab-case | \`get-list.ts\`<br>\`sign-in.ts\` |
| **설정 파일** | config.ts | \`config.ts\` |
| **타입 파일** | types.ts | \`types.ts\` |
| **상수 파일** | constants.ts | \`constants.ts\` |
| **유틸리티** | utils.ts | \`utils.ts\` |

---

## 엔티티 프리픽스 규칙

### 원칙: "폴더가 엔티티를 나타내면 프리픽스 불필요"

#### ✅ 프리픽스 없음 (권장)

**조건**: 폴더 자체가 이미 엔티티를 명확히 나타낼 때

\`\`\`
auth/
├── config.ts          ← auth 폴더가 이미 엔티티
├── types.ts
└── utils.ts

notice/
├── config.ts          ← notice 폴더가 이미 엔티티
├── types.ts
└── list.tsx

shared/lib/excel/
├── types.ts           ← excel 폴더가 이미 엔티티
└── utils.ts
\`\`\`

**import 예시**:
\`\`\`typescript
import { config } from '@/features/auth/config'
import { types } from '@/features/notice/types'
import { utils } from '@/shared/lib/excel/utils'
\`\`\`

#### ⚠️ 프리픽스 사용 (특수한 경우)

**조건**: 여러 엔티티가 한 폴더에 섞일 때 (하지만 폴더 분리가 더 나은 해결책)

\`\`\`
lib/
├── auth.config.ts     ← 여러 config가 섞임
├── payment.config.ts
└── email.config.ts
\`\`\`

**더 나은 해결책**:
\`\`\`
lib/
├── auth/
│   └── config.ts      ← 폴더로 분리
├── payment/
│   └── config.ts
└── email/
    └── config.ts
\`\`\`

### IDE 검색 가이드

프리픽스 없이도 IDE fuzzy search로 충분히 찾을 수 있습니다.

\`\`\`bash
# VS Code Quick Open (Cmd/Ctrl + P)
"auth config"  → auth/config.ts
"notice types" → notice/types.ts
"au co"        → auth/config.ts (약어로도 검색)

# Symbol Search (Cmd/Ctrl + Shift + O)
"AuthConfig"   → 타입/변수 직접 검색
\`\`\`

---

## 폴더 구조 규칙

### 1. features 레이어

#### 템플릿 복제용 모듈 (manage-modules)

**구조**: 플랫 + actions 폴더

\`\`\`
manage-modules/notice/
├── actions/           ← actions만 폴더
│   ├── get-list.ts
│   ├── create-item.ts
│   └── ...
├── list.tsx           ← 나머지는 루트에 플랫
├── item-form.tsx
├── types.ts
├── config.ts
└── index.tsx
\`\`\`

**이유**:
- 템플릿 복제 시 파일명 변경 불필요
- 파일이 적어 플랫 구조가 직관적
- actions는 개수가 많아 폴더로 분리

#### 단독 기능 (auth)

**구조**: ui/, actions/ + 루트에 설정 파일

\`\`\`
auth/
├── ui/                ← UI 컴포넌트 분리
│   ├── sign-in-form.tsx
│   └── auth-layout.tsx
├── actions/           ← Server Actions 분리
│   ├── sign-in.ts
│   └── sign-out.ts
├── config.ts          ← 루트에 설정 파일들
├── types.ts
├── constants.ts
└── utils.ts
\`\`\`

**이유**:
- UI와 로직 파일이 명확히 구분됨
- 설정 파일들은 프리픽스 없이 루트에 위치
- UI가 2개뿐이라 ui/ 폴더로 분리

### 2. widgets 레이어

**구조**: 플랫 구조

\`\`\`
widgets/app-sidebar/
├── sidebar.tsx
├── types.ts
├── config.ts
├── nav-user.tsx
├── nav-menu.tsx
└── identity.tsx

widgets/app-breadcrumb/
├── breadcrumb.tsx
└── config.ts
\`\`\`

**이유**:
- widget은 독립적이고 파일 개수가 적음
- 플랫 구조가 더 직관적

### 3. shared 레이어

**구조**: 레이어 폴더 사용

\`\`\`
shared/
├── ui/                ← UI 컴포넌트들
│   ├── button.tsx
│   ├── form-fields/
│   └── editor/
├── lib/               ← 라이브러리 유틸리티
│   ├── excel/
│   ├── supabase/
│   └── utils/
├── hooks/             ← 커스텀 훅들
├── types/             ← 공통 타입들
└── schemas/           ← Zod 스키마들
\`\`\`

**이유**:
- 재사용 가능한 공통 모듈
- 파일이 많아 레이어 분리 필요
- 명확한 관심사 분리

---

## 레이어별 가이드

### features/

**특징**: 비즈니스 로직과 기능 단위

**구조 결정 기준**:
- 템플릿 복제 예정? → 플랫 + actions/ (manage-modules 패턴)
- 단독 기능? → ui/, actions/ + 루트 설정 파일 (auth 패턴)
- UI가 많음 (5개+)? → ui/ 폴더 사용
- UI가 적음 (2~3개)? → ui/ 폴더 유지 (명확한 분리)

**파일명**: 프리픽스 없음

\`\`\`
auth/config.ts         ✅
auth/auth.config.ts    ❌ (중복)
\`\`\`

### widgets/

**특징**: 복합 UI 위젯, 독립적 모듈

**구조**: 플랫 (폴더 없음)

**파일명**: 프리픽스 없음

\`\`\`
widgets/app-sidebar/
├── sidebar.tsx        ✅
├── types.ts           ✅
└── config.ts          ✅

widgets/app-sidebar/
├── app-sidebar.tsx    ❌ (엔티티 중복)
\`\`\`

### shared/

**특징**: 프로젝트 전역 재사용

**구조**: 레이어 폴더 (ui/, lib/, hooks/)

**파일명**:
- 일반 파일: kebab-case
- 하위 폴더: 프리픽스 없음

\`\`\`
shared/lib/excel/
├── types.ts           ✅
├── utils.ts           ✅

shared/lib/excel/
├── excel.types.ts     ❌ (중복)
\`\`\`

---

## 실제 예시

### auth 예시 (Before → After)

**Before**:
\`\`\`
auth/
├── ui/
│   └── sign-in-form.tsx
├── actions/
│   └── sign-in.ts
└── lib/
    ├── auth.handler.ts    ← 프리픽스 + 폴더
    ├── auth.config.ts
    ├── auth.types.ts
    └── auth.constants.ts
\`\`\`

**After**:
\`\`\`
auth/
├── ui/
│   └── sign-in-form.tsx
├── actions/
│   └── sign-in.ts
├── handler.ts            ← 프리픽스 제거, 루트 이동
├── config.ts
├── types.ts
└── constants.ts
\`\`\`

**import 변화**:
\`\`\`typescript
// Before
import { auth } from '@/features/auth/lib/auth.handler'
import type { AdminUser } from '@/features/auth/lib/auth.types'

// After
import { auth } from '@/features/auth/handler'
import type { AdminUser } from '@/features/auth/types'
\`\`\`

### widgets 예시 (Before → After)

**Before**:
\`\`\`
widgets/app-sidebar/
├── app-sidebar.tsx          ← 엔티티 프리픽스
├── app-sidebar.types.ts
├── app-sidebar.config.ts
├── app-sidebar-nav-user.tsx
└── app-sidebar-nav-menu.tsx
\`\`\`

**After**:
\`\`\`
widgets/app-sidebar/
├── sidebar.tsx              ← 프리픽스 제거
├── types.ts
├── config.ts
├── nav-user.tsx
└── nav-menu.tsx
\`\`\`

**import 변화**:
\`\`\`typescript
// Before
import { AppSidebar } from '@/widgets/app-sidebar/app-sidebar'
import type { MenuData } from '@/widgets/app-sidebar/app-sidebar.types'

// After
import { AppSidebar } from '@/widgets/app-sidebar/sidebar'
import type { MenuData } from '@/widgets/app-sidebar/types'
\`\`\`

---

## 새로운 기능 추가 시

### 1. features 추가

#### 템플릿 복제용 (CRUD 모듈)

manage-modules/notice를 복제하세요.

\`\`\`bash
# 1. notice 폴더 복제
cp -r src/features/manage-modules/notice src/features/manage-modules/products

# 2. 파일명은 그대로 (types.ts, config.ts 등)
# 3. 내용만 products에 맞게 수정
\`\`\`

**파일명**: 프리픽스 없음 유지

\`\`\`
products/
├── actions/
├── list.tsx
├── types.ts           ✅ (notice와 동일한 파일명)
├── config.ts          ✅
└── ...
\`\`\`

#### 단독 기능

auth 패턴을 따르세요.

\`\`\`
payment/
├── ui/                ← UI 컴포넌트 (있다면)
├── actions/           ← Server Actions
├── config.ts          ← 설정 파일들 (프리픽스 없음)
├── types.ts
└── utils.ts
\`\`\`

### 2. widgets 추가

플랫 구조 + 프리픽스 없음

\`\`\`
widgets/app-footer/
├── footer.tsx         ✅
├── types.ts           ✅
├── config.ts          ✅
└── social-links.tsx   ✅
\`\`\`

**❌ 하지 말 것**:
\`\`\`
widgets/app-footer/
├── app-footer.tsx     ❌ (엔티티 중복)
├── app-footer.types.ts ❌
\`\`\`

### 3. shared 추가

#### shared/lib 추가

폴더로 엔티티 표현 + 프리픽스 없음

\`\`\`
shared/lib/analytics/
├── types.ts           ✅
├── client.ts          ✅
└── utils.ts           ✅
\`\`\`

#### shared/ui 추가

Shadcn UI CLI 사용:

\`\`\`bash
npx shadcn@latest add component-name
\`\`\`

파일명은 자동으로 kebab-case로 생성됩니다.

---

## 체크리스트

새로운 파일/폴더 추가 시 확인하세요:

- [ ] 파일명이 kebab-case인가?
- [ ] 폴더가 엔티티를 나타내는가?
- [ ] 프리픽스가 중복되지 않는가?
- [ ] import 경로가 간결한가?
- [ ] 비슷한 기능의 기존 파일과 일관성이 있는가?

---

## 참고

### 왜 프리픽스를 제거했나?

1. **실무 표준**: Next.js/React 커뮤니티에서 일반적으로 사용하는 패턴
2. **간결함**: \`auth/config.ts\` > \`auth/auth.config.ts\`
3. **중복 제거**: 폴더명과 파일명에서 같은 단어 반복 방지
4. **IDE 검색**: fuzzy search로 충분히 찾을 수 있음
5. **일관성**: manage-modules(notice)와 패턴 통일

### IDE 검색 팁

**VS Code 예시**:

\`\`\`bash
# Quick Open (Cmd/Ctrl + P)
auth config        → auth/config.ts
sidebar types      → widgets/app-sidebar/types.ts

# Symbol Search (Cmd/Ctrl + Shift + O)
AuthConfig         → 타입 직접 검색
AdminUser          → 타입 직접 검색

# Recent Files (Cmd/Ctrl + E)
최근 작업 파일 빠른 전환
\`\`\`

### 기존 프로젝트 마이그레이션

프리픽스가 있는 기존 프로젝트를 마이그레이션하려면:

1. 파일 이름 변경 (git mv 사용)
2. import 경로 업데이트
3. TypeScript 타입 체크
4. 빌드 테스트

**참고 커밋**: \`f09c1e9\` - refactor: 파일명 컨벤션 통일 (엔티티 프리픽스 제거)

---

## 문의 및 개선

이 컨벤션은 프로젝트가 성장하면서 개선될 수 있습니다.
개선 제안이 있다면 팀과 논의 후 이 문서를 업데이트하세요.

**우직실 원칙을 항상 기억하세요: 우아함, 직관성, 실용성**
