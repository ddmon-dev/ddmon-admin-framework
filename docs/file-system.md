# 파일 시스템

프로젝트에는 두 가지 파일 업로드 시스템이 있습니다.

| 구분 | FormFileUpload | CKEditor 이미지 업로드 |
|------|---------------|----------------------|
| **용도** | 폼 첨부파일 | 에디터 내 이미지 |
| **Storage 경로** | `{모듈명}/{엔티티ID}/` | `editor/{엔티티}/{날짜}/` |
| **DB 저장** | JSONB 메타데이터 | 없음 (HTML에 URL만) |
| **관리** | 삭제 시 Storage도 삭제 | 자동 삭제 없음 |

## FormFileUpload (manage-modules 파일 업로드)

### 핵심 개념

**1. 한글 파일명 지원**

Storage는 한글 파일명을 지원하지 않으므로 UUID로 저장하고 원본 파일명은 DB에 저장합니다.

```typescript
// Storage: 1234567890-abc123.pdf
// DB: { url: "...", name: "한글파일명.pdf", size: 1024, ... }
```

**2. 다중 파일 카테고리**

하나의 엔티티가 여러 종류의 파일을 가질 수 있습니다.

```typescript
files: {
  thumbnail?: DbFileMetadata[];    // 썸네일 (1개)
  attachments?: DbFileMetadata[];  // 첨부파일 (여러 개)
}
```

**3. 자동 롤백**

파일 업로드 후 DB 저장 실패 시 업로드된 파일을 자동 삭제합니다.

### 타입 계층

```typescript
// DB 레이어
type DbFileMetadata = {
  url: string;          // Storage 공개 URL
  name: string;         // 원본 파일명
  size: number;         // 파일 크기 (bytes)
  mimeType: string;     // MIME 타입
  uploadedAt: string;   // 업로드 시각 (ISO)
};

// Form 레이어
type FormFileValue =
  | { type: 'existing'; url: string; name: string; markedForDeletion?: boolean }
  | { type: 'new'; file: File }
  | null;
```

### 사용 방법

#### 1. 타입 정의

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

#### 2. 폼 스키마

```typescript
// notice/item-form.tsx
const formSchema = z.object({
  title: z.string().min(1),
  files: z.object({
    thumbnail: z.array(fileUploadValueSchema).optional(),
    attachments: z.array(fileUploadValueSchema).optional(),
  }).optional(),
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
```

#### 4. Server Action (Create)

```typescript
// actions/create-item.ts
import { processFiles, rollbackFiles } from '@/shared/lib/supabase/file-processing';

export async function createItem({ values, path }: Params) {
  const itemId = crypto.randomUUID();
  let uploadedFiles = {};

  try {
    // 파일 처리
    uploadedFiles = await processFiles({
      filesInput: values.files,
      folder: `notices/${itemId}`,
    });

    // DB 저장
    const { data, error } = await supabase
      .from(tableName)
      .insert({ ...values, id: itemId, files: uploadedFiles })
      .select()
      .single();

    if (error) throw new Error(error.message);
    if (path) revalidatePath(path);

    return { success: true, data };
  } catch (error) {
    await rollbackFiles(uploadedFiles); // 롤백
    return { success: false, error: '생성 실패' };
  }
}
```

#### 5. Server Action (Update)

```typescript
// actions/update-item.ts
export async function updateItem({ id, values, path }: Params) {
  let uploadedFiles = {};
  const deletedUrls: string[] = [];

  try {
    // 삭제 표시된 파일 URL 추출
    if (values.files) {
      for (const files of Object.values(values.files)) {
        const markedFiles = files?.filter(f => f?.type === 'existing' && f.markedForDeletion);
        deletedUrls.push(...markedFiles.map(f => f.url));
      }
    }

    // 파일 처리
    uploadedFiles = await processFiles({
      filesInput: values.files,
      folder: `notices/${id}`,
    });

    // DB 업데이트
    await supabase
      .from(tableName)
      .update({ ...values, files: uploadedFiles })
      .eq('id', id);

    // 삭제 표시된 파일 Storage에서 삭제
    if (deletedUrls.length > 0) {
      await deleteFilesByUrls(deletedUrls);
    }

    if (path) revalidatePath(path);
    return { success: true };
  } catch (error) {
    await rollbackFiles(uploadedFiles);
    return { success: false, error: '업데이트 실패' };
  }
}
```

#### 6. Server Action (Delete)

```typescript
// actions/delete-item.ts
import { deleteFilesByUrls } from '@/shared/lib/supabase/file-processing';

export async function deleteItem({ id, path }: Params) {
  try {
    const { data: item } = await getItem({ id });

    // 모든 카테고리의 파일 URL 추출
    if (item?.files) {
      const allFileUrls = Object.values(item.files).flat().map(f => f.url);
      if (allFileUrls.length > 0) {
        await deleteFilesByUrls(allFileUrls);
      }
    }

    await softDelete(tableName, id);
    if (path) revalidatePath(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: '삭제 실패' };
  }
}
```

### 핵심 함수

**processFiles()**: 파일 업로드 및 메타데이터 생성 (동적 처리)

```typescript
processFiles({
  filesInput: { thumbnail: [...], attachments: [...] },
  folder: 'notices/uuid',
}): Promise<ProcessedFiles>
```

**rollbackFiles()**: 업로드된 파일 삭제 (롤백용)

```typescript
rollbackFiles(processedFiles: ProcessedFiles): Promise<void>
```

**deleteFilesByUrls()**: URL 배열로 파일 삭제

```typescript
deleteFilesByUrls(urls: string[]): Promise<void>
```

---

## CKEditor 이미지 업로드

### 핵심 개념

**1. Presigned URL 패턴**

```
클라이언트: 이미지 선택
  ↓
Server Action: Presigned URL 발급
  ↓
클라이언트: Storage에 직접 업로드
  ↓
CKEditor: 공개 URL을 HTML에 삽입
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
<CKEditor uploadFolder="custom/path" entity="notices" />
// → "custom/path"

// 2순위: entity 기반 자동 생성 (권장)
<CKEditor entity="notices" />
// → "editor/notices/20250124"

// 3순위: 기본값
<CKEditor />
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

### CKEditor
- HTML에 URL만 임베딩
- 자동 삭제 없음
- 가볍고 빠름

**실무 시나리오:**

```typescript
<form>
  <FormInput name='title' />

  {/* CKEditor: 본문 이미지 */}
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
      { "url": "storage.../notices/uuid/file.pdf", "name": "첨부파일.pdf", ... }
    ]
  }
}
```

- CKEditor 이미지: HTML에 URL만
- 첨부파일: DB JSONB에 메타데이터 완전 저장
