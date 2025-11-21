'use server';

import { uploadFileToStorage } from '../supabase/storage';
import { type FileMetadata, type FileUploadValue } from './types';

/**
 * 파일 업로드를 처리하고 메타데이터를 반환하는 통합 헬퍼
 *
 * 여러 파일 카테고리(thumbnail, attachments 등)를 동적으로 처리합니다.
 * 기존 파일은 유지하고, 새 파일만 업로드합니다.
 *
 * @param files - 파일 카테고리별 업로드 값 (예: { thumbnail: [...], attachments: [...] })
 * @param folder - Storage 저장 폴더 경로 (예: 'notices/uuid')
 * @returns 카테고리별 파일 메타데이터 (예: { thumbnail: [...], attachments: [...] })
 *
 * @example
 * const uploadedFiles = await processFileUploads({
 *   files: { thumbnail: [...], attachments: [...] },
 *   folder: 'notices/abc-123',
 * });
 * // 결과: { thumbnail: [{ url, originalName, size, mimeType, uploadedAt }], attachments: [...] }
 */
export async function processFileUploads({
  files,
  folder,
}: {
  files?: Record<string, FileUploadValue[]>;
  folder: string;
}): Promise<Record<string, FileMetadata[]>> {
  if (!files) return {};

  const result: Record<string, FileMetadata[]> = {};

  // 각 카테고리(thumbnail, attachments 등)를 동적으로 처리
  for (const [category, fileList] of Object.entries(files)) {
    if (!fileList) continue;

    const processedFiles: FileMetadata[] = [];

    for (const fileValue of fileList) {
      if (!fileValue) continue;

      // 1. 기존 파일 유지 (삭제 표시 안 된 것만)
      if (fileValue.type === 'existing') {
        if (!fileValue.markedForDeletion) {
          // 기존 파일 메타데이터 유지 (URL에서 추출)
          // TODO: 실제로는 DB에서 full metadata를 가져와야 함
          processedFiles.push({
            url: fileValue.url,
            originalName: fileValue.originalName,
            size: 0, // 기존 파일은 size를 모르므로 0
            mimeType: '', // 기존 파일은 mimeType을 모르므로 빈 문자열
            uploadedAt: new Date().toISOString(),
          });
        }
        continue;
      }

      // 2. 새 파일 업로드
      if (fileValue.type === 'new') {
        const file = fileValue.file;

        // 파일명 생성 (timestamp-random-원본파일명)
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${random}-${file.name}`;
        const filePath = `${folder}/${fileName}`;

        // Storage 업로드
        const uploadResult = await uploadFileToStorage(file, filePath);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || '파일 업로드 실패');
        }

        // 메타데이터 생성
        processedFiles.push({
          url: uploadResult.data.url,
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
        });
      }
    }

    if (processedFiles.length > 0) {
      result[category] = processedFiles;
    }
  }

  return result;
}
