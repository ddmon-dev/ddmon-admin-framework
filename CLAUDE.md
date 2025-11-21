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

## manage-modules Feature (CRUD 모듈 시스템)

### 개요

`manage-modules`는 데이터 관리 기능(CRUD)을 위한 재사용 가능한 모듈 시스템입니다. 공통 인프라(`_base`)와 구체적 구현(예: `notice`)으로 분리되어 있으며, 새로운 관리 모듈을 빠르게 추가할 수 있는 구조입니다.

**위치**: `/src/features/manage-modules/`

### 아키텍처

```
src/features/manage-modules/
├── _base/                    # 공통 인프라 레이어
│   ├── components/           # 재사용 가능한 공통 컴포넌트
│   │   ├── manage-module-container.tsx
│   │   ├── manage-sheet.tsx          # Context & Sheet UI
│   │   ├── create-button.tsx
│   │   ├── modify-button.tsx
│   │   ├── soft-delete-button.tsx
│   │   └── hard-delete-button.tsx
│   ├── utils/
│   │   └── db-operations.ts          # DB 유틸리티 (Soft/Hard Delete)
│   ├── types.ts                       # 공통 타입 정의
│   └── config.ts                      # 기본 설정
│
└── notice/                   # 구체적 구현 (공지사항 모듈)
    ├── actions/              # Server Actions
    │   ├── get-list.ts
    │   ├── get-item.ts
    │   ├── create-item.ts
    │   ├── update-item.ts
    │   └── delete-item.ts
    ├── list.tsx              # 목록 컴포넌트
    ├── list-columns.tsx      # 테이블 컬럼 정의
    ├── list-filters.tsx      # 필터 UI
    ├── item-form.tsx         # 항목 폼 (생성/수정)
    ├── item-sheet.tsx        # Sheet 컨테이너
    ├── delete-item-button.tsx
    ├── config.ts             # 모듈별 설정
    ├── types.ts              # 모듈별 타입
    └── index.ts              # 공개 API
```

### 핵심 패턴

#### 1. Context 기반 상태 관리

`ManageSheetContext`를 통해 시트 상태를 전역으로 관리합니다.

```typescript
// _base/components/manage-sheet.tsx
type ManageSheetData = {
  id?: string;
  mode: 'view' | 'modify' | 'create';
};

// 사용 예시
const { openManageSheet, closeManageSheet } = useManageSheet();
openManageSheet({ id: '123', mode: 'modify' });
```

**장점**:
- Props Drilling 제거
- 어디서든 시트 열기/닫기 가능
- 명확한 상태 관리

#### 2. Delete 이원화

데이터 삭제를 Soft Delete와 Hard Delete로 분리하여 관리합니다.

```typescript
// Soft Delete: deleted 컬럼만 업데이트 (복구 가능)
<SoftDeleteButton onDelete={handleSoftDelete} />

// Hard Delete: 실제 데이터 삭제 (복구 불가)
<HardDeleteButton onDelete={handleHardDelete} />
```

**구현**:
```typescript
// _base/utils/db-operations.ts
export async function softDelete(tableName: TableName, id: string) {
  const { data, error } = await supabase
    .from(tableName)
    .update({ deleted: true })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}
```

#### 3. Server Actions 패턴

모든 DB 작업은 Server Actions로 처리하며, 일관된 응답 형식을 유지합니다.

```typescript
// 응답 형식
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// 구현 예시
export async function createItem({
  values,
  path
}: {
  values: CreateItemValues;
  path?: string;
}): Promise<ActionResult<ItemDTO>> {
  try {
    // 1. DB 작업
    const { data, error } = await supabase
      .from(tableName)
      .insert(transformCamelToSnake(values))
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 2. 경로 재검증
    if (path) revalidatePath(path);

    // 3. 타입 변환 (snake_case → camelCase)
    return { success: true, data: transformSnakeToCamel(data) };
  } catch (error) {
    return { success: false, error: '생성 실패' };
  }
}
```

**주요 특징**:
- snake_case (DB) ↔ camelCase (Frontend) 자동 변환
- 선택적 경로 재검증 (`revalidatePath`)
- 타입 안전성 보장

#### 4. 에러 처리 패턴

**try-catch-finally** 구조로 안전하게 에러를 처리합니다.

```typescript
// 버튼 컴포넌트
const handleClick = async () => {
  setIsLoading(true);
  try {
    await onDelete();
    alert('삭제되었습니다.');
  } catch (error) {
    console.error(error);
    alert('삭제 실패');
  } finally {
    setIsLoading(false); // 항상 실행
  }
};

// Server Action 호출 컴포넌트
const handleDelete = async () => {
  const { success, error } = await deleteItem({ id, path });

  if (!success) {
    throw new Error(error || '삭제 실패'); // 에러 전파
  }
};
```

**흐름**:
1. Server Action에서 `success: false` 반환
2. 호출 컴포넌트에서 `throw Error`
3. 버튼 컴포넌트의 `catch` 블록에서 처리
4. `finally` 블록에서 항상 로딩 상태 해제

### 데이터 흐름

#### 생성 (Create)
```
CreateButton 클릭
  ↓
openManageSheet({ mode: 'create' })
  ↓
ItemSheet 렌더 (mode === 'create')
  ↓
ItemForm 제출
  ↓
createItem({ values, path })
  ↓
Supabase INSERT
  ↓
revalidatePath(path)
  ↓
성공 메시지 표시
```

#### 수정 (Update)
```
ModifyButton 클릭
  ↓
openManageSheet({ id, mode: 'modify' })
  ↓
ItemSheet useEffect → getItem({ id })
  ↓
ItemForm.reset(prevValues)
  ↓
ItemForm 제출
  ↓
updateItem({ id, values, path })
  ↓
Supabase UPDATE
  ↓
revalidatePath(path)
  ↓
성공 메시지 표시
```

#### 삭제 (Delete)
```
DeleteItemButton 클릭
  ↓
SoftDeleteButton.handleClick
  ↓
deleteItem({ id, path })
  ↓
softDelete(tableName, id)
  ↓
Supabase UPDATE deleted = true
  ↓
revalidatePath(path)
  ↓
성공 메시지 표시
```

### 새로운 모듈 추가 방법

새로운 관리 모듈(예: `products`)을 추가하는 단계입니다.

#### 1. 디렉토리 생성
```bash
mkdir -p src/features/manage-modules/products/actions
```

#### 2. 설정 파일 작성

**config.ts**
```typescript
export const PRODUCT_CONFIG = {
  tableName: 'products',
  categoryOptions: [
    { label: '전자제품', value: 'electronics' },
    { label: '의류', value: 'clothing' },
  ],
} as const;
```

**types.ts**
```typescript
import type { BaseRowData, CamelCaseKeys, DbInsert, DbUpdate } from '@/types/supabase/helpers';

export type RowData = BaseRowData<'products'>;
export type ItemDTO = CamelCaseKeys<RowData>;
export type CreateItemValues = DbInsert<'products'>;
export type UpdateItemValues = DbUpdate<'products'>;
```

#### 3. Server Actions 구현

`notice` 모듈의 Server Actions를 복사하고 다음을 수정:
- `tableName`: `'products'`로 변경
- 필터링 로직: 필요한 컬럼에 맞게 수정

```typescript
// actions/get-list.ts
const { data, error } = await supabase
  .from('products')
  .select('*', { count: 'exact' })
  .eq('deleted', false)
  // 필터 추가
  .range(start, end)
  .order('created_at', { ascending: false });
```

#### 4. 컴포넌트 작성

- `list.tsx`: 데이터 테이블
- `list-columns.tsx`: 컬럼 정의
- `list-filters.tsx`: 필터 UI
- `item-form.tsx`: 폼 (Zod 스키마 수정)
- `item-sheet.tsx`: Sheet 컨테이너
- `delete-item-button.tsx`: 삭제 버튼

#### 5. index.ts 작성

```typescript
export { List as ProductList } from './list';
export { ItemSheet as ProductItemSheet } from './item-sheet';
export { DeleteItemButton as DeleteProductButton } from './delete-item-button';
```

#### 6. 페이지 통합

```typescript
// app/(protected)/products/page.tsx
import { getList } from '@/features/manage-modules/products/actions/get-list';
import { ProductList, ProductItemSheet } from '@/features/manage-modules/products';

export default async function ProductsPage() {
  const { list, totalCount } = await getList({});

  return (
    <ManageModuleContainer>
      <ProductList list={list} totalCount={totalCount} />
      <ProductItemSheet />
    </ManageModuleContainer>
  );
}
```

### 베스트 프랙티스

#### 1. 타입 안전성
- Supabase 자동 생성 타입 활용
- Zod 스키마로 런타임 검증
- snake_case ↔ camelCase 자동 변환

#### 2. 에러 처리
- try-catch-finally로 안전하게 처리
- 명확한 에러 메시지 제공
- 로딩 상태 중복 클릭 방지

#### 3. 상태 관리
- Context로 시트 상태 관리
- usePathname()으로 경로 전달
- revalidatePath로 ISR 캐시 갱신

#### 4. 코드 재사용
- _base 컴포넌트 최대한 활용
- 공통 패턴 유지
- 중복 코드 최소화

#### 5. 성능 최적화
- React Hook Form으로 최적화된 폼 처리
- useEffect 의존성 배열 최적화
- 불필요한 리렌더링 방지

### 주의사항

1. **useEffect 의존성 배열**: `form` 객체는 제외하여 무한 루프 방지
   ```typescript
   useEffect(() => {
     form.reset(prevValues ?? initialValues);
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [prevValues]);
   ```

2. **pathname 전달**: Server Action에서 `headers()`로 가져올 수 없으므로 파라미터로 전달
   ```typescript
   const pathname = usePathname();
   await createItem({ values, path: pathname });
   ```

3. **deleted 필터링**: 목록 조회 시 항상 `deleted = false` 조건 추가
   ```typescript
   .eq('deleted', false)
   ```

4. **타입 변환**: DB 응답은 항상 snake_case → camelCase 변환
   ```typescript
   return { success: true, data: transformSnakeToCamel(data) };
   ```

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
