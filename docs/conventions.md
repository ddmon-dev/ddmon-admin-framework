# 프로젝트 구조 & 컨벤션

프로젝트의 아키텍처와 코딩 컨벤션을 정의합니다.

## 목차

- [프로젝트 아키텍처](#프로젝트-아키텍처)
- [핵심 원칙](#핵심-원칙)
- [파일명 규칙](#파일명-규칙)
- [엔티티 프리픽스 규칙](#엔티티-프리픽스-규칙)
- [폴더 구조 규칙](#폴더-구조-규칙)
- [레이어별 가이드](#레이어별-가이드)
- [실제 예시](#실제-예시)
- [새로운 기능 추가 시](#새로운-기능-추가-시)

---

## 프로젝트 아키텍처

Admin Template은 **FSD (Feature-Sliced Design)** 아키텍처를 따릅니다.

### FSD 레이어

**app/** - 라우팅 레이어
Next.js App Router로 페이지 구성과 라우팅만 담당합니다.

```
app/
├── (auth)/              # 인증 페이지 (레이아웃 없음)
├── (protected)/         # 보호된 페이지 (Sidebar + Header)
└── unauthorized/
```

**features/** - 기능 레이어
비즈니스 로직과 기능 단위 모듈입니다.

```
features/
├── auth/                # 인증 시스템
└── manage-modules/      # CRUD 모듈 시스템
```

**widgets/** - 위젯 레이어
복합 UI 위젯, 독립적으로 동작하는 모듈입니다.

```
widgets/
├── app-sidebar/
├── app-breadcrumb/
└── app-header/
```

**shared/** - 공유 레이어
프로젝트 전역에서 재사용되는 리소스입니다.

```
shared/
├── ui/                  # UI 컴포넌트 (Shadcn UI)
├── lib/                 # 도메인 라이브러리
├── utils/               # 범용 유틸리티
├── hooks/
├── types/
└── schemas/
```

### 레이어 선택 가이드

| 특징             | 레이어    |
| ---------------- | --------- |
| 라우팅만         | app/      |
| 비즈니스 로직    | features/ |
| 복합 UI 위젯     | widgets/  |
| 재사용 가능      | shared/   |

**원칙:**
- 비즈니스 로직은 features/
- 페이지는 app/에서 features/ 조합
- widgets/는 독립적으로 동작
- shared/는 레이어 무관하게 사용

### Path Alias

`@/*` = `./src/*`

```typescript
import { Button } from '@/shared/ui/button';
import { auth } from '@/features/auth';
import { AppSidebar } from '@/widgets/app-sidebar/sidebar';
```

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

```
✅ sign-in-form.tsx
✅ use-mobile.ts
✅ app-header.tsx

❌ SignInForm.tsx (PascalCase)
❌ sign_in_form.tsx (snake_case)
❌ signInForm.tsx (camelCase)
```

### 2. 파일 유형별 네이밍

| 파일 유형          | 규칙           | 예시                                         |
| ------------------ | -------------- | -------------------------------------------- |
| **UI 컴포넌트**    | kebab-case     | \`sign-in-form.tsx\`<br>\`item-sheet.tsx\`   |
| **Hooks**          | use-kebab-case | \`use-mobile.ts\`<br>\`use-query-params.ts\` |
| **Server Actions** | kebab-case     | \`get-list.ts\`<br>\`sign-in.ts\`            |
| **설정 파일 (도메인)** | config.ts      | \`config.ts\`                                |
| **설정 파일 (루트)**   | *.config.ts    | \`app.config.ts\`, \`next.config.ts\`        |
| **타입 파일**      | types.ts       | \`types.ts\`                                 |
| **상수 파일**      | constants.ts   | \`constants.ts\`                             |
| **유틸리티**       | utils.ts       | \`utils.ts\`                                 |

### 3. 설정 파일 패턴

| 레벨 | 패턴 | 예시 |
|------|------|------|
| **루트 레벨** | \`*.config.ts\` | \`app.config.ts\`, \`next.config.ts\` |
| **도메인 레벨** | \`config.ts\` | \`features/auth/config.ts\` |

**원칙**:
- 루트 레벨 설정 파일은 \`.config.ts\` 패턴으로 역할을 명확히 표현
- 도메인 레벨은 폴더명이 컨텍스트를 제공하므로 \`config.ts\`로 충분

---

## 엔티티 프리픽스 규칙

### 원칙: "폴더가 엔티티를 나타내면 프리픽스 불필요"

#### ✅ 프리픽스 없음 (권장)

**조건**: 폴더 자체가 이미 엔티티를 명확히 나타낼 때

```
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
```

**import 예시**:

```typescript
import { config } from '@/features/auth/config';
import { types } from '@/features/notice/types';
import { utils } from '@/shared/lib/excel/utils';
```

#### ⚠️ 프리픽스 사용 (특수한 경우)

**조건**: 여러 엔티티가 한 폴더에 섞일 때 (하지만 폴더 분리가 더 나은 해결책)

```
lib/
├── auth.config.ts     ← 여러 config가 섞임
├── payment.config.ts
└── email.config.ts
```

**더 나은 해결책**:

```
lib/
├── auth/
│   └── config.ts      ← 폴더로 분리
├── payment/
│   └── config.ts
└── email/
    └── config.ts
```

### IDE 검색 가이드

프리픽스 없이도 IDE fuzzy search로 충분히 찾을 수 있습니다.

```bash
# VS Code Quick Open (Cmd/Ctrl + P)
"auth config"  → auth/config.ts
"notice types" → notice/types.ts
"au co"        → auth/config.ts (약어로도 검색)

# Symbol Search (Cmd/Ctrl + Shift + O)
"AuthConfig"   → 타입/변수 직접 검색
```

---

## 폴더 구조 규칙

### 1. features 레이어

#### 템플릿 복제용 모듈 (manage-modules)

**구조**: 플랫 + actions 폴더

```
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
```

**이유**:

- 템플릿 복제 시 파일명 변경 불필요
- 파일이 적어 플랫 구조가 직관적
- actions는 개수가 많아 폴더로 분리

#### 단독 기능 (auth)

**구조**: ui/, actions/ + 루트에 설정 파일

```
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
```

**이유**:

- UI와 로직 파일이 명확히 구분됨
- 설정 파일들은 프리픽스 없이 루트에 위치
- UI가 2개뿐이라 ui/ 폴더로 분리

### 2. widgets 레이어

**구조**: 플랫 구조

```
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
```

**이유**:

- widget은 독립적이고 파일 개수가 적음
- 플랫 구조가 더 직관적

### 3. shared 레이어

**구조**: 레이어 폴더 사용

```
shared/
├── ui/                ← UI 컴포넌트들
│   ├── button.tsx
│   ├── form-fields/
│   └── editor/
├── lib/               ← 도메인 라이브러리
│   ├── excel/
│   ├── supabase/
│   └── file-system/
├── utils/             ← 범용 유틸리티
│   ├── objects/
│   └── date/
├── hooks/             ← 커스텀 훅들
├── types/             ← 공통 타입들
└── schemas/           ← Zod 스키마들
```

**이유**:

- 재사용 가능한 공통 모듈
- 파일이 많아 레이어 분리 필요
- 명확한 관심사 분리

### 4. lib vs utils 구분

**원칙**: 도메인 로직과 범용 유틸리티를 명확히 분리

#### lib/ - 도메인 로직

특정 도메인이나 라이브러리에 의존적인 코드입니다.

**특징**:
- 외부 서비스 클라이언트 (Supabase, Stripe 등)
- 도메인 비즈니스 로직 (인증, 세션 관리)
- 프로젝트 내부 의존성 있음
- 테스트 시 모킹 필요할 수 있음

**예시**:
```typescript
// features/auth/lib/session.ts
import { auth } from '../handler';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const session = await auth(); // auth()에 의존
  if (!session) redirect('/auth/sign-in'); // Next.js 의존
  return session.user;
}
```

#### utils/ - 범용 유틸리티

도메인 독립적인 순수 헬퍼 함수입니다.

**특징**:
- 데이터 변환 (객체, 날짜, 문자열)
- 암호화/검증 (password hash)
- 외부 의존성 최소
- 순수 함수 (같은 입력 → 같은 출력)
- 테스트 쉬움
- 어디서든 재사용 가능

**예시**:
```typescript
// features/auth/utils/password.ts
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10); // 순수 함수, bcrypt만 의존
}
```

#### 구조 예시

**shared 레벨**:
```
shared/
├── lib/               # 도메인 라이브러리
│   ├── supabase/      # DB 클라이언트 (도메인)
│   └── file-system/   # 파일 시스템 (도메인)
└── utils/             # 범용 유틸리티
    ├── objects/       # 객체 변환 (범용)
    └── date/          # 날짜 포맷 (범용)
```

**features 레벨**:
```
features/auth/
├── lib/               # 인증 도메인 로직
│   ├── session.ts     # auth()에 의존, redirect 사용
│   └── assert.ts      # 권한 체크, throw
└── utils/             # 인증 범용 헬퍼
    └── password.ts    # bcrypt만 의존, 순수 함수
```

#### 판단 기준

| 질문                          | lib/ | utils/ |
| ----------------------------- | ---- | ------ |
| 다른 도메인에서 재사용 가능?  | ❌   | ✅     |
| 순수 함수인가?                | 보통 아님 | 주로 그럼 |
| 외부 의존성이 많은가?         | 많음 | 적음   |
| 모킹 없이 테스트 가능?        | 어려움 | 쉬움   |

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

```
auth/config.ts         ✅
auth/auth.config.ts    ❌ (중복)
```

### widgets/

**특징**: 복합 UI 위젯, 독립적 모듈

**구조**: 플랫 (폴더 없음)

**파일명**: 프리픽스 없음

```
widgets/app-sidebar/
├── sidebar.tsx        ✅
├── types.ts           ✅
└── config.ts          ✅

widgets/app-sidebar/
├── app-sidebar.tsx    ❌ (엔티티 중복)
```

### shared/

**특징**: 프로젝트 전역 재사용

**구조**: 레이어 폴더 (ui/, lib/, hooks/)

**파일명**:

- 일반 파일: kebab-case
- 하위 폴더: 프리픽스 없음

```
shared/lib/excel/
├── types.ts           ✅
├── client.ts          ✅

shared/lib/excel/
├── excel.types.ts     ❌ (중복)
```

---

## 실제 예시

### auth 예시 (Before → After)

**Before**:

```
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
```

**After**:

```
auth/
├── ui/
│   └── sign-in-form.tsx
├── actions/
│   └── sign-in.ts
├── handler.ts            ← 프리픽스 제거, 루트 이동
├── config.ts
├── types.ts
└── constants.ts
```

**import 변화**:

```typescript
// Before
import { auth } from '@/features/auth/lib/auth.handler';
import type { AdminUser } from '@/features/auth/lib/auth.types';

// After
import { auth } from '@/features/auth/handler';
import type { AdminUser } from '@/features/auth/types';
```

### widgets 예시 (Before → After)

**Before**:

```
widgets/app-sidebar/
├── app-sidebar.tsx          ← 엔티티 프리픽스
├── app-sidebar.types.ts
├── app-sidebar.config.ts
├── app-sidebar-nav-user.tsx
└── app-sidebar-nav-menu.tsx
```

**After**:

```
widgets/app-sidebar/
├── sidebar.tsx              ← 프리픽스 제거
├── types.ts
├── config.ts
├── nav-user.tsx
└── nav-menu.tsx
```

**import 변화**:

```typescript
// Before
import { AppSidebar } from '@/widgets/app-sidebar/app-sidebar';
import type { MenuData } from '@/widgets/app-sidebar/app-sidebar.types';

// After
import { AppSidebar } from '@/widgets/app-sidebar/sidebar';
import type { MenuData } from '@/widgets/app-sidebar/types';
```

---

## 새로운 기능 추가 시

### 1. features 추가

#### 템플릿 복제용 (CRUD 모듈)

manage-modules/notice를 복제하세요.

```bash
# 1. notice 폴더 복제
cp -r src/features/manage-modules/notice src/features/manage-modules/products

# 2. 파일명은 그대로 (types.ts, config.ts 등)
# 3. 내용만 products에 맞게 수정
```

**파일명**: 프리픽스 없음 유지

```
products/
├── actions/
├── list.tsx
├── types.ts           ✅ (notice와 동일한 파일명)
├── config.ts          ✅
└── ...
```

#### 단독 기능

auth 패턴을 따르세요.

```
payment/
├── ui/                ← UI 컴포넌트 (있다면)
├── actions/           ← Server Actions
├── config.ts          ← 설정 파일들 (프리픽스 없음)
├── types.ts
└── utils.ts
```

### 2. widgets 추가

플랫 구조 + 프리픽스 없음

```
widgets/app-footer/
├── footer.tsx         ✅
├── types.ts           ✅
├── config.ts          ✅
└── social-links.tsx   ✅
```

**❌ 하지 말 것**:

```
widgets/app-footer/
├── app-footer.tsx     ❌ (엔티티 중복)
├── app-footer.types.ts ❌
```

### 3. shared 추가

#### shared/lib 추가

폴더로 엔티티 표현 + 프리픽스 없음

```
shared/lib/analytics/
├── types.ts           ✅
└── client.ts          ✅

shared/utils/formatting/
├── currency.ts        ✅
└── number.ts          ✅
```

#### shared/ui 추가

Shadcn UI CLI 사용:

```bash
npx shadcn@latest add component-name
```

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

```bash
# Quick Open (Cmd/Ctrl + P)
auth config        → auth/config.ts
sidebar types      → widgets/app-sidebar/types.ts

# Symbol Search (Cmd/Ctrl + Shift + O)
AuthConfig         → 타입 직접 검색
AdminUser          → 타입 직접 검색

# Recent Files (Cmd/Ctrl + E)
최근 작업 파일 빠른 전환
```

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
