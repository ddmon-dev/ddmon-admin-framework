# 파일 시스템

프로젝트에는 두 가지 파일 업로드 시스템이 있습니다.

| 구분 | FormFileUpload | 에디터 이미지 업로드 |
|------|---------------|----------------------|
| **용도** | 폼 첨부파일 | 에디터 내 이미지 |
| **Storage 경로** | `{테이블명}/{엔티티ID}/` | `editor/{엔티티}/{날짜}/` |
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

export type ItemDTO = WithFiles<CamelCaseKeys<RowData>>;
// WithFiles<T>는 T & { files?: DbFilesJSONB }로 확장
```

#### 2. 폼 스키마

```typescript
// notice/item-form.tsx
import { schemaPresets } from '@/shared/schemas';

const formSchema = z.object({
  title: z.string().min(1),
  files: schemaPresets.files({ thumbnail: 0, attachments: 0 }),
});
```

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

#### 4. 폼 제출 (item-form.tsx)

```typescript
import { uploadFormFiles, type FormFilesField } from '@/shared/lib/file-system';

async function onSubmit(values: FormValues) {
  const { files: formFiles, ...restValues } = values;

  // 1. 데이터 DB 저장 (파일 제외)
  const { success, data, error } = id
    ? await updateItem({ id, values: restValues, pathname })
    : await createItem({ values: restValues, pathname });

  if (!success || !data) {
    toast.error(error);
    return;
  }

  // 2. 파일 업로드 (Presigned URL → Storage → DB 메타데이터)
  await uploadFormFiles({
    formFiles: formFiles as FormFilesField,
    id: data.id,
    tableName: CONFIG.tableName,
    pathname,
    updateAction: updateItem,
  });

  toast.success('저장되었습니다.');
}
```

### 핵심 함수

**uploadFormFiles()** (클라이언트 전용)

폼 파일을 Storage에 업로드하고 DB에 메타데이터를 저장합니다.

```typescript
import { uploadFormFiles, type FormFilesField } from '@/shared/lib/file-system';

await uploadFormFiles({
  formFiles: formFiles as FormFilesField,
  id: data.id,
  tableName: CONFIG.tableName,
  pathname,
  updateAction: updateItem,
});
```

**getOldFiles() / cleanupDeletedFiles()** (Server Action 전용)

수정 시 삭제된 파일을 Storage에서 정리합니다. `_base/actions/update-item.ts`에서 자동 처리됩니다.

```typescript
// update-item.ts 내부 (자동 처리됨)
const oldFiles = await getOldFiles({ supabase, tableName, id, values });
// ... DB 업데이트 ...
await cleanupDeletedFiles({ oldFiles, newFiles: values.files });
```

**deleteFilesFromStorage() / deleteFolderFromStorage()** (Server Action 전용)

```typescript
import { deleteFilesFromStorage, deleteFolderFromStorage } from '@/shared/lib/file-system';

// URL 배열로 파일 삭제
await deleteFilesFromStorage(['https://...', 'https://...']);

// 폴더 전체 삭제 (Hard Delete 시)
await deleteFolderFromStorage(`notices/${id}`);
```

**downloadFileFromStorage()** (클라이언트 전용)

Storage에서 파일을 다운로드합니다. 첨부파일 목록에서 다운로드 버튼 구현 시 사용합니다.

```typescript
import { downloadFileFromStorage } from '@/shared/lib/file-system';

// 파일 다운로드 (토스트 알림 포함)
await downloadFileFromStorage(file.url, file.originalName);
```

---

## 에디터 이미지 업로드

### 핵심 개념

**1. Presigned URL 패턴**

```
클라이언트: 이미지 선택
  ↓
Server Action: Presigned URL 발급
  ↓
클라이언트: Storage에 직접 업로드
  ↓
Tiptap: 공개 URL을 HTML에 삽입
```

**보안**: 서버에서 URL 발급, 토큰 만료 (60초)
**성능**: 서버를 거치지 않고 Storage 직접 업로드

**2. 자동 경로 생성**

entity prop 전달 시 자동으로 경로 생성

```
{rootFolder}/{entity}/{YYYYMMDD}/

예: "editor/notices/20250124/"
```

**3. 경로 우선순위**

```typescript
// 1순위: 명시적 uploadFolder (커스텀)
<TiptapEditor uploadFolder="custom/path" entity="notices" />
// → "custom/path"

// 2순위: entity 기반 자동 생성 (권장)
<TiptapEditor entity="notices" />
// → "editor/notices/20250124"

// 3순위: 기본값
<TiptapEditor />
// → "editor"
```

### 사용 방법

#### 기본 사용 (권장)

```typescript
// notice/item-form.tsx
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

### 환경변수

**NEXT_PUBLIC_EDITOR_UPLOAD_ROOT**

```bash
# .env.local
NEXT_PUBLIC_EDITOR_UPLOAD_ROOT=editor
```

기본값: `'editor'`

### 주의사항

**이미지 삭제 로직 없음**

- 에디터에서 이미지 삭제 → HTML에서만 제거
- Storage에는 파일 남음

**대응 방안:**
- 주기적으로 사용하지 않는 파일 정리
- 날짜별 폴더 분석하여 오래된 파일 삭제

---

## 비교 요약

### FormFileUpload (manage-modules)
- DB JSONB에 메타데이터 저장
- 삭제 시 Storage도 자동 삭제
- 파일 관리 완전 제어

### Tiptap
- HTML에 URL만 임베딩
- 자동 삭제 없음
- 가볍고 빠름

**실무 시나리오:**

```typescript
<form>
  <FormInput name='title' />

  {/* Tiptap: 본문 이미지 */}
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

- Tiptap 이미지: HTML에 URL만
- 첨부파일: DB JSONB에 메타데이터 완전 저장
