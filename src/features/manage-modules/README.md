# manage-modules

데이터 관리(CRUD) 기능을 빠르게 구현할 수 있는 템플릿 기반 시스템.

---

## 폴더 구조

```
manage-modules/
├── _base/                    # 공통 인프라 (직접 수정 X)
│   ├── ui/                   # 공통 UI 컴포넌트
│   ├── hooks/                # 커스텀 훅
│   ├── actions/              # 공통 Server Actions
│   └── types.ts              # 공통 타입 정의
├── _templates/               # 템플릿 모음 (복사해서 사용)
│   ├── _sample/              # 전체 폼 컴포넌트 예시
│   ├── notice/               # 공지사항 (에디터 + 파일 업로드)
│   ├── faq/                  # FAQ (단순 텍스트)
│   └── news/                 # 뉴스 (기본 구조)
└── admin/                    # 실제 구현 예시 (관리자 계정)
```

---

## 새 모듈 추가하기

### 1단계: 템플릿 복사

```bash
# _templates에서 적절한 템플릿 선택 후 복사
cp -r src/features/manage-modules/_templates/_sample src/features/manage-modules/products
```

**템플릿 선택 기준:**
- `_sample`: 모든 폼 컴포넌트 예시 (학습용)
- `notice`: 에디터 + 파일 업로드가 필요한 경우
- `faq`: 단순 텍스트 입력만 필요한 경우
- `news`: 기본적인 CRUD 구조

### 2단계: config.ts 수정

```typescript
// products/config.ts
import { RowData as BaseRowData } from '@/shared/lib/supabase/db-helpers';
import { ItemDTO as BaseItemDTO } from '../_base/types';

export const CONFIG = {
  title: '',                    // 비워두면 "{moduleName} 관리"로 표시
  moduleName: '상품',           // 필수: 모듈 이름
  tableName: 'products',        // 필수: Supabase 테이블명
  enableBulkAction: true,       // 일괄 삭제 활성화

  // 필요시 옵션 추가
  categoryOptions: [
    { label: '전자제품', value: 'electronics' },
    { label: '의류', value: 'clothing' },
  ],
} as const;

export type RowData = BaseRowData<typeof CONFIG.tableName>;
export type ItemDTO = BaseItemDTO<typeof CONFIG.tableName>;
```

### 3단계: actions 수정

모든 action 파일에서 `CONFIG.tableName`만 확인하면 됨.

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

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `tableName` | (필수) | Supabase 테이블명 |
| `searchFields` | `['name', 'email']` | 검색 대상 필드 배열 |
| `auth` | `true` | 인증 설정. `{ requireSuper: true }`로 최고관리자만 허용 |
| `selectColumns` | `'*'` | SELECT할 컬럼 지정 |
| `orderBy` | `[{column: 'created_at', ascending: false}]` | 정렬 설정 |
| `softDelete` | `true` | `deleted = false` 필터 적용 여부 |
| `categoryField` | `'category'` | 카테고리 필터 필드명 |
| `additionalFilters` | - | 추가 필터 함수 |

### 4단계: list-columns.tsx 수정

```typescript
// list-columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Separator } from '@/shared/ui/separator';
import { ModifyButton, SoftDeleteButton } from '../../_base/ui';
import { CONFIG, type ItemDTO } from './config';

export const listColumns: ColumnDef<ItemDTO>[] = [
  {
    accessorKey: 'name',
    header: '상품명',
    meta: {
      className: 'text-left',
      truncate: true,              // 텍스트 말줄임
    },
  },
  {
    accessorKey: 'price',
    header: '가격',
    size: 120,
    cell: ({ row }) => {
      const { price } = row.original;
      return price?.toLocaleString() + '원';
    },
  },
  {
    accessorKey: 'createdAt',
    header: '등록일',
    size: 120,
    cell: ({ row }) => {
      const { createdAt } = row.original;
      if (!createdAt) return '-';
      return new Date(createdAt).toLocaleDateString();
    },
  },
  {
    accessorKey: 'addons',
    header: '',
    size: 200,
    meta: { className: 'text-right' },
    cell: ({ row }) => {
      const { id, name } = row.original;
      return (
        <nav className='flex items-center justify-end gap-2'>
          <ModifyButton id={id} />
          <Separator orientation='vertical' className='data-[orientation=vertical]:h-6' />
          <SoftDeleteButton
            tableName={CONFIG.tableName}
            id={id}
            dataLabel={name}
          />
        </nav>
      );
    },
  },
];
```

### 5단계: write-form.tsx 수정

```typescript
// write-form.tsx (핵심 구조만)
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { FieldGroup } from '@/shared/ui/field';
import { FormTextInput, FormNumberInput } from '@/shared/ui/form';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';

import {
  useManageSheet,
  ManageSheetFooter,
  ManageFormSubmit,
  ManageSheetClose,
} from '../../_base/ui';
import { type ItemDTO } from './config';
import { createItem, updateItem } from './actions';

// 1. 스키마 정의
const formSchema = z.object({
  name: z.string().min(1, '상품명을 입력해주세요.'),
  price: z.number().min(0).int(),
});

// 2. 기본값 정의
const formDefaultValues = {
  name: '',
  price: 0,
};

interface WriteFormProps {
  id?: string;
  prevValues: ItemDTO | null;
}

export function WriteForm({ id, prevValues }: WriteFormProps) {
  const sheet = useManageSheet();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: (prevValues ?? formDefaultValues) as z.infer<typeof formSchema>,
  });

  // 3. prevValues 변경 시 폼 리셋
  useEffect(() => {
    form.reset((prevValues ?? formDefaultValues) as z.infer<typeof formSchema>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevValues]);

  // 4. 제출 핸들러
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { success, data, error } = id
        ? await updateItem({ id, values: values as Partial<ItemDTO>, pathname })
        : await createItem({ values: values as Partial<ItemDTO>, pathname });

      if (!success || !data) {
        toast.error(error);
        return;
      }

      toast.success(id ? SUCCESS_MESSAGES.UPDATE_SUCCESS() : SUCCESS_MESSAGES.CREATE_SUCCESS());
      sheet.close();
    } catch (error) {
      console.error(error);
      toast.error(GENERAL_ERRORS.UNEXPECTED);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <FormTextInput control={form.control} name='name' label='상품명' />
        <FormNumberInput control={form.control} name='price' label='가격' prefix='₩' thousandSeparator />
      </FieldGroup>

      <ManageSheetFooter>
        <ManageSheetClose />
        <ManageFormSubmit isLoading={form.formState.isSubmitting} />
      </ManageSheetFooter>
    </form>
  );
}
```

### 6단계: 페이지 연결

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

---

## 공통 컴포넌트

### UI 컴포넌트 (`_base/ui`)

| 컴포넌트 | 설명 |
|----------|------|
| `ManageContainer` | 모듈 최상위 래퍼. 헤더 + 시트 Provider 포함 |
| `ManageListFetcher` | Server Component. getList 호출 + 데이터 전달 |
| `ManageList` | 데이터 테이블. 페이지네이션 + 일괄선택 포함 |
| `ManageSheet` | 생성/수정 시트. Context 기반 상태 관리 |
| `ManageSheetFooter` | 시트 하단 버튼 영역 |
| `ManageFormSubmit` | 저장 버튼 (로딩 상태 포함) |
| `ManageSheetClose` | 취소 버튼 |
| `CreateButton` | 생성 버튼 (헤더에 자동 포함) |
| `ModifyButton` | 수정 버튼 |
| `SoftDeleteButton` | 삭제 버튼 (deleted = true) |
| `HardDeleteButton` | 영구 삭제 버튼 (최고관리자 전용) |
| `BulkActionBar` | 일괄 삭제 액션바 |
| `ExportDataButton` | 엑셀 다운로드 버튼 |

### Hooks (`_base/hooks`)

```typescript
// useManageSheet: 시트 상태 관리
const sheet = useManageSheet();
sheet.open({ mode: 'create' });           // 생성 모드
sheet.open({ id: '123', mode: 'modify' }); // 수정 모드
sheet.close();

// useManageItemData: 항목 데이터 페칭
const { prevValues, isLoading, error } = useManageItemData(getItem, {
  additionalDateFields: ['publishedAt'],  // 추가 날짜 필드 변환
});
```

### Server Actions (`_base/actions`)

| Action | 설명 |
|--------|------|
| `createGetListAction` | 목록 조회 팩토리 함수 |
| `getItem` | 단일 항목 조회 |
| `createItem` | 항목 생성 |
| `updateItem` | 항목 수정 (파일 정리 포함) |
| `softDelete` | 삭제 (deleted = true) |
| `hardDelete` | 영구 삭제 (DB + Storage) |
| `bulkSoftDelete` | 일괄 삭제 |
| `getExportData` | 엑셀용 전체 데이터 조회 |

---

## 파일 업로드

### write-form.tsx에 추가

```typescript
// 1. 스키마에 files 추가
import { schemaPresets } from '@/shared/schemas';
import { type FormFilesField, uploadFormFiles } from '@/shared/lib/file-system';

const formSchema = z.object({
  title: z.string().min(1),
  files: schemaPresets.files({ thumbnail: 0, attachments: 0 }),
});

// 2. 기본값에 files 추가
const formDefaultValues = {
  title: '',
  files: undefined,
};

// 3. onSubmit에서 파일 처리
async function onSubmit(values: z.infer<typeof formSchema>) {
  const { files: formFiles, ...restValues } = values;

  // DB 저장
  const { success, data, error } = id
    ? await updateItem({ id, values: restValues, pathname })
    : await createItem({ values: restValues, pathname });

  if (!success || !data) {
    toast.error(error);
    return;
  }

  // 파일 업로드
  await uploadFormFiles({
    formFiles: formFiles as FormFilesField,
    id: data.id,
    tableName: CONFIG.tableName,
    pathname,
    updateAction: updateItem,
  });

  toast.success(id ? SUCCESS_MESSAGES.UPDATE_SUCCESS() : SUCCESS_MESSAGES.CREATE_SUCCESS());
  sheet.close();
}

// 4. 폼에 파일 업로드 컴포넌트 추가
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
  optional
/>
```

---

## 엑셀 내보내기

### 1. export-data-columns.ts 작성

```typescript
// export-data-columns.ts
import { type ExcelColumn } from '../../_base/ui/export-data-button';
import { type ItemDTO } from './config';

export const exportDataColumns: ExcelColumn<ItemDTO>[] = [
  { header: '상품명', accessorKey: 'name', width: 40 },
  { header: '가격', accessorKey: 'price', width: 15 },
  {
    header: '등록일',
    accessorFn: row => new Date(row.createdAt).toLocaleDateString(),
    width: 15,
  },
];
```

### 2. export-data-button.tsx 작성

```typescript
// export-data-button.tsx
'use client';

import { ExportDataButton as BaseExportDataButton } from '../../_base/ui/export-data-button';
import { CONFIG, type ItemDTO } from './config';
import { exportDataColumns } from './export-data-columns';
import { getExportData } from './actions/get-export-data';

export function ExportDataButton() {
  return (
    <BaseExportDataButton<ItemDTO>
      fetchDataFn={() => getExportData()}
      columns={exportDataColumns}
      fileName={CONFIG.moduleName}
    >
      엑셀로 내보내기
    </BaseExportDataButton>
  );
}
```

### 3. addons.tsx에서 사용

```typescript
// addons.tsx
import { ExportDataButton } from './export-data-button';

export function HeaderAddons() {
  return (
    <div className='flex justify-between gap-2'>
      <div className='ml-auto flex items-center gap-2'>
        <ExportDataButton />
      </div>
    </div>
  );
}
```

### 4. index.tsx에 headerAddons 추가

```typescript
// index.tsx
import { HeaderAddons } from './addons';

export default function ManageModule({ searchParams }: Props) {
  return (
    <ManageContainer
      title={CONFIG.title}
      moduleName={CONFIG.moduleName}
      headerAddons={<HeaderAddons />}  // 추가
    >
      {/* ... */}
    </ManageContainer>
  );
}
```

---

## 커스텀 로직이 필요한 경우

`admin` 모듈처럼 특수한 로직이 필요하면 base action을 직접 사용하지 않고 커스텀 action 작성:

```typescript
// actions/create-item.ts (커스텀 예시)
'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/shared/lib/supabase/server';
import { transformCamelToSnake, transformSnakeToCamel } from '@/shared/utils/objects';
import { createServerAction } from '@/features/utils/server-actions';
import { Result } from '@/shared/utils/results';
import { CreateItemParams } from '../../_base/types';
import { CONFIG, type ItemDTO } from '../config';

export const createItem = createServerAction<CreateItemParams<ItemDTO>, ItemDTO>({
  name: 'createItem',
  auth: { requireSuper: true },  // 최고관리자만 허용
  handler: async ({ values, pathname }) => {
    // 커스텀 검증 로직
    if (!values.password) {
      return Result.error('비밀번호를 입력해주세요.');
    }

    // 비밀번호 해시 등 추가 처리
    values.password = await hashPassword(values.password);

    const supabase = createServerClient();
    const snakedValues = transformCamelToSnake(values);

    const { data, error } = await supabase
      .from(CONFIG.tableName)
      .insert(snakedValues as any)
      .select()
      .single();

    if (error) {
      // 커스텀 에러 처리
      if (error.code === '23505') {
        return Result.error('이미 존재하는 아이디입니다.');
      }
      return Result.error('생성에 실패했습니다.');
    }

    if (pathname) revalidatePath(pathname);

    return Result.success(transformSnakeToCamel(data) as ItemDTO);
  },
});
```

---

## 주의사항

### useEffect 의존성
form 객체는 의존성 배열에서 제외하여 무한 루프 방지:

```typescript
useEffect(() => {
  form.reset(prevValues ?? formDefaultValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [prevValues]);
```

### pathname 전달
Server Action에서 `headers()`로 pathname을 가져올 수 없으므로 파라미터로 전달:

```typescript
const pathname = usePathname();
await createItem({ values, pathname });
```

### deleted 필터링
기본적으로 `getList`에서 `deleted = false` 조건이 자동 적용됨. 비활성화하려면:

```typescript
export const getList = createGetListAction<ItemDTO>({
  tableName: CONFIG.tableName,
  softDelete: false,  // deleted 필터 비활성화
});
```

### 날짜 필드 변환
Supabase에서 조회한 timestamp는 string으로 넘어옴. `useManageItemData`에서 자동 변환:

```typescript
// 기본: createdAt, updatedAt 자동 변환
const { prevValues } = useManageItemData(getItem);

// 추가 날짜 필드 변환
const { prevValues } = useManageItemData(getItem, {
  additionalDateFields: ['publishedAt', 'expiredAt'],
});
```

---

## 파일 구조 체크리스트

새 모듈 생성 시 필요한 파일:

```
products/
├── actions/
│   ├── index.ts           # export * from 각 action
│   ├── get-list.ts        # 목록 조회
│   ├── get-item.ts        # 단일 조회
│   ├── create-item.ts     # 생성
│   ├── update-item.ts     # 수정
│   └── get-export-data.ts # (선택) 엑셀용 데이터
├── config.ts              # 설정 + 타입
├── index.tsx              # 모듈 진입점
├── list.tsx               # 리스트 컴포넌트
├── list-columns.tsx       # 컬럼 정의
├── item-sheet.tsx         # 시트 컴포넌트
├── write-form.tsx         # 폼 컴포넌트
├── addons.tsx             # (선택) 헤더 추가 기능
├── export-data-button.tsx # (선택) 엑셀 버튼
└── export-data-columns.ts # (선택) 엑셀 컬럼
```
