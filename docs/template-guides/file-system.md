# 파일 시스템

프로젝트에는 두 가지 파일 업로드 시스템이 있습니다.

| 구분 | FormFileUpload | 에디터(Tiptap) 이미지 업로드 |
|------|---------------|----------------------|
| **용도** | 폼 첨부파일 | 에디터 내 이미지 |
| **Storage 경로** | `{테이블명}/{yyyymmdd}/` | `editor/{엔티티}/{날짜}/` |
| **DB 저장** | JSONB 메타데이터 | 없음 (HTML에 URL만) |
| **관리** | 삭제 시 Storage도 삭제 | 자동 삭제 없음 |

## FormFileUpload (manage-modules 파일 업로드)

### 핵심 개념

**1. 한글 파일명 지원**

Storage는 한글 파일명을 지원하지 않으므로 UUID로 저장하고 원본 파일명은 DB에 저장합니다.

```typescript
// Storage: 1234567890-abc123.pdf
// DB: { url: "...", originalName: "한글파일명.pdf", size: 1024, ... }
```

**2. 다중 파일 카테고리**

하나의 엔티티가 여러 종류의 파일을 가질 수 있습니다.

```typescript
files: {
  thumbnail?: DbFileMetadata[];    // 썸네일 (1개)
  attachments?: DbFileMetadata[];  // 첨부파일 (여러 개)
}
```

**3. Presigned URL 업로드**

클라이언트에서 Storage에 직접 업로드합니다.

```
1. 클라이언트: 파일 선택
2. Server Action: Presigned URL 발급
3. 클라이언트: Storage에 직접 업로드
4. Server Action: DB에 메타데이터 저장
```

### 타입 계층

```typescript
// DB 레이어 - Storage에 저장된 파일 메타데이터
type DbFileMetadata = {
  url: string;          // Storage 공개 URL
  originalName: string; // 원본 파일명
  size: number;         // 파일 크기 (bytes)
  mimeType: string;     // MIME 타입
  uploadedAt: string;   // 업로드 시각 (ISO)
};

// DB의 files 필드 타입
type DbFilesJSONB = Record<string, DbFileMetadata[]>;

// Form 레이어 - 폼에서 사용하는 파일 값
type FormFileValue =
  | (DbFileMetadata & { type: 'existing'; markedForDeletion?: boolean })
  | { type: 'new'; file: File }
  | null;

// 폼의 files 필드 타입
type FormFilesField = Record<string, FormFileValue[]>;
```

### 사용 방법

#### 1. 타입 정의

```typescript
// notice/config.ts
import type { WithFiles } from '@/shared/lib/file-system';

export type ItemDTO = WithFiles<BaseItemDTO<typeof CONFIG.tableName>>;
// WithFiles<T>는 T & { files?: DbFilesJSONB }로 확장
```

#### 2. 폼 스키마

파일 필드는 `schema.ts`의 `writeSchema`에 **폼 모양**(`schemaPresets.files`)으로 선언합니다. 서버 액션이 검증 직전 이 필드를 DB 메타데이터 스키마로 자동 치환하므로(`resolveServerSchema`), 모듈이 `dbFiles`를 직접 다룰 필요가 없습니다.

```typescript
// notice/schema.ts
import { schemaPresets } from '@/shared/schemas';

export const writeSchema = z.object({
  title: z.string().min(1),
  files: schemaPresets.files({ thumbnail: 0, attachments: 0 }),
});
```

`write-form.tsx`는 이 `writeSchema`를 그대로 사용합니다(별도 `formSchema` 불필요).

#### 3. 폼 컴포넌트

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
  optional
/>
```

#### 4. 폼 제출 (write-form.tsx)

파일을 먼저 업로드해 메타데이터를 받고, 그 메타데이터를 포함해 DB에 한 번만 씁니다. 업로드가 실패하면 DB 저장 자체가 일어나지 않아(fail-closed) "첨부 없는 반쪽 행"이 남지 않습니다.

```typescript
import { uploadFormFiles, type FormFilesField } from '@/shared/lib/file-system';

async function onSubmit(values: FormValues) {
  const { files: formFiles, ...restValues } = values;

  // 1. 파일 업로드 선행 (실패 시 throw → DB 접근 없음)
  const filesMetadata = await uploadFormFiles({
    formFiles: formFiles as FormFilesField,
    tableName: CONFIG.tableName,
  });

  // 2. 메타데이터 포함해 단일 저장
  const submitValues = { ...restValues, ...(filesMetadata && { files: filesMetadata }) };
  const { success, data, error } = id
    ? await updateItem({ id, values: submitValues, pathname })
    : await createItem({ values: submitValues, pathname });

  if (!success || !data) {
    toast.error(error);
    return;
  }

  toast.success('저장되었습니다.');
}
```

### 핵심 함수

**uploadFormFiles()** (클라이언트 전용)

폼 파일을 `{테이블명}/{yyyymmdd}/` 경로에 업로드하고 카테고리별 메타데이터를 반환합니다. DB 저장은 하지 않습니다 — 반환된 메타데이터를 호출부가 create/update에 실어 1회 저장합니다. 업로드할 파일이 없으면 `undefined`를 반환합니다.

```typescript
import { uploadFormFiles, type FormFilesField } from '@/shared/lib/file-system';

// Promise<DbFilesJSONB | undefined> 반환
const filesMetadata = await uploadFormFiles({
  formFiles: formFiles as FormFilesField,
  tableName: CONFIG.tableName,
});
```

> 경로는 행 id가 아니라 업로드 날짜로 버킷팅됩니다. 행-파일 연결은 files JSONB 메타데이터가 담당하므로, 업로드 시점에 행 id가 없어도 됩니다(생성 흐름이 단순해지는 핵심).

**getOldFiles() / cleanupDeletedFiles()** (Server Action 전용)

수정 시 삭제된 파일을 Storage에서 정리합니다. `_base/actions/update-item.ts`에서 자동 처리됩니다.

```typescript
// update-item.ts 내부 (자동 처리됨)
const oldFiles = await getOldFiles({ supabase, tableName, id, values });
// ... DB 업데이트 ...
await cleanupDeletedFiles({ oldFiles, newFiles: values.files });
```

**deleteFilesFromStorage() / deleteFolderFromStorage()** (Server Action 전용)

Hard Delete는 삭제 행의 files JSONB에서 URL을 추출해 파일 단위로 삭제합니다(`_base/actions/delete.ts`에서 자동 처리). 파일이 여러 날짜 폴더에 흩어져 있어도, 구 경로(`{테이블명}/{id}/`) 데이터여도 URL 기반이라 모두 정리됩니다.

```typescript
import { deleteFilesFromStorage, extractAllFileUrls } from '@/shared/lib/file-system';

// URL 배열로 파일 삭제 (Hard Delete 기본 경로)
await deleteFilesFromStorage(extractAllFileUrls(row.files));
```

> `deleteFolderFromStorage(folderPath)`는 폴더 접두어 통삭제용 범용 유틸로 남아있지만, 날짜 버킷팅 전환 이후 manage-modules hard delete는 URL 기반 삭제를 사용합니다.

**downloadFileFromStorage()** (클라이언트 전용)

Storage에서 파일을 다운로드합니다. 첨부파일 목록에서 다운로드 버튼 구현 시 사용합니다.

```typescript
import { downloadFileFromStorage } from '@/shared/lib/file-system';

// 파일 다운로드 (토스트 알림 포함)
await downloadFileFromStorage(file.url, file.originalName);
```

> 내부적으로 공개 URL을 `fetch`로 받아 Blob으로 저장합니다. Supabase SDK나 anon key에 의존하지 않으므로 클라이언트가 Supabase에 직접 접근하지 않습니다.

---

## 에디터 이미지 업로드 (Tiptap)

### 핵심 개념

**1. Presigned URL 패턴**

```
클라이언트: 이미지 선택
  ↓
Server Action: Presigned URL 발급
  ↓
클라이언트: Storage에 직접 업로드
  ↓
에디터: 공개 URL을 HTML에 삽입
```

**보안**: 서버에서 presigned URL 발급 (토큰 만료 1시간)
**성능**: 서버를 거치지 않고 Storage 직접 업로드

**2. 자동 경로 생성**

entity prop 전달 시 자동으로 경로 생성

```
{rootFolder}/{entity}/{YYYYMMDD}/

예: "editor/notices/20250124/"
```

**3. 경로 우선순위**

> 폼에서 실제로 사용하는 컴포넌트는 `FormEditor`입니다(내부적으로 `Editor` → dynamic `TiptapEditor`로 연결). `uploadFolder`·`entity` prop이 아래 우선순위로 업로드 경로를 결정합니다.

```typescript
// 1순위: 명시적 uploadFolder (커스텀)
<FormEditor uploadFolder="custom/path" entity="notices" />
// → "custom/path"

// 2순위: entity 기반 자동 생성 (권장)
<FormEditor entity="notices" />
// → "editor/notices/20250124"

// 3순위: 기본값
<FormEditor />
// → "editor"
```

### 사용 방법

#### 기본 사용 (권장)

```typescript
// notice/write-form.tsx
import { CONFIG } from './config';

<FormEditor
  control={form.control}
  name='content'
  label='내용'
  entity={CONFIG.tableName}  // "notices" → "editor/notices/20250124"
/>
```

#### 고급 설정

```typescript
<FormEditor
  name='content'
  entity='notices'
  maxImageSizeMB={5}  // 5MB 제한 (기본 2MB)
  acceptedImageFormats={['image/jpeg', 'image/png']}  // JPEG, PNG만
/>
```

### 설정값

에디터 업로드 루트 폴더·이미지 제한은 환경변수가 아니라 `src/app.config.ts`의 `APP_CONFIG.EDITOR`에서 관리합니다.

```typescript
// src/app.config.ts
EDITOR: {
  UPLOAD_ROOT: 'editor',        // 이미지 업로드 루트 폴더 (기본값)
  IMAGE_MAX_SIZE_MB: 2,         // 기본 최대 이미지 용량 (MB)
  IMAGE_ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
},
```

개별 에디터에서는 `<FormEditor maxImageSizeMB={5} acceptedImageFormats={[...]} />` prop으로 덮어쓸 수 있습니다.
Storage **버킷명**만 환경변수 `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME`으로 지정합니다([supabase.md](supabase.md#스토리지-버킷) 참고).

### 주의사항

**이미지 삭제 로직 없음**

- 에디터에서 이미지 삭제 → HTML에서만 제거
- Storage에는 파일 남음

**대응 방안:**
- 주기적으로 사용하지 않는 파일 정리
- 날짜별 폴더 분석하여 오래된 파일 삭제

### 에디터 콘텐츠 렌더링

에디터로 작성한 HTML 콘텐츠를 상세보기에서 렌더링할 때 `RichTextContent` 컴포넌트를 사용합니다.

**기본 사용:**

```typescript
import { RichTextContent } from '@/shared/ui/editor/rich-text-content';

// 기본 사용
<RichTextContent>{data.content}</RichTextContent>

// DetailField와 함께
<DetailField
  label="내용"
  value={<RichTextContent>{data.content}</RichTextContent>}
/>
```

**지원 요소:**
- 이미지 (`img`, px 너비 인라인 스타일), 리스트 (`ul`, `ol`), 테이블
- 링크, 인용문 (`blockquote`), 단락
- **YouTube 임베드**: `<div data-youtube-video>` iframe 반응형 렌더링

---

## 비교 요약

### FormFileUpload (manage-modules)
- DB JSONB에 메타데이터 저장
- 삭제 시 Storage도 자동 삭제
- 파일 관리 완전 제어

### 에디터 (Tiptap)
- HTML에 URL만 임베딩
- 자동 삭제 없음
- 가볍고 빠름

**실무 시나리오:**

```typescript
<form>
  <FormInput name='title' />

  {/* 에디터: 본문 이미지 */}
  <FormEditor name='content' entity='notices' />

  {/* FormFileUpload: 첨부파일 */}
  <FormFileUpload name='files.attachments' label='첨부 파일' />
</form>
```

**저장 결과:**

```json
{
  "title": "공지사항",
  "content": "<p>...<img src='storage.../editor/notices/20250124/image.jpg'></p>",
  "files": {
    "attachments": [
      { "url": "storage.../notices/uuid/file.pdf", "originalName": "첨부파일.pdf", ... }
    ]
  }
}
```

- 에디터 이미지: HTML에 URL만
- 첨부파일: DB JSONB에 메타데이터 완전 저장
