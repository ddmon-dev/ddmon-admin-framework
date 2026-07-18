'use client';

import { type DbFilesJSONB, type FormFilesField } from './types';
import { processFileUploads } from './upload-helpers';
import { generateDatedFolder } from './utils';

/**
 * 폼 파일 업로드 처리 (클라이언트 전용)
 *
 * 폼에서 제출된 파일을 Storage에 업로드하고 메타데이터를 반환합니다.
 * DB 저장은 호출부(write-form)가 이 메타데이터를 create/update에 실어 1회 처리합니다.
 * Presigned URL 방식으로 클라이언트에서 직접 업로드합니다.
 *
 * @param formFiles - 폼에서 제출된 파일 데이터
 * @param tableName - 테이블명 (Storage 폴더 접두어)
 * @returns 카테고리별 파일 메타데이터. 업로드할 파일이 없으면 undefined.
 *
 * @example
 * ```typescript
 * const filesMetadata = await uploadFormFiles({
 *   formFiles,
 *   tableName: CONFIG.tableName,
 * });
 * const values = { ...restValues, ...(filesMetadata && { files: filesMetadata }) };
 * ```
 */
export async function uploadFormFiles({
  formFiles,
  tableName,
}: {
  formFiles?: FormFilesField;
  tableName: string;
}): Promise<DbFilesJSONB | undefined> {
  const hasFormFiles =
    formFiles &&
    Object.values(formFiles).some((fileList) => Array.isArray(fileList) && fileList.length > 0);

  if (!hasFormFiles) return undefined;

  return processFileUploads({
    files: formFiles,
    folder: generateDatedFolder(tableName),
  });
}
