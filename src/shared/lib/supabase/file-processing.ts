'use server';

import { uploadFileToStorage, deleteFileFromStorage } from './storage';
import { createFileMetadata, generateUniqueFileName, type FileMetadata } from './file-helpers';

/**
 * 폼에서 받은 파일 업로드 값 타입
 */
export type FileUploadValue =
  | { type: 'existing'; url: string; originalName: string; markedForDeletion?: boolean }
  | { type: 'new'; file: File }
  | null;

/**
 * 폼의 files 객체 타입 (예: {thumbnail: [...], attachments: [...]})
 */
export type FilesInput = Record<string, FileUploadValue[] | undefined>;

/**
 * 처리된 파일 메타데이터 (예: {thumbnail: [...], attachments: [...]})
 */
export type ProcessedFiles = Record<string, FileMetadata[]>;

/**
 * 폼에서 받은 files 객체를 처리하여 Storage 업로드 + 메타데이터 반환
 *
 * - 카테고리별로 동적 처리 (thumbnail, attachments 등 하드코딩 없음)
 * - 새 파일만 업로드
 * - 기존 파일 유지 (삭제 표시 제외)
 * - 업로드 실패 시 예외 발생
 *
 * @param filesInput - 폼의 files 객체
 * @param folder - Storage 저장 경로 (예: 'notices/uuid')
 * @returns 업로드된 파일 메타데이터
 *
 * @example
 * const uploadedFiles = await processFiles({
 *   filesInput: {
 *     thumbnail: [{ type: 'new', file: File }],
 *     attachments: [
 *       { type: 'existing', url: '...', originalName: '...' },
 *       { type: 'new', file: File },
 *     ],
 *   },
 *   folder: 'notices/abc-123',
 * });
 * // 결과: { thumbnail: [FileMetadata], attachments: [FileMetadata, FileMetadata] }
 */
export async function processFiles({
  filesInput,
  folder,
}: {
  filesInput?: FilesInput;
  folder: string;
}): Promise<ProcessedFiles> {
  if (!filesInput) return {};

  const result: ProcessedFiles = {};
  const uploadedUrls: string[] = [];

  try {
    // 각 카테고리별로 처리 (thumbnail, attachments, gallery 등)
    for (const [category, files] of Object.entries(filesInput)) {
      if (!files || files.length === 0) continue;

      // 새 파일만 추출
      const newFiles = files
        .filter((f): f is Extract<typeof f, { type: 'new' }> => f?.type === 'new')
        .map(f => f.file);

      // 기존 파일 유지 (삭제 표시 제외)
      const existingFiles: FileMetadata[] = files
        .filter(
          (f): f is Extract<typeof f, { type: 'existing' }> =>
            f?.type === 'existing' && !f.markedForDeletion
        )
        .map(f => ({
          url: f.url,
          originalName: f.originalName,
          size: 0,
          mimeType: '',
          uploadedAt: '',
        }));

      // 새 파일 업로드
      if (newFiles.length > 0) {
        const uploadedMetadata: FileMetadata[] = [];

        for (const file of newFiles) {
          const fileName = generateUniqueFileName(file.name);
          const filePath = `${folder}/${fileName}`;

          const uploadResult = await uploadFileToStorage(file, filePath);

          if (!uploadResult.success) {
            throw new Error(uploadResult.error || '파일 업로드 실패');
          }

          const metadata = createFileMetadata(file, uploadResult.data.url);
          uploadedMetadata.push(metadata);
          uploadedUrls.push(uploadResult.data.url);
        }

        result[category] = [...existingFiles, ...uploadedMetadata];
      } else {
        result[category] = existingFiles;
      }
    }

    return result;
  } catch (error) {
    // 업로드 실패 시 이미 업로드된 파일 자동 삭제 (롤백)
    if (uploadedUrls.length > 0) {
      await Promise.allSettled(uploadedUrls.map(url => deleteFileFromStorage(url)));
    }

    throw error;
  }
}

/**
 * 처리된 파일들을 Storage에서 삭제 (롤백용)
 *
 * @param processedFiles - processFiles 결과
 */
export async function rollbackFiles(processedFiles: ProcessedFiles): Promise<void> {
  const allUrls = Object.values(processedFiles)
    .flat()
    .map(f => f.url);

  if (allUrls.length > 0) {
    await Promise.allSettled(allUrls.map(url => deleteFileFromStorage(url)));
  }
}

/**
 * URL 배열을 Storage에서 삭제
 *
 * @param urls - 삭제할 파일 URL 배열
 */
export async function deleteFilesByUrls(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  await Promise.allSettled(urls.map(url => deleteFileFromStorage(url)));
}
