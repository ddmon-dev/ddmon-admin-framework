# 프로젝트 아키텍처

Admin Template은 **FSD (Feature-Sliced Design)** 아키텍처를 따릅니다.

## FSD 레이어

### app/ - 라우팅 레이어
Next.js App Router로 페이지 구성과 라우팅만 담당합니다.

```
app/
├── (auth)/              # 인증 페이지 (레이아웃 없음)
│   └── auth/
│       ├── sign-in/
│       ├── sign-up/
│       └── forgot-password/
├── (protected)/         # 보호된 페이지 (Sidebar + Header)
│   ├── settings/
│   └── page.tsx
├── unauthorized/
├── layout.tsx
└── globals.css
```

**Route Groups:**
- `(auth)`: 인증 페이지, 레이아웃 없음
- `(protected)`: 인증 필요, Sidebar + Header + Breadcrumb
- `unauthorized`: 권한 없음 페이지

### features/ - 기능 레이어
비즈니스 로직과 기능 단위 모듈입니다.

```
features/
├── auth/
│   ├── ui/              # 인증 관련 UI
│   ├── actions/         # Server Actions
│   ├── config.ts
│   └── types.ts
└── manage-modules/      # CRUD 모듈 시스템
    ├── _base/           # 공통 인프라
    ├── _template/       # 템플릿
    └── notice/          # 실제 구현
```

**구조 패턴:**
- **단독 기능** (auth): ui/, actions/ + 루트 설정 파일
- **CRUD 모듈** (manage-modules): 플랫 구조 + actions/ 폴더

### widgets/ - 위젯 레이어
복합 UI 위젯, 여러 컴포넌트를 조합한 독립 모듈입니다.

```
widgets/
├── app-sidebar/         # 사이드바
├── app-breadcrumb/      # 브레드크럼
└── app-header/          # 헤더
```

**특징:**
- 플랫 구조 (폴더 분리 없음)
- 독립적으로 동작

### shared/ - 공유 레이어
프로젝트 전역에서 재사용되는 리소스입니다.

```
shared/
├── ui/                  # UI 컴포넌트 (59개 - Shadcn UI)
├── lib/                 # 라이브러리 유틸리티
│   ├── excel/
│   ├── supabase/
│   └── utils/
├── hooks/               # 커스텀 훅
├── types/               # 공통 타입
└── schemas/             # Zod 스키마
```

## 새로운 기능 추가

### 1. 새 페이지 추가

```typescript
// app/(protected)/products/page.tsx
import { ProductList } from '@/features/products';

export default async function ProductsPage() {
  return <ProductList />;
}
```

**Route Groups 선택:**
- 인증 불필요: `app/(auth)/` 또는 루트
- 인증 필요: `app/(protected)/`

### 2. 새 기능 추가 (features/)

#### CRUD 모듈
템플릿 복사:

```bash
cp -r src/features/manage-modules/_template src/features/manage-modules/products
```

자세한 내용: [manage-modules.md](manage-modules.md)

#### 단독 기능

```
features/payment/
├── ui/                  # UI 컴포넌트
├── actions/             # Server Actions
├── config.ts            # 설정
└── types.ts             # 타입
```

### 3. 새 위젯 추가 (widgets/)

```
widgets/app-footer/
├── footer.tsx           # 메인 컴포넌트
├── social-links.tsx
├── types.ts
└── config.ts
```

플랫 구조 유지, 파일명에 프리픽스 불필요.

### 4. 공통 컴포넌트 추가 (shared/)

Shadcn UI CLI 사용:

```bash
npx shadcn@latest add component-name
```

또는 수동 생성:

```
shared/lib/analytics/
├── client.ts
├── types.ts
└── utils.ts
```

## 레이어 선택 가이드

| 특징 | 레이어 |
|------|--------|
| 라우팅만 | app/ |
| 비즈니스 로직 | features/ |
| 복합 UI 위젯 | widgets/ |
| 재사용 가능 | shared/ |

**원칙:**
- 비즈니스 로직은 features/
- 페이지는 app/에서 features/ 조합
- widgets/는 독립적으로 동작
- shared/는 레이어 무관하게 사용

## Path Alias

`@/*` = `./src/*`

```typescript
import { Button } from '@/shared/ui/button';
import { auth } from '@/features/auth/actions/sign-in';
import { AppSidebar } from '@/widgets/app-sidebar/sidebar';
```

## 참고

- 파일명 & 폴더 규칙: [conventions.md](conventions.md)
- manage-modules 시스템: [manage-modules.md](manage-modules.md)
