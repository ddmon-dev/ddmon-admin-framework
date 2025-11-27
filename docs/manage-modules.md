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
├── _template/           # 템플릿 (복사해서 사용)
└── notice/              # 실제 구현 예시
    ├── actions/
    ├── list.tsx
    ├── item-form.tsx
    ├── item-sheet.tsx
    ├── filters.tsx
    ├── config.ts
    └── types.ts
```

## 핵심 패턴

### 1. Context 기반 상태 관리

`ManageSheetContext`로 시트 상태를 전역 관리합니다.

```typescript
// _base/ui/manage-sheet.tsx
const { openManageSheet, closeManageSheet } = useManageSheet();

// 시트 열기
openManageSheet({ id: '123', mode: 'modify' });
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
- snake_case ↔ camelCase 변환
- revalidatePath(path)
- 타입 안전성

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

## 새로운 모듈 추가

### 1. 템플릿 복사 (권장)

```bash
cp -r src/features/manage-modules/_template src/features/manage-modules/products
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

**types.ts:**
```typescript
import type { BaseRowData, CamelCaseKeys, DbInsert, DbUpdate } from '@/types/supabase/helpers';

export type RowData = BaseRowData<'products'>;
export type ItemDTO = CamelCaseKeys<RowData>;
export type CreateItemValues = DbInsert<'products'>;
export type UpdateItemValues = DbUpdate<'products'>;
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

- `list-columns.tsx`: 컬럼 정의
- `filters.tsx`: 필터 UI
- `item-form.tsx`: 폼 스키마 및 필드

### 5. 페이지 통합

ManageContainer의 render props 패턴을 사용합니다.

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
import { ManageContainer } from '../_base/ui';
import { CONFIG, type ItemDTO } from './config';
import { getList } from './actions/get-list';
import { Filters, List, ItemSheet } from './';

export default function ManageModule({ searchParams }: Props) {
  return (
    <ManageContainer<ItemDTO>
      moduleName={CONFIG.moduleName}
      searchParams={searchParams}
      getList={getList}
    >
      {({ data, totalCount }) => (
        <>
          <Filters />
          <List data={data} totalCount={totalCount} />
          <ItemSheet />
        </>
      )}
    </ManageContainer>
  );
}
```

**ManageContainer가 처리하는 것:**
- searchParams 파싱
- getList 호출 및 데이터 페칭
- 공통 레이아웃 (제목, 생성 버튼)
- ManageSheetProvider 래핑

## 베스트 프랙티스

### 타입 안전성
- Supabase 자동 생성 타입 활용
- Zod 스키마로 런타임 검증
- snake_case ↔ camelCase 자동 변환

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
1. `types.ts`에 ItemFiles 타입 추가
2. `item-form.tsx`에 FormFileUpload 추가
3. `actions/create-item.ts`에서 processFiles() 호출

자세한 내용: [파일 시스템 가이드](file-system.md)
