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
├── _templates/          # 템플릿 (복사해서 사용)
│   ├── _sample/         # 기본 템플릿
│   ├── faq/             # FAQ 템플릿
│   ├── news/            # 뉴스 템플릿
│   └── notice/          # 공지사항 템플릿 (파일 업로드 포함)
└── admins/              # 관리자 관리 모듈
```

### 모듈 파일 구조

```
_templates/_sample/
├── actions/
│   ├── create-item.ts
│   ├── get-item.ts
│   ├── get-list.ts
│   ├── get-export-data.ts
│   ├── update-item.ts
│   └── index.ts
├── addons.tsx           # 헤더 추가 요소
├── config.ts            # 모듈 설정 및 타입
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

`ManageSheetContext`로 시트 상태를 전역 관리합니다.

```typescript
// _base/ui/manage-sheet.tsx
const sheet = useManageSheet();

// 시트 열기
sheet.open({ id: '123', mode: 'modify' });

// 시트 닫기
sheet.close();

// 현재 데이터 접근
const { id, mode } = sheet.data ?? {};
```

**장점:**
- Props Drilling 제거
- 어디서든 시트 열기/닫기 가능

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

```typescript
// item-sheet.tsx
import { useManageItemData } from '@/features/manage-modules/_base/hooks';

const { prevValues, isLoading, error } = useManageItemData(getItem);
```

**자동 처리:**
- id 기반 데이터 조회
- 파일 메타데이터 → 폼 형태 변환
- 로딩/에러 상태 관리

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

**author/updated_by 자동 주입:**

create/update 시 현재 로그인 사용자 정보가 자동 주입됩니다.

| 액션 | 필드 | 값 |
|------|------|-----|
| `createItem` | `author` | 현재 사용자 이름 |
| `updateItem` | `updated_by` | 현재 사용자 이름 |

```typescript
// create-item.ts 내부 (자동 처리됨)
const insertValues = {
  ...values,
  author: user?.name ?? null,  // 자동 주입
};

// update-item.ts 내부 (자동 처리됨)
const updateValues = {
  ...values,
  updated_by: user?.name ?? null,  // 자동 주입
};
```

**DB 스키마 요구사항:**

```sql
CREATE TABLE my_table (
  -- ... 기타 컬럼
  author TEXT,        -- Create 시 작성자
  updated_by TEXT,    -- Update 시 수정자
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

### 1. 템플릿 복사 (권장)

```bash
cp -r src/features/manage-modules/_templates/_sample src/features/manage-modules/products
```

### 2. 설정 파일 수정

**config.ts:**
```typescript
export const CONFIG = {
  tableName: 'products',
  categoryOptions: [
    { label: '전자제품', value: 'electronics' },
    { label: '의류', value: 'clothing' },
  ],
} as const;
```

**config.ts (타입 포함):**
```typescript
import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../../_base/types';

export const CONFIG = {
  title: '상품 관리',
  moduleName: '상품',
  tableName: 'products',
  enableBulkAction: true,
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
```

### 3. Server Actions 수정

팩토리 함수를 사용하여 간단하게 설정합니다.

```typescript
// actions/get-list.ts
import { createGetListAction } from '../../_base/actions/get-list-factory';
import { CONFIG, type ItemDTO } from '../config';

export const getList = createGetListAction<ItemDTO>({
  tableName: CONFIG.tableName,
  searchFields: ['name', 'description'],  // 검색 대상 필드
});
```

**팩토리 옵션:**
- `tableName`: 테이블명 (필수)
- `searchFields`: 검색 필드 (기본: ['name', 'email'])
- `auth`: 인증 설정 (기본: true, 예: { requireSuper: true })
- `selectColumns`: SELECT 컬럼 (기본: '*')
- `orderBy`: 정렬 설정 (기본: created_at desc)
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
- Zod 스키마로 런타임 검증

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
