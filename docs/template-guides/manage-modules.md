# manage-modules (CRUD 모듈 시스템)

`manage-modules`는 데이터 관리(CRUD) 기능을 빠르게 추가할 수 있는 템플릿 기반 시스템입니다.

**위치**: `/src/features/manage-modules/`

## 구조

```
manage-modules/
├── _base/               # 공통 인프라
│   ├── ui/              # 공통 UI (Sheet, Buttons, List)
│   ├── actions/         # 공통 Server Actions (softDelete, hardDelete)
│   ├── hooks/           # 커스텀 훅 (useManageItemData)
│   └── utils/           # 유틸리티
├── admins/              # 관리자 관리 모듈
├── faqs/                # FAQ 모듈 (카테고리 필터)
├── inquiries/           # 문의 모듈 (답변 기능)
├── news/                # 뉴스 모듈 (파일 업로드)
├── notices/             # 공지사항 모듈 (카테고리, 파일 업로드)
└── popups/              # 팝업 모듈
```

**새 모듈 추가 시**: 기존 모듈 중 유사한 것을 복사하여 사용
- 기본 CRUD: `faqs/` 복사
- 카테고리 + 파일: `notices/` 복사
- 상태 관리: `inquiries/` 복사

### 모듈 파일 구조

```
faqs/                    # 또는 다른 모듈명
├── actions/
│   ├── create-item.ts
│   ├── get-item.ts
│   ├── get-list.ts
│   ├── get-export-data.ts
│   ├── swap-order.ts       # 순서 변경 (enableReorder 사용 시)
│   ├── update-item.ts
│   └── index.ts
├── addons.tsx           # 헤더 추가 요소 (카테고리 필터 등)
├── config.ts            # 모듈 설정 및 타입 (RowData, ItemDTO 포함)
├── schema.ts            # Zod 스키마 (writeSchema — 서버/클라이언트 검증 SSOT)
├── detail-view.tsx      # 상세 보기 (읽기 전용)
├── export-data-button.tsx
├── export-data-columns.ts
├── index.tsx            # 모듈 진입점
├── item-sheet.tsx       # 상세/수정 시트
├── list.tsx             # 목록 컴포넌트
├── list-columns.tsx     # 테이블 컬럼 정의
└── write-form.tsx       # 생성/수정 폼
```

## 핵심 패턴

### 1. Context 기반 상태 관리

시트 상태와 데이터를 두 개의 Context로 분리 관리합니다.

**시트 상태 Context** (`useManageSheet`):

```typescript
const sheet = useManageSheet();

sheet.open({ id: '123', mode: 'modify' }); // 시트 열기
sheet.close();                              // 시트 닫기
sheet.setMode('view');                      // 모드 변경 (id 유지)
sheet.requestClose();                       // closeGuard 확인 후 닫기
sheet.setCloseGuard(() => form.isDirty);    // 변경사항 보호

const { id, mode } = sheet.data ?? {};
```

**데이터 Context** (`useManageSheetData`):

ManageSheet 내부의 자식 컴포넌트에서 데이터에 직접 접근할 수 있습니다.

```typescript
// viewComponent, formComponent 등 ManageSheet 자식 컴포넌트에서 사용
const { prevValues, isLoading, error, refetch } = useManageSheetData<ItemDTO>();

// 예: 답변 등록 후 데이터 재페칭
await createReply(values);
refetch();
```

**장점:**
- Props Drilling 제거 (onMutate, refetch 등을 prop으로 전달할 필요 없음)
- 어디서든 시트 열기/닫기 가능
- 시트 상태 변경과 데이터 변경이 서로 불필요한 리렌더링을 유발하지 않음

### 2. Delete 이원화

Soft Delete(복구 가능)와 Hard Delete(완전 삭제)를 분리합니다.

```typescript
// _base/ui/delete-button.tsx
import { SoftDeleteButton, HardDeleteButton } from '@/features/manage-modules/_base/ui';

<SoftDeleteButton onDelete={handleSoftDelete} />
<HardDeleteButton onDelete={handleHardDelete} />
```

**Base Actions:**
- `softDelete()`: deleted = true 업데이트
- `hardDelete()`: DB + Storage 완전 삭제

### 3. useManageItemData 훅

항목 데이터 페칭, 파일 변환, 에러 처리를 통합합니다.
ManageSheet 내부에서 자동 호출되며, 결과는 `useManageSheetData()`로도 접근 가능합니다.

```typescript
// ManageSheet 내부에서 자동 호출 (직접 호출 불필요)
// 자식 컴포넌트에서는 useManageSheetData<T>()로 접근
const { prevValues, isLoading, error, refetch } = useManageSheetData<ItemDTO>();
```

**자동 처리:**
- id 기반 데이터 조회
- 파일 메타데이터 → 폼 형태 변환
- 로딩/에러 상태 관리
- `refetch()` 함수로 데이터 재페칭

### 4. Server Actions 패턴

일관된 응답 형식을 유지합니다.

```typescript
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

// 사용 예시
const { success, data, error } = await createItem({ values, path });
if (!success) {
  throw new Error(error);
}
```

**자동 처리:**
- revalidatePath(path)
- 타입 안전성
- Zod 스키마 검증 (config.schema 설정 시)

**스키마 검증 (Server Action 자동 적용):**

`config.ts`에 `schema`를 설정하면, `_base`의 `createItem`/`updateItem`이 자동으로 `safeParse` 검증을 수행합니다.

```
schema.ts (SSOT)          config.ts              _base actions
─────────────────       ─────────────────       ─────────────────
writeSchema          →  CONFIG.schema         →  safeParse(values) 자동 검증
  (DB 필드만)                                    updateItem은 .partial() 적용
```

- **createItem**: `schema.safeParse(values)` — 전체 필드 검증
- **updateItem**: `schema.partial().safeParse(values)` — 부분 업데이트 허용
- **delete/bulkDelete/swapOrder**: 사용자 콘텐츠를 DB에 쓰지 않으므로 검증 불필요

```typescript
// schema.ts — DB 필드만 정의 (SSOT)
export const writeSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
});

// config.ts — schema 연결
import { writeSchema } from './schema';
export const CONFIG = {
  tableName: 'faqs',
  schema: writeSchema,  // _base actions에서 자동 검증
} as const;

// write-form.tsx — 클라이언트 검증 (zodResolver)
import { writeSchema } from './schema';

// 파일 없는 모듈: 그대로 사용
const formSchema = writeSchema;

// 파일 있는 모듈: UI 전용 필드 확장
const formSchema = writeSchema.extend({
  files: schemaPresets.files({ thumbnail: 0, attachments: 0 }),
});
```

**author/updated_by 자동 주입:**

create/update 시 현재 로그인 사용자 정보가 자동 주입됩니다.
이름(표시용 캐시)과 ID(FK 참조 무결성)를 병행 저장합니다.

| 액션 | 필드 | 값 |
|------|------|-----|
| `createItem` | `author` | 현재 사용자 이름 |
| `createItem` | `author_id` | 현재 사용자 ID (FK) |
| `updateItem` | `updated_by` | 현재 사용자 이름 |
| `updateItem` | `updated_by_id` | 현재 사용자 ID (FK) |

```typescript
// create-item.ts 내부 (자동 처리됨)
const insertValues = {
  ...values,
  author: user?.name ?? null,     // 표시용 캐시
  author_id: user?.id ?? null,    // FK (admins.id 참조)
};

// update-item.ts 내부 (자동 처리됨)
const updateValues = {
  ...values,
  updated_by: user?.name ?? null,     // 표시용 캐시
  updated_by_id: user?.id ?? null,    // FK (admins.id 참조)
};
```

**DB 스키마 요구사항:**

```sql
CREATE TABLE my_table (
  -- ... 기타 컬럼
  author TEXT,                                                      -- 작성자 이름 (캐시)
  author_id TEXT REFERENCES public.admins(id) ON DELETE SET NULL,    -- 작성자 FK
  updated_by TEXT,                                                   -- 수정자 이름 (캐시)
  updated_by_id TEXT REFERENCES public.admins(id) ON DELETE SET NULL,-- 수정자 FK
);
```

### 5. 에러 처리

try-catch-finally 구조로 안전하게 처리합니다.

```typescript
// 버튼 컴포넌트
const handleClick = async () => {
  setIsLoading(true);
  try {
    await onDelete();
  } catch (error) {
    alert('실패');
  } finally {
    setIsLoading(false); // 항상 실행
  }
};
```

### 6. Detail View (상세 보기)

테이블 행 클릭 시 항목 상세 정보를 표시하는 읽기 전용 뷰입니다.

**4개 핵심 컴포넌트:**

| 컴포넌트 | 용도 |
|---------|------|
| `DetailContainer` | 최상위 래퍼 (간격 관리) |
| `DetailGroup` | 섹션 그룹화 (테두리, 구분선) |
| `DetailField` | 라벨-값 쌍 표시 |
| `DetailRow` | 2컬럼 행 배치 |

**사용 예시:**

```typescript
// notices/detail-view.tsx
import {
  DetailContainer,
  DetailField,
  DetailGroup,
  DetailRow,
  ManageSheetFooter,
  ManageSheetClose,
  ManageSheetModeChange,
} from '../../_base/ui';

export function DetailView({ data }: { data: ItemDTO }) {
  return (
    <>
      <DetailContainer>
        <DetailGroup>
          <DetailField label="제목" value={data.title} />
          <DetailRow>
            <DetailField label="작성자" value={data.author} />
            <DetailField label="조회수" value={data.view_count?.toLocaleString()} />
          </DetailRow>
          <DetailField
            label="내용"
            value={<RichTextContent>{data.content}</RichTextContent>}
          />
        </DetailGroup>
      </DetailContainer>
      <ManageSheetFooter>
        <ManageSheetClose />
        <ManageSheetModeChange mode="modify" />
      </ManageSheetFooter>
    </>
  );
}
```

**DetailField 옵션:**

```typescript
<DetailField
  label="카테고리"
  value={<Badge>{label}</Badge>}    // ReactNode 가능
  emptyText="없음"                   // 빈 값 표시 (기본: '-')
  labelClassName="items-center"      // 라벨 스타일
/>
```

**유용한 렌더링 컴포넌트:**

| 컴포넌트 | 용도 | 위치 |
|---------|------|------|
| `RichTextContent` | 에디터 HTML 렌더링 | `@/shared/ui/editor/rich-text-content` |
| `NewlineText` | `\n` 줄바꿈 표시 | `@/shared/ui/newline-text` |

```typescript
// NewlineText 사용
import { NewlineText } from '@/shared/ui/newline-text';

<DetailField
  label="메모"
  value={<NewlineText>{data.memo}</NewlineText>}
/>
```

## 새로운 모듈 추가

### 1. 기존 모듈 복사 (권장)

```bash
# 기본 CRUD (카테고리 포함)
cp -r src/features/manage-modules/faqs src/features/manage-modules/products

# 또는 카테고리 + 파일 업로드
cp -r src/features/manage-modules/notices src/features/manage-modules/products
```

### 2. 스키마 & 설정 파일 수정

**schema.ts (DB 필드 검증 — SSOT):**
```typescript
import { z } from 'zod';

export const writeSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  description: z.string().min(1, '설명을 입력해주세요.'),
});
```

**config.ts:**
```typescript
import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../../_base/types';
import { writeSchema } from './schema';

export const CONFIG = {
  title: '상품 관리',
  moduleName: '상품',
  tableName: 'products',
  searchFields: ['name', 'description'],  // 검색 대상 필드
  enableBulkAction: true,
  enableReorder: true,                     // 순서 변경 기능 (선택)
  schema: writeSchema,                     // 서버 액션 자동 검증
  categoryOptions: [
    { label: '전자제품', value: 'electronics' },
    { label: '의류', value: 'clothing' },
  ],
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
```

### 3. Server Actions 수정

base 함수를 래핑하여 간단하게 설정합니다. **CONFIG 객체를 직접 전달**하는 것이 권장 패턴입니다.

```typescript
// actions/get-list.ts
'use server';

import { getList as baseGetList } from '../../_base/actions/get-list';
import { CONFIG, type ItemDTO } from '../config';
import type { GetListParams, ListProps } from '../../_base/types';
import type { ActionResult } from '@/shared/types/results';

export async function getList(params: GetListParams): Promise<ActionResult<ListProps<ItemDTO>>> {
  return baseGetList<ItemDTO>(CONFIG, params);
}
```

**config 옵션 (config.ts에서 정의):**
- `tableName`: 테이블명 (필수)
- `schema`: Zod 스키마 (서버 액션 자동 검증, schema.ts에서 import)
- `searchFields`: 검색 필드 (기본: ['name', 'email'])
- `enableReorder`: 순서 변경 기능 (true 또는 { direction: 'asc' | 'desc' })
- `auth`: 인증 설정 (기본: true, 예: { requireSuper: true })
- `selectColumns`: SELECT 컬럼 (기본: '*')
- `orderBy`: 정렬 설정 (기본: created_at desc, enableReorder 시 sort_order)
- `softDelete`: deleted 필터 (기본: true)
- `categoryField`: 카테고리 필드명 (기본: 'category')

### 4. 컴포넌트 수정

- `list-columns.tsx`: 테이블 컬럼 정의
- `write-form.tsx`: 폼 스키마 및 필드
- `addons.tsx`: 헤더 추가 요소 (필터, 검색 등)

### 5. 페이지 통합

ManageContainer + ManageListFetcher 조합을 사용합니다.

```typescript
// app/(protected)/products/page.tsx
import { type SearchParams } from '@/shared/types/search-params';
import ProductsModule from '@/features/manage-modules/products';

interface Props {
  searchParams: SearchParams;
}

export default function ProductsPage({ searchParams }: Props) {
  return <ProductsModule searchParams={searchParams} />;
}
```

```typescript
// features/manage-modules/products/index.tsx
import { type SearchParams } from '@/shared/types/search-params';
import { ManageContainer, ManageListFetcher } from '../../_base/ui';
import { CONFIG, type ItemDTO } from './config';
import { HeaderAddons } from './addons';
import { List } from './list';
import { ItemSheet } from './item-sheet';
import { getList } from './actions/get-list';

interface Props {
  searchParams: SearchParams;
}

export default function ManageModule({ searchParams }: Props) {
  return (
    <ManageContainer
      title={CONFIG.title}
      moduleName={CONFIG.moduleName}
      headerAddons={<HeaderAddons />}
    >
      <ManageListFetcher<ItemDTO>
        searchParams={searchParams}
        getList={getList}
      >
        {({ data, totalCount }) => (
          <>
            <List data={data} totalCount={totalCount} />
            <ItemSheet />
          </>
        )}
      </ManageListFetcher>
    </ManageContainer>
  );
}
```

**ManageContainer가 처리하는 것:**
- 공통 레이아웃 (제목, 헤더)
- ManageSheetProvider 래핑
- Suspense fallback (ListSkeleton)

**ManageListFetcher가 처리하는 것:**
- searchParams 파싱
- getList 호출 및 데이터 페칭
- render props로 data, totalCount 전달

## 베스트 프랙티스

### 타입 안전성
- Supabase 자동 생성 타입 활용
- Zod 스키마로 서버/클라이언트 양쪽 런타임 검증
- `schema.ts`가 SSOT — config.ts와 write-form.tsx 양쪽에서 참조

### 코드 재사용
- `_base` 컴포넌트/actions/hooks 활용
- Barrel exports로 import 간소화

```typescript
// Before
import { ManageSheet } from '../_base/ui/manage-sheet';
import { CreateButton } from '../_base/ui/create-button';

// After
import { ManageSheet, CreateButton } from '../_base/ui';
```

### 성능 최적화
- React Hook Form 사용
- useEffect 의존성 배열 최적화
- 불필요한 리렌더링 방지

## 주의사항

### useEffect 의존성
form 객체는 의존성 배열에서 제외하여 무한 루프 방지

```typescript
useEffect(() => {
  form.reset(prevValues ?? initialValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [prevValues]);
```

### pathname 전달
Server Action에서 `headers()`로 가져올 수 없으므로 파라미터로 전달

```typescript
const pathname = usePathname();
await createItem({ values, path: pathname });
```

### deleted 필터링
목록 조회 시 항상 `deleted = false` 조건 추가

```typescript
.eq('deleted', false)
```

## 순서 변경 기능 (enableReorder)

테이블 항목의 순서를 수동으로 변경할 수 있는 기능입니다.

### 설정 옵션

| 설정 | 정렬 방향 | 설명 |
|------|----------|------|
| `enableReorder: true` | DESC | 기본값, 최신 항목이 맨 위 |
| `enableReorder: { direction: 'asc' }` | ASC | 오래된 항목이 맨 위 |
| 미설정 | - | 순서 변경 비활성화 |

### 사용 조건

1. **DB**: 테이블에 `sort_order INTEGER NOT NULL DEFAULT 0` 컬럼 필수
2. **DB**: `core.sql`의 `swap_sort_order()` 함수 필요
3. **config.ts**: `enableReorder` 설정

### 구현 예시 (4단계)

**1단계: DB 마이그레이션**
```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,  -- 필수
  -- ...
);

CREATE INDEX idx_products_sort_order ON public.products(sort_order);
```

**2단계: config.ts**
```typescript
export const CONFIG = {
  tableName: 'products',
  searchFields: ['name'],
  enableReorder: true,
} as const;
```

**3단계: actions/get-list.ts**
```typescript
export async function getList(params: GetListParams): Promise<ActionResult<ListProps<ItemDTO>>> {
  return baseGetList<ItemDTO>(CONFIG, params);
}
// enableReorder 설정 시 자동으로 sort_order 정렬 적용
```

**4단계: list.tsx**
```typescript
<ManageList
  data={data}
  config={CONFIG}  // enableReorder 자동 처리
  // ...
/>
```

### 동작 방식

- **ManageList**: enableReorder 설정 시 "순서" 컬럼 자동 추가
- **ReorderButtons**: Up/Down 버튼 제공
- **swapOrder**: 인접 항목과 sort_order 값 교환 (원자적)
- **createItem**: 신규 생성 시 max(sort_order) + 1 자동 할당

### 주의사항

- 검색 중에는 순서 버튼이 숨겨짐 (의도적)
- 카테고리 필터 활성화 시 해당 카테고리 내에서만 순서 변경

---

## 파일 업로드

manage-modules에서 파일 업로드가 필요한 경우 [file-system.md](file-system.md#formfileupload)를 참고하세요.

**빠른 시작:**
1. `config.ts`에서 ItemDTO 타입이 WithFiles로 확장되어 있는지 확인
2. `write-form.tsx`에 FormFileUpload 추가
3. 폼 제출 시 `uploadFormFiles()` 호출

```typescript
// write-form.tsx 예시
import { uploadFormFiles, type FormFilesField } from '@/shared/lib/file-system';

async function onSubmit(values: FormValues) {
  const { files: formFiles, ...restValues } = values;

  // 1. 데이터 저장 (파일 제외)
  const { data } = id
    ? await updateItem({ id, values: restValues, pathname })
    : await createItem({ values: restValues, pathname });

  // 2. 파일 업로드
  await uploadFormFiles({
    formFiles: formFiles as FormFilesField,
    id: data.id,
    tableName: CONFIG.tableName,
    pathname,
    updateAction: updateItem,
  });
}
```

자세한 내용: [파일 시스템 가이드](file-system.md)
