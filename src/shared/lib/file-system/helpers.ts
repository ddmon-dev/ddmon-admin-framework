'use client';

import { processFileUploads, type FormFilesField } from './';

/**
 * 폼 파일 업로드 처리 헬퍼 함수 (클라이언트 전용)
 *
 * 폼에서 제출된 파일을 Storage에 업로드하고 DB에 메타데이터를 저장
 * 업로드는 Presigned URL 방식을 사용
 *
 * @param formFiles - 폼에서 제출된 파일 데이터
 * @param id - 아이템 ID (Storage 폴더명으로 사용)
 * @param tableName - 테이블명 (Storage 폴더명으로 사용)
 * @param pathname - 현재 경로 (revalidatePath용)
 * @param updateAction - 아이템 업데이트 Server Action
 *
 * @example
 * ```typescript
 * await uploadFormFiles({
 *   formFiles,
 *   id: data.id,
 *   tableName: CONFIG.tableName,
 *   pathname,
 *   updateAction: updateItem,
 * });
 * ```
 */
export async function uploadFormFiles({
  formFiles,
  id,
  tableName,
  pathname,
  updateAction,
}: {
  formFiles?: FormFilesField;
  id: string;
  tableName: string;
  pathname: string;
  updateAction: (params: { id: string; values: any; pathname: string }) => Promise<any>;
}): Promise<void> {
  // 파일 유무 체크
  const hasFormFiles =
    formFiles &&
    Object.values(formFiles).some(fileList => Array.isArray(fileList) && fileList.length > 0);

  if (!hasFormFiles) return;

  // 파일 업로드
  const uploadedFilesMetadata = await processFileUploads({
    files: formFiles,
    folder: `${tableName}/${id}`,
  });

  // files JSONB 컬럼 업데이트
  if (Object.keys(uploadedFilesMetadata).length > 0) {
    await updateAction({
      id,
      values: { files: uploadedFilesMetadata },
      pathname,
    });
  }
}
