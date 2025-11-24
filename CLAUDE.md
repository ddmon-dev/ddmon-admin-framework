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
  distDir: process.env.IS_CLAUDE ? '.next-claude' : undefined;
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
  "style": "new-york", // UI 스타일
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral", // 기본 색상
    "cssVariables": true // CSS Variables 사용
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
│   ├── ui/                   # 재사용 가능한 공통 UI 컴포넌트
│   │   ├── manage-container.tsx
│   │   ├── manage-sheet.tsx          # Context & Sheet UI
│   │   ├── manage-list.tsx           # 공통 리스트 컴포넌트
│   │   ├── create-button.tsx
│   │   ├── modify-button.tsx
│   │   ├── delete-button.tsx         # SoftDeleteButton, HardDeleteButton export
│   │   └── index.ts                  # Barrel export
│   ├── actions/              # 공용 Server Actions
│   │   ├── delete.ts                 # softDelete, hardDelete
│   │   └── index.ts                  # Barrel export
│   ├── hooks/                # 커스텀 훅
│   │   ├── use-manage-item-data.ts   # 항목 데이터 페칭 훅
│   │   └── index.ts                  # Barrel export
│   ├── utils/                # 유틸리티 함수
│   │   ├── handle-file-uploads.ts
│   │   └── index.ts                  # Barrel export
│   ├── types.ts              # 공통 타입 정의
│   └── config.ts             # 기본 설정
│
├── _template/                # 새 모듈 추가 시 참고하는 템플릿
│   ├── actions/              # Server Actions 템플릿
│   │   ├── get-list.ts
│   │   ├── get-item.ts
│   │   ├── create-item.ts
│   │   ├── update-item.ts
│   │   └── index.ts
│   ├── list.tsx              # 목록 컴포넌트
│   ├── list-columns.tsx      # 테이블 컬럼 정의
│   ├── filters.tsx           # 필터 UI
│   ├── item-form.tsx         # 항목 폼 (생성/수정)
│   ├── item-sheet.tsx        # Sheet 컨테이너
│   ├── config.ts             # 모듈별 설정
│   ├── types.ts              # 모듈별 타입
│   └── index.ts              # 공개 API
│
└── notice/                   # 실제 구현 (공지사항 모듈)
    ├── actions/              # Server Actions
    │   ├── get-list.ts
    │   ├── get-item.ts
    │   ├── create-item.ts
    │   ├── update-item.ts
    │   └── index.ts
    ├── list.tsx              # 목록 컴포넌트
    ├── list-columns.tsx      # 테이블 컬럼 정의
    ├── filters.tsx           # 필터 UI
    ├── item-form.tsx         # 항목 폼 (생성/수정)
    ├── item-sheet.tsx        # Sheet 컨테이너 (useManageItemData 활용)
    ├── config.ts             # 모듈별 설정
    ├── types.ts              # 모듈별 타입
    └── index.ts              # 공개 API
```

### 핵심 패턴

#### 1. Context 기반 상태 관리

`ManageSheetContext`를 통해 시트 상태를 전역으로 관리합니다.

```typescript
// _base/ui/manage-sheet.tsx
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

#### 2. Delete 이원화 (Base UI Components & Server Actions)

데이터 삭제를 Soft Delete와 Hard Delete로 분리하여 관리합니다. **\_base/ui/delete-button.tsx**에서 두 개의 버튼 컴포넌트를 export하고, **\_base/actions/delete.ts**에서 완전한 Server Actions를 제공합니다.

**UI 컴포넌트** (`_base/ui/delete-button.tsx`):

```typescript
// 두 컴포넌트를 하나의 파일에서 export
export function SoftDeleteButton({ onDelete }: Props) {
  // Soft Delete UI 처리
}

export function HardDeleteButton({ onDelete }: Props) {
  // Hard Delete UI 처리
}
```

**사용 예시:**

```typescript
import { SoftDeleteButton, HardDeleteButton } from '../../_base/ui';

// Soft Delete: deleted 컬럼만 업데이트 (복구 가능)
<SoftDeleteButton onDelete={handleSoftDelete} />

// Hard Delete: 실제 데이터 삭제 (복구 불가)
<HardDeleteButton onDelete={handleHardDelete} />
```

**Base Actions 구현** (`_base/actions/delete.ts`):

```typescript
// 완전한 Server Action (revalidatePath, 타입 변환 포함)
export async function softDelete<T>({ tableName, id, path }: Params): Promise<DeleteResult<T>> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from(tableName)
      .update({ deleted: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (path) revalidatePath(path);

    return { success: true, data: transformSnakeToCamel(data) as T };
  } catch (error) {
    return { success: false, error: '삭제 실패' };
  }
}

export async function hardDelete<T>({ tableName, id, path }: Params): Promise<DeleteResult<T>> {
  try {
    const supabase = createServerClient();

    // DB에서 완전 삭제
    const { data, error } = await supabase.from(tableName).delete().eq('id', id).select().single();

    if (error) throw new Error(error.message);

    // Storage 폴더 전체 삭제
    await deleteFolderFromStorage(`${tableName}/${id}`);

    if (path) revalidatePath(path);
    return { success: true, data: transformSnakeToCamel(data) as T };
  } catch (error) {
    return { success: false, error: '삭제 실패' };
  }
}
```

**모듈별 사용** (3줄로 간소화):

```typescript
// notice/actions/soft-delete-item.ts
import { softDelete } from '../../_base/actions';

export async function softDeleteItem({ id, path }: Params): Promise<DeleteResult<ItemDTO>> {
  return await softDelete<ItemDTO>({ tableName: CONFIG.tableName, id, path });
}

// notice/actions/hard-delete-item.ts
import { hardDelete } from '../../_base/actions';

export async function hardDeleteItem({ id, path }: Params): Promise<DeleteResult<ItemDTO>> {
  return await hardDelete<ItemDTO>({ tableName: CONFIG.tableName, id, path });
}
```

**개선 효과**:

- 모듈별 action: 42줄 → 3줄 (93% 감소)
- 완전한 Server Action 제공 (utils에서 actions로 승격)
- 제네릭 타입 지원으로 타입 안전성 보장
- revalidatePath, transformSnakeToCamel 자동 처리

#### 3. 파일 시스템 타입 계층

파일 관련 타입을 도메인별로 명확히 분리하여 혼란을 방지합니다.

```typescript
// DB 레이어 (Storage에 저장된 메타데이터)
export type DbFileMetadata = {
  url: string; // Storage 공개 URL
  originalName: string; // 원본 파일명
  size: number; // 파일 크기 (bytes)
  mimeType: string; // MIME 타입
  uploadedAt: string; // 업로드 시각 (ISO)
};

export type DbFilesJSONB = Record<string, DbFileMetadata[]>;

// Form 레이어 (클라이언트 폼 입력값)
export type FormFileValue =
  | (DbFileMetadata & { type: 'existing'; markedForDeletion?: boolean })
  | { type: 'new'; file: File }
  | null;

export type FormFilesField = Record<string, FormFileValue[]>;

// DTO 헬퍼 타입
export type WithFiles<T> = T & {
  files?: DbFilesJSONB;
};
```

**유틸리티 함수**:

```typescript
// DB 파일 메타데이터 → 폼 업로드 형태 변환
export function transformFilesToUploadValues(
  files?: DbFilesJSONB
): Record<string, FormFileValue[]> | undefined {
  if (!files) return undefined;

  return Object.fromEntries(
    Object.entries(files).map(([category, fileList]) => [
      category,
      fileList.map(file => ({ type: 'existing' as const, ...file })),
    ])
  );
}
```

#### 4. useManageItemData 커스텀 훅

항목 데이터 페칭, 파일 변환, 에러 처리를 통합한 커스텀 훅입니다.

```typescript
// _base/hooks/use-manage-item-data.ts
export function useManageItemData<T extends { files?: DbFilesJSONB }>(
  getItemAction: GetItemAction<T>
) {
  const { manageSheetData } = useManageSheet();
  const { id } = manageSheetData ?? {};

  const [prevValues, setPrevValues] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) {
        setPrevValues(null);
        return;
      }

      setIsLoading(true);
      const { success, data, error } = await getItemAction({ id });

      if (!success) {
        setError(error || '데이터 조회 실패');
        return;
      }

      // 파일 메타데이터 자동 변환
      const transformedData = {
        ...data,
        files: transformFilesToUploadValues(data.files),
      } as T;

      setPrevValues(transformedData);
      setIsLoading(false);
    };

    fetchItem();
  }, [id, getItemAction]);

  return { prevValues, isLoading, error };
}
```

**사용 예시**:

```typescript
// notice/item-sheet.tsx (55줄 → 25줄, 54% 감소)
export function ItemSheet() {
  const { manageSheetData } = useManageSheet();
  const { id, mode } = manageSheetData ?? {};
  const { prevValues } = useManageItemData(getItem); // 3줄로 완료!

  return (
    <ManageSheet>
      {mode === 'view' ? null : (
        <ItemForm
          id={id}
          prevValues={prevValues}
        />
      )}
    </ManageSheet>
  );
}
```

#### 5. Server Actions 패턴

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
  path,
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

#### 6. 에러 처리 패턴

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

#### 7. 파일 업로드 패턴

Supabase Storage를 활용한 파일 업로드 시스템입니다.

**아키텍처**:

```
Storage 클라이언트 (shared/lib/supabase/storage.ts)
  ↓
파일 작업 유틸리티 (_base/utils/file-operations.ts)
  ↓
모듈별 Server Actions (notice/actions/upload-files.ts)
  ↓
UI 컴포넌트 (FormFileUpload)
```

**Storage 클라이언트** (`shared/lib/supabase/storage.ts`):

```typescript
// 단일 파일 업로드
export async function uploadFileToStorage(file: File, path: string): Promise<FileUploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage.from('my-bucket').upload(path, buffer);

  const {
    data: { publicUrl },
  } = supabase.storage.from('my-bucket').getPublicUrl(data.path);

  return { success: true, data: { url: publicUrl } };
}

// 파일 삭제
export async function deleteFileFromStorage(url: string): Promise<FileDeleteResult> {
  const filePath = extractFilePathFromUrl(url);

  await supabase.storage.from('my-bucket').remove([filePath]);

  return { success: true, data: undefined };
}
```

**파일 작업 유틸리티** (`_base/utils/file-operations.ts`):

```typescript
// 다중 파일 병렬 업로드 (실패 시 자동 롤백)
export async function uploadFiles(files: File[], folder: string): Promise<MultiFileUploadResult> {
  const uploadedUrls: string[] = [];

  try {
    const results = await Promise.all(
      files.map(file => {
        const fileName = generateUniqueFileName(file.name);
        return uploadFileToStorage(file, `${folder}/${fileName}`);
      })
    );

    uploadedUrls.push(...results.map(r => r.data.url));
    return { success: true, data: { urls: uploadedUrls } };
  } catch (error) {
    // 실패 시 이미 업로드된 파일들 삭제
    await deleteFiles(uploadedUrls);
    return { success: false, error: '파일 업로드 실패' };
  }
}
```

**모듈별 Server Action** (`notice/actions/upload-files.ts`):

```typescript
export async function uploadNoticeFiles({
  files,
  noticeId,
}: {
  files: File[];
  noticeId: string;
}): Promise<MultiFileUploadResult> {
  const folder = `notices/${noticeId}`;
  return await uploadFiles(files, folder);
}
```

**폼 통합** (`notice/item-form.tsx`):

```typescript
async function onSubmit(values) {
  const { attachmentUrls, ...restValues } = values;

  // 1. 기존 파일 필터링 (삭제 표시 제외)
  const existingFiles = attachmentUrls
    .filter(f => f.type === 'existing' && !f.markedForDeletion)
    .map(f => f.url);

  // 2. 새 파일만 업로드
  const newFiles = attachmentUrls.filter(f => f.type === 'new').map(f => f.file);

  let uploadedUrls = [];
  if (newFiles.length > 0) {
    const result = await uploadNoticeFiles({
      files: newFiles,
      noticeId: id || crypto.randomUUID(),
    });
    if (!result.success) throw new Error(result.error);
    uploadedUrls = result.data.urls;
  }

  // 3. 최종 URL 배열 생성
  const finalUrls = [...existingFiles, ...uploadedUrls];

  // 4. DB 저장
  await createItem({
    values: { ...restValues, attachment_urls: finalUrls },
    path,
  });
}
```

**삭제 시 파일 처리** (`notice/actions/delete-item.ts`):

```typescript
export async function deleteItem({ id, path }) {
  // 1. 항목 조회
  const { data: item } = await getItem({ id });

  // 2. 첨부 파일 삭제
  if (item?.attachmentUrls?.length > 0) {
    await deleteFiles(item.attachmentUrls);
  }

  // 3. DB에서 soft delete
  await softDelete(tableName, id);

  revalidatePath(path);
}
```

**주요 특징**:

- Supabase Storage 사용 (`my-bucket`)
- 병렬 업로드로 성능 최적화
- 실패 시 자동 롤백
- 파일명 중복 방지 (UUID 추가)
- 기존/신규 파일 분리 처리
- 삭제 시 Storage 파일도 함께 삭제

**Storage 경로 구조**:

```
my-bucket/
└── notices/
    ├── {noticeId}/
    │   ├── {timestamp}-{random}-filename.pdf
    │   └── {timestamp}-{random}-document.docx
```

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

**권장 방법**: `_template/` 모듈을 복사하여 시작하면 모든 기본 구조와 패턴이 포함되어 있습니다.

#### 0. _template 모듈 복사 (권장)

```bash
# 1. _template 폴더를 새 모듈명으로 복사
cp -r src/features/manage-modules/_template src/features/manage-modules/products

# 2. 이후 config.ts, types.ts, actions 등만 수정
```

**_template의 장점:**
- 모든 기본 패턴과 구조 포함
- _base 컴포넌트 활용 예시 시연
- 완전히 동작하는 예제 코드

#### 1. 디렉토리 생성 (수동 생성 시)

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

`_template` 또는 `notice` 모듈의 Server Actions를 참고하여 다음을 수정:

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

`_template`을 복사했다면 이미 모든 컴포넌트가 있으므로, 다음만 수정:

- `list-columns.tsx`: 컬럼 정의 (제품에 맞게)
- `filters.tsx`: 필터 UI (필요한 필터만)
- `item-form.tsx`: 폼 (Zod 스키마 및 필드 수정)

수동 생성 시 필요한 파일:
- `list.tsx`: 데이터 테이블
- `list-columns.tsx`: 컬럼 정의
- `filters.tsx`: 필터 UI
- `item-form.tsx`: 폼 (Zod 스키마 수정)
- `item-sheet.tsx`: Sheet 컨테이너

#### 5. index.ts 작성

```typescript
export { List as ProductList } from './list';
export { ItemSheet as ProductItemSheet } from './item-sheet';
```

**참고**: 삭제 버튼은 `_base/ui`에서 제공하므로 모듈별로 만들 필요 없습니다.

#### 6. 페이지 통합

```typescript
// app/(protected)/products/page.tsx
import { getList } from '@/features/manage-modules/products/actions/get-list';
import { ProductList, ProductItemSheet } from '@/features/manage-modules/products';

export default async function ProductsPage() {
  const { list, totalCount } = await getList({});

  return (
    <ManageContainer>
      <ProductList
        list={list}
        totalCount={totalCount}
      />
      <ProductItemSheet />
    </ManageContainer>
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

- \_base 컴포넌트/actions/hooks 최대한 활용
- **적절한 수준의 공용화**: 100% 공통 로직만 Base로 제공 (delete actions)
- 공통 패턴 유지하되 과도한 추상화 지양
- Barrel exports로 import 경로 간소화

  ```typescript
  // Before
  import { ManageSheet } from '../_base/ui/manage-sheet';
  import { CreateButton } from '../_base/ui/create-button';

  // After
  import { ManageSheet, CreateButton } from '../_base/ui';
  ```

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

### 파일 업로드 시스템

manage-modules는 Supabase Storage를 활용한 파일 업로드 시스템을 포함합니다. 한글 파일명 지원, 여러 파일 카테고리 처리, 자동 롤백 등의 기능을 제공하며, 템플릿 재사용성을 위해 동적 처리를 지원합니다.

#### 핵심 파일

**글로벌 유틸리티** (`/src/shared/lib/supabase/`)

- `file-helpers.ts`: DbFileMetadata 타입, 파일명 생성 유틸리티
- `file-processing.ts`: 파일 처리 핵심 로직 (processFiles, rollbackFiles, deleteFilesByUrls)
- `storage.ts`: Supabase Storage 업로드/삭제 함수

**모듈별 구현** (예: `notice`)

- `types.ts`: ItemFiles 타입 정의 (files 필드)
- `actions/create-item.ts`: 생성 시 파일 업로드
- `actions/update-item.ts`: 수정 시 파일 업로드/삭제
- `actions/delete-item.ts`: 삭제 시 파일 정리
- `item-form.tsx`: 파일 폼 필드
- `item-sheet.tsx`: 기존 파일 데이터 변환

#### 주요 개념

**1. 한글 파일명 지원**

Supabase Storage는 한글 파일명을 지원하지 않으므로, Storage에는 UUID+확장자로 저장하고 원본 파일명은 DB 메타데이터에 저장합니다.

```typescript
// Storage: 1234567890-abc123.pdf
// DB metadata: { url: "...", name: "한글파일명.pdf", ... }
```

**2. 다중 파일 카테고리**

하나의 엔티티가 여러 종류의 파일을 가질 수 있습니다 (예: 썸네일 1개, 첨부파일 5개).

```typescript
// DB 스키마
files: {
  thumbnail?: DbFileMetadata[];
  attachments?: DbFileMetadata[];
}

// DbFileMetadata 타입
type DbFileMetadata = {
  url: string;           // Storage 공개 URL
  name: string;          // 원본 파일명
  size: number;          // 파일 크기 (bytes)
  mimeType: string;      // MIME 타입
  uploadedAt: string;    // 업로드 시각 (ISO)
};
```

**3. 동적 카테고리 처리**

카테고리를 하드코딩하지 않고 `Object.entries()`로 동적 처리하여 템플릿 재사용성을 극대화합니다.

```typescript
// processFiles는 카테고리 개수/이름에 상관없이 동작
uploadedFiles = await processFiles({
  filesInput: values.files,
  folder: `notices/${id}`,
});
```

**4. 자동 롤백**

파일 업로드 후 DB 저장 실패 시, 업로드된 파일을 자동으로 삭제합니다.

```typescript
try {
  uploadedFiles = await processFiles({ ... });
  await supabase.from(...).insert(...); // DB 저장
} catch (error) {
  await rollbackFiles(uploadedFiles); // 업로드된 파일 자동 삭제
}
```

#### 데이터 흐름

**생성 (Create)**

```
1. 사용자가 폼에서 파일 선택 (thumbnail, attachments)
2. onSubmit → createItem({ values, path })
3. createItem에서 processFiles() 호출
   - 새 파일만 추출하여 Storage 업로드
   - 메타데이터 생성
4. DB에 메타데이터 저장 (files 컬럼)
5. 실패 시 rollbackFiles()로 자동 삭제
```

**수정 (Update)**

```
1. 기존 데이터 조회 (getItem)
2. item-sheet에서 DbFileMetadata → FormFileUpload 형태로 변환
3. 폼에서 파일 추가/삭제 표시
4. onSubmit → updateItem({ id, values, path })
5. updateItem에서:
   - markedForDeletion 파일 URL 추출
   - processFiles() 호출 (새 파일 업로드 + 기존 파일 유지)
   - DB 업데이트
   - markedForDeletion 파일 Storage에서 삭제
6. 실패 시 rollbackFiles()로 새 파일만 삭제
```

**삭제 (Delete)**

```
1. deleteItem({ id, path })
2. getItem으로 파일 정보 조회
3. files에서 모든 카테고리의 URL을 동적으로 추출
4. deleteFilesByUrls()로 Storage 삭제
5. softDelete로 deleted = true 설정
```

#### 사용 방법

**1. 모듈 타입 정의**

```typescript
// notice/types.ts
import { type DbFileMetadata } from '@/shared/lib/supabase/file-helpers';

export type ItemFiles = {
  thumbnail?: DbFileMetadata[];
  attachments?: DbFileMetadata[];
};

export type ItemDTO = CamelCaseKeys<RowData> & {
  files?: ItemFiles;
};
```

**2. 폼 스키마 설정**

```typescript
// notice/item-form.tsx
const existingFileSchema = z.object({
  type: z.literal('existing'),
  url: z.string(),
  originalName: z.string(),
  markedForDeletion: z.boolean().optional(),
});

const newFileSchema = z.object({
  type: z.literal('new'),
  file: z.instanceof(File),
});

const fileUploadValueSchema = z.union([existingFileSchema, newFileSchema, z.null()]);

const formSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  files: z
    .object({
      thumbnail: z.array(fileUploadValueSchema).optional(),
      attachments: z.array(fileUploadValueSchema).optional(),
    })
    .optional(),
});
```

**3. 폼 컴포넌트**

```typescript
<FormFileUpload
  control={form.control}
  name='files.thumbnail'
  label='썸네일'
  acceptPreset='images'
  maxSize={5}
  max={1}
/>
<FormFileUpload
  control={form.control}
  name='files.attachments'
  label='첨부 파일'
  acceptPreset='documents'
  maxSize={10}
  max={5}
/>
```

**4. Server Action (Create)**

```typescript
// notice/actions/create-item.ts
import {
  processFiles,
  rollbackFiles,
  type ProcessedFiles,
} from '@/shared/lib/supabase/file-processing';

export async function createItem({ values, path }: Params) {
  const noticeId = crypto.randomUUID();
  let uploadedFiles: ProcessedFiles = {};

  try {
    // 파일 처리 (업로드 + 메타데이터 생성)
    uploadedFiles = await processFiles({
      filesInput: values.files as any,
      folder: `notices/${noticeId}`,
    });

    // DB 저장용 값 준비
    const insertValues = {
      ...values,
      id: noticeId,
      files: uploadedFiles,
    };

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(transformCamelToSnake(insertValues) as any)
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (path) revalidatePath(path);

    return { success: true, data: transformSnakeToCamel(data) };
  } catch (error) {
    console.error(error);
    await rollbackFiles(uploadedFiles); // 롤백
    return { success: false, error: '생성 실패' };
  }
}
```

**5. Server Action (Update)**

```typescript
// notice/actions/update-item.ts
export async function updateItem({ id, values, path }: Params) {
  let uploadedFiles: ProcessedFiles = {};
  const deletedUrls: string[] = [];

  try {
    // 삭제 표시된 파일 URL 추출
    if (values.files) {
      for (const files of Object.values(values.files)) {
        if (files) {
          const markedFiles = files.filter(
            (f): f is Extract<typeof f, { type: 'existing' }> =>
              f?.type === 'existing' && f.markedForDeletion === true
          );
          deletedUrls.push(...markedFiles.map(f => f.url));
        }
      }
    }

    // 파일 처리
    uploadedFiles = await processFiles({
      filesInput: values.files as any,
      folder: `notices/${id}`,
    });

    // DB 업데이트
    const updateValues = { ...values, files: uploadedFiles };
    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .update(transformCamelToSnake(updateValues) as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 삭제 표시된 파일 Storage에서 삭제
    if (deletedUrls.length > 0) {
      await deleteFilesByUrls(deletedUrls);
    }

    if (path) revalidatePath(path);
    return { success: true, data: transformSnakeToCamel(data) };
  } catch (error) {
    console.error(error);
    await rollbackFiles(uploadedFiles); // 롤백
    return { success: false, error: '업데이트 실패' };
  }
}
```

**6. Server Action (Delete)**

```typescript
// notice/actions/delete-item.ts
import { deleteFilesByUrls } from '@/shared/lib/supabase/file-processing';

export async function deleteItem({ id, path }: Params) {
  try {
    const { success, data: item } = await getItem({ id });

    // 모든 카테고리의 파일 URL을 동적으로 추출
    if (success && item?.files) {
      const allFileUrls = Object.values(item.files)
        .flat()
        .map(f => f.url);

      if (allFileUrls.length > 0) {
        await deleteFilesByUrls(allFileUrls);
      }
    }

    const { data, error } = await softDelete(CONFIG.tableName, id);
    if (error) return { success: false, error };

    if (path) revalidatePath(path);
    return { success: true, data: transformSnakeToCamel(data) };
  } catch (error) {
    return { success: false, error: '삭제 실패' };
  }
}
```

**7. Sheet 컴포넌트 (기존 데이터 변환)**

```typescript
// notice/item-sheet.tsx
useEffect(() => {
  const fetchItem = async () => {
    const { success, data } = await getItem({ id });
    if (!success) return;

    // DbFileMetadata를 FormFileUpload 형태로 변환
    const transformedData = {
      ...data,
      files: data.files
        ? Object.fromEntries(
            Object.entries(data.files).map(([category, fileList]) => [
              category,
              fileList?.map(file => ({
                type: 'existing' as const,
                url: file.url,
                originalName: file.name,
              })),
            ])
          )
        : undefined,
    };

    setPrevValues(transformedData);
  };

  fetchItem();
}, [id]);
```

#### 새로운 모듈에 파일 처리 추가하기

새로운 manage-modules 모듈(예: `products`)에 파일 업로드를 추가하는 경우:

**1. types.ts 정의**

```typescript
import { type DbFileMetadata } from '@/shared/lib/supabase/file-helpers';

export type ProductFiles = {
  images?: DbFileMetadata[]; // 상품 이미지 (여러 개)
  manual?: DbFileMetadata[]; // 설명서 (PDF)
};

export type ItemDTO = CamelCaseKeys<RowData> & {
  files?: ProductFiles;
};
```

**2. item-form.tsx 수정**

- 폼 스키마에 `files` 객체 추가
- FormFileUpload 컴포넌트 추가 (카테고리별)
- onSubmit은 단순히 values 전달만 (파일 처리 로직 제거)

**3. Server Actions 수정**

- `notice` 모듈의 create-item.ts, update-item.ts, delete-item.ts 복사
- `tableName`과 `folder` 경로만 수정 (`notices` → `products`)
- 파일 처리 로직은 그대로 사용 (동적 처리되므로)

**4. item-sheet.tsx 수정**

- `notice` 모듈의 파일 변환 로직 복사
- 동적 처리되므로 코드 수정 불필요

#### 주요 유틸리티 함수

**processFiles()**

파일 업로드 및 메타데이터 생성을 동적으로 처리합니다.

```typescript
type FilesInput = Record<string, FormFileValue[] | undefined>;
type ProcessedFiles = Record<string, DbFileMetadata[]>;

processFiles({
  filesInput: { thumbnail: [...], attachments: [...] },
  folder: 'notices/uuid',
}): Promise<ProcessedFiles>
```

- 새 파일만 추출하여 Storage 업로드
- 기존 파일 유지 (markedForDeletion 제외)
- 업로드 실패 시 자동 롤백 (내부)
- 카테고리 개수/이름 무관하게 동적 처리

**rollbackFiles()**

업로드된 파일들을 Storage에서 삭제합니다 (롤백용).

```typescript
rollbackFiles(processedFiles: ProcessedFiles): Promise<void>
```

**deleteFilesByUrls()**

URL 배열로 파일들을 Storage에서 삭제합니다.

```typescript
deleteFilesByUrls(urls: string[]): Promise<void>
```

#### 템플릿 재사용 팁

1. **카테고리 하드코딩 금지**: `Object.entries()`로 동적 처리
2. **Server Action 복제**: 파일 처리 로직은 모든 모듈에서 동일
3. **폼 스키마만 수정**: 모듈별로 필요한 카테고리만 정의
4. **Storage 경로 규칙**: `{모듈명}/{엔티티ID}/{파일명}`

## CKEditor 이미지 업로드 시스템

### 개요

CKEditor 이미지 업로드 시스템은 에디터 내에서 이미지를 삽입할 때 Supabase Storage로 자동 업로드하는 기능입니다. Presigned URL 패턴을 사용하여 보안성과 성능을 모두 확보했으며, 자동 경로 생성으로 개발자 경험을 개선했습니다.

**핵심 특징:**

- Presigned URL 기반 업로드 (클라이언트 직접 업로드)
- 자동 경로 생성 (`editor/{entity}/{YYYYMMDD}/`)
- 환경변수로 루트 폴더 커스터마이징
- MB 단위 용량 설정 (간편한 설정)
- 파일 타입 검증 (보안 강화)

**manage-modules와의 차이:**

- **manage-modules (FormFileUpload)**: 폼 첨부파일, DB JSONB에 메타데이터 저장, 관리 가능
- **CKEditor**: 에디터 내 이미지, HTML에 URL 직접 임베딩, DB 저장 없음

### 아키텍처

**파일 구조:**

```
src/shared/ui/editor/
├── ckeditor/
│   ├── config.ts                    # 기본 설정 (ImageUploadConfig, DEFAULT_IMAGE_CONFIG)
│   ├── utils.ts                     # 경로 생성 로직
│   ├── custom-upload-adapter.ts     # CKEditor 업로드 어댑터
│   └── index.tsx                    # CKEditor 컴포넌트
└── editor.tsx                       # Dynamic import wrapper (SSR 비활성화)
```

**주요 파일 역할:**

1. **config.ts**: 순수 설정값

   ```typescript
   export const DEFAULT_IMAGE_CONFIG: ImageUploadConfig = {
     maxSizeMB: 2,
     acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
     defaultFolder: 'editor',
   };
   ```

2. **utils.ts**: 경로 생성 로직

   ```typescript
   export function generateUploadPath(uploadFolder?: string, entity?: string): string {
     // 1순위: 명시적 uploadFolder
     if (uploadFolder) return uploadFolder;

     // 2순위: entity 기반 자동 생성
     if (entity) {
       const rootFolder = getEditorUploadRoot();
       const dateString = new Date().toISOString().split('T')[0].replace(/-/g, '');
       return `${rootFolder}/${entity}/${dateString}`;
     }

     // 3순위: 기본 폴더
     return DEFAULT_IMAGE_CONFIG.defaultFolder;
   }
   ```

3. **custom-upload-adapter.ts**: Presigned URL 업로드

   - 파일 검증 (크기, MIME 타입)
   - Presigned URL 발급
   - Storage에 직접 업로드
   - 공개 URL 반환

4. **index.tsx**: CKEditor 컴포넌트
   - entity prop 기반 자동 경로 생성
   - onReady 콜백에서 CustomUploadAdapter 등록

### 핵심 개념

#### 1. 경로 생성 우선순위

CKEditor는 3단계 우선순위로 업로드 경로를 결정합니다:

```typescript
// 1순위: 명시적 uploadFolder (커스텀 경로)
<CKEditor uploadFolder="custom/special/path" entity="notices" />
// → "custom/special/path" 사용 (entity 무시)

// 2순위: entity 기반 자동 생성 (권장)
<CKEditor entity="notices" />
// → "editor/notices/20251122" 자동 생성

// 3순위: 기본값
<CKEditor />
// → "editor" 사용
```

**권장 사용법:**

- 일반적인 경우: `entity` prop 사용 (자동 경로 관리)
- 특수한 경우: `uploadFolder` prop 사용 (명시적 제어)

#### 2. 자동 경로 생성

entity prop을 전달하면 다음 패턴으로 자동 생성됩니다:

```
{rootFolder}/{entity}/{YYYYMMDD}/
```

**예시:**

```typescript
// 2025년 1월 22일, entity="notices"
// → "editor/notices/20250122/"

// 환경변수 NEXT_PUBLIC_EDITOR_UPLOAD_ROOT="uploads"
// → "uploads/notices/20250122/"
```

**장점:**

- 날짜별 폴더 분리로 관리 용이
- 엔티티별 격리
- 사용처에서 경로 포맷 신경 쓰지 않음

#### 3. Presigned URL 패턴

**흐름:**

```
1. 클라이언트: 이미지 선택
   ↓
2. Server Action: Presigned URL 발급 (createPresignedUploadUrl)
   ↓
3. 클라이언트: Presigned URL로 Storage에 직접 업로드
   ↓
4. CKEditor: 공개 URL을 HTML에 삽입
```

**보안 이점:**

- 서버 사이드에서 URL 발급 (인증 필요)
- 토큰 만료 시간 설정 (기본 60초)
- 클라이언트는 서비스 키 노출 없음

**성능 이점:**

- 서버를 거치지 않고 Storage 직접 업로드
- 서버 부하 감소

#### 4. 파일 검증

업로드 전 클라이언트에서 검증합니다:

```typescript
// 크기 검증 (MB 단위)
if (file.size > mbToBytes(maxSizeMB)) {
  throw new Error(`이미지 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
}

// MIME 타입 검증
if (!acceptedFormats.includes(file.type)) {
  throw new Error('지원하지 않는 이미지 형식입니다.');
}
```

### 환경변수 설정

#### NEXT_PUBLIC_EDITOR_UPLOAD_ROOT

에디터 이미지 업로드의 루트 폴더를 설정합니다.

**기본값**: `'editor'` (config.ts의 defaultFolder)

**설정 방법:**

1. `.env.local` 파일 생성/수정

   ```bash
   NEXT_PUBLIC_EDITOR_UPLOAD_ROOT=editor
   ```

2. 다른 루트 폴더 사용

   ```bash
   NEXT_PUBLIC_EDITOR_UPLOAD_ROOT=uploads
   ```

3. 개발 서버 재시작
   ```bash
   yarn dev
   ```

**폴백 체인:**

```typescript
process.env.NEXT_PUBLIC_EDITOR_UPLOAD_ROOT  // 우선
  ↓ (없으면)
DEFAULT_IMAGE_CONFIG.defaultFolder  // 'editor'
```

### 사용 방법

#### 1. 기본 사용 (entity prop)

**권장 방식**으로, entity만 전달하면 자동으로 경로가 생성됩니다.

```typescript
// notice/item-form.tsx
import { CONFIG } from './config';

<FormEditor
  control={form.control}
  name='content'
  label='내용'
  entity={CONFIG.tableName} // "notices" → "editor/notices/20251122"
/>;
```

**결과:**

- 저장 경로: `editor/notices/20251122/uuid-timestamp.jpg`
- 개발자는 경로 포맷 신경 안 씀
- 날짜가 바뀌면 자동으로 새 폴더 생성

#### 2. 커스텀 경로 (uploadFolder prop)

특수한 경우에만 사용합니다.

```typescript
<FormEditor
  control={form.control}
  name='content'
  uploadFolder='announcements/special/2025' // 명시적 경로
  entity='notices' // 무시됨
/>
```

**사용 시나리오:**

- 특정 캠페인용 별도 폴더
- 레거시 경로 호환
- 테스트용 임시 폴더

#### 3. 고급 설정

모든 옵션을 커스터마이징할 수 있습니다.

```typescript
<FormEditor
  control={form.control}
  name='content'
  entity='notices'
  maxImageSizeMB={5} // 5MB 제한 (기본 2MB)
  acceptedImageFormats={['image/jpeg', 'image/png']} // JPEG, PNG만
/>
```

#### 4. 일반 CKEditor 사용

Form 없이 직접 사용할 수도 있습니다.

```typescript
import { CKEditor } from '@/shared/ui/editor/ckeditor';

const [content, setContent] = useState('');

<CKEditor
  content={content}
  onChange={setContent}
  entity='blogs'
  placeholder='내용을 입력하세요...'
/>;
```

### manage-modules와의 연관성

두 시스템 모두 Supabase Storage를 사용하지만, **저장 방식과 목적이 다릅니다**.

#### 비교표

| 항목              | manage-modules (FormFileUpload)         | CKEditor 이미지 업로드    |
| ----------------- | --------------------------------------- | ------------------------- |
| **용도**          | 폼 첨부파일                             | 에디터 내 이미지          |
| **Storage 경로**  | `{모듈명}/{엔티티ID}/`                  | `editor/{엔티티}/{날짜}/` |
| **DB 저장**       | JSONB 메타데이터 저장                   | 저장 안 함 (HTML에 URL만) |
| **메타데이터**    | url, name, size, mimeType, uploadedAt   | 없음                      |
| **삭제 관리**     | softDelete/hardDelete 시 Storage도 삭제 | 자동 삭제 없음            |
| **사용 컴포넌트** | FormFileUpload                          | CKEditor                  |
| **업로드 방식**   | processFiles() (다중 카테고리)          | CustomUploadAdapter       |
| **파일 변환**     | FormFileValue[]                         | 없음 (바로 URL)           |

#### 실무 시나리오

**공지사항 작성:**

```typescript
<form onSubmit={handleSubmit}>
  {/* 제목 */}
  <FormInput name='title' />

  {/* 내용 (CKEditor 이미지 업로드) */}
  <FormEditor
    name='content'
    entity='notices' // editor/notices/20251122/
  />

  {/* 첨부파일 (manage-modules 파일 업로드) */}
  <FormFileUpload
    name='files.attachments'
    label='첨부 파일'
  />
</form>
```

**저장 결과:**

```json
{
  "id": "uuid",
  "title": "공지사항 제목",
  "content": "<p>내용... <img src='https://...storage.../editor/notices/20251122/image.jpg'></p>",
  "files": {
    "attachments": [
      { "url": "https://...storage.../notices/uuid/file.pdf", "name": "첨부파일.pdf", ... }
    ]
  }
}
```

**차이:**

- CKEditor 이미지: HTML에 URL 직접 삽입, DB에 메타데이터 없음
- 첨부파일: DB JSONB에 메타데이터 저장, 관리 가능

### 글로벌 유틸리티

CKEditor 이미지 업로드를 계기로 범용 유틸리티 함수를 글로벌화했습니다.

**위치**: `/src/shared/lib/utils/format.ts`

```typescript
/**
 * MB를 Bytes로 변환
 */
export const mbToBytes = (mb: number): number => mb * 1024 * 1024;

/**
 * Bytes를 MB로 변환
 */
export const bytesToMB = (bytes: number): number => bytes / (1024 * 1024);
```

**사용처:**

- CKEditor 파일 크기 검증
- FormFileUpload 파일 크기 검증
- 기타 파일 관련 UI/로직

**장점:**

- 1024 계산 중복 제거
- 일관된 단위 변환
- 에러 메시지 일관성

### 베스트 프랙티스

#### 1. entity prop 사용 권장

```typescript
// ✅ 권장: entity 기반 자동 경로
<FormEditor entity={CONFIG.tableName} />;

// ❌ 비권장: 수동 경로 생성
const uploadDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
<FormEditor uploadFolder={`editor/${CONFIG.tableName}/${uploadDate}`} />;
```

**이유:**

- 경로 포맷 중복 제거
- 날짜 생성 로직 캡슐화
- 환경변수 루트 폴더 자동 반영

#### 2. 적절한 용량 설정

```typescript
// ✅ 콘텐츠 성격에 맞게 설정
<FormEditor
  entity="blogs"
  maxImageSizeMB={5}  // 블로그는 고해상도 이미지 허용
/>

<FormEditor
  entity="comments"
  maxImageSizeMB={1}  // 댓글은 작은 이미지만
/>
```

**기본값**: 2MB (일반적인 웹 이미지에 적합)

#### 3. MIME 타입 제한

```typescript
// ✅ 필요한 형식만 허용
<FormEditor
  entity='notices'
  acceptedImageFormats={['image/jpeg', 'image/png']} // GIF, WebP 제외
/>
```

**보안 이점:**

- 허용되지 않은 파일 타입 차단
- 악성 파일 업로드 방지

#### 4. 환경변수 활용

```bash
# .env.local (개발)
NEXT_PUBLIC_EDITOR_UPLOAD_ROOT=dev-editor

# .env.production (프로덕션)
NEXT_PUBLIC_EDITOR_UPLOAD_ROOT=editor
```

**활용 시나리오:**

- 개발/프로덕션 폴더 분리
- 테스트 환경 격리

### 주의사항

#### 1. 이미지 삭제 로직 없음

**현재 동작:**

- 에디터에서 이미지 삭제 → HTML에서만 제거
- Storage에는 파일이 그대로 남음

**영향:**

- 사용하지 않는 이미지가 누적될 수 있음
- Storage 용량 증가

**대응 방안:**

1. **수동 정리**: 주기적으로 사용하지 않는 파일 삭제
2. **별도 스크립트**: 날짜별 폴더를 분석하여 오래된 파일 정리
3. **향후 개선**: 이미지 삭제 감지 로직 추가 (복잡도 높음)

#### 2. 이미지 URL은 DB에 저장 안 됨

**CKEditor 특성:**

- 이미지 URL이 HTML에 직접 임베딩됨
- DB에는 HTML 전체가 저장됨 (`content` 컬럼)

**확인 방법:**

```sql
SELECT content FROM notices WHERE id = 'uuid';
-- 결과: "<p>내용... <img src='https://...storage.../editor/notices/20251122/image.jpg'></p>"
```

**주의:**

- 이미지 메타데이터 조회 불가
- 특정 이미지가 어디서 사용되는지 추적 어려움

**대안 (필요시):**

- 이미지 메타데이터를 별도 테이블에 저장
- HTML 파싱하여 이미지 URL 추출

#### 3. Undo/Redo 시 이미지 처리

**문제:**

- 이미지 삽입 후 Ctrl+Z → HTML에서 제거
- Storage에는 이미 업로드됨

**현재 동작:**

- Storage에 고아 파일로 남음

**허용 이유:**

- Undo/Redo 추적 복잡도가 매우 높음
- 사용자 경험 저하 우려 (Undo 시 딜레이)
- 날짜별 폴더로 정리 가능

#### 4. 동시 편집 시나리오

**현재:**

- 여러 사용자가 동시 편집 시 각자 이미지 업로드
- 같은 날짜 폴더에 저장됨 (문제 없음)

**Storage 경로:**

```
editor/notices/20251122/
├── uuid1-timestamp1.jpg  (사용자 A)
├── uuid2-timestamp2.jpg  (사용자 B)
└── uuid3-timestamp3.jpg  (사용자 A)
```

**파일명 중복 방지:**

- `generateUniqueFileName()` 사용 (UUID + timestamp)
- 동시 업로드해도 충돌 없음

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
