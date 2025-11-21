/**
 * 클라이언트 파일 업로드 헬퍼
 * Presigned URL을 사용하여 브라우저에서 직접 Storage에 업로드
 */

import { createMultiplePresignedUploadUrls } from '../supabase/storage';
import { uploadMultipleFilesWithPresignedUrl } from './client';
import { generateUniqueFileName } from './utils';
import { type FileMetadata, type FileUploadValue } from './types';

/**
 * 파일 업로드를 클라이언트에서 직접 처리하고 메타데이터를 반환
 *
 * @param files - 파일 카테고리별 업로드 값
 * @param folder - Storage 저장 폴더 경로 (예: 'notices/uuid')
 * @param onProgress - 전체 업로드 진행률 콜백 (0-100)
 * @returns 카테고리별 파일 메타데이터
 */
export async function processFileUploads({
  files,
  folder,
  onProgress,
}: {
  files?: Record<string, FileUploadValue[]>;
  folder: string;
  onProgress?: (progress: number) => void;
}): Promise<Record<string, FileMetadata[]>> {
  if (!files) return {};

  const result: Record<string, FileMetadata[]> = {};

  // 각 카테고리 처리
  for (const [category, fileList] of Object.entries(files)) {
    if (!fileList) continue;

    const processedFiles: FileMetadata[] = [];

    // 1. 기존 파일 유지 (삭제 표시 안 된 것만)
    const existingFiles = fileList.filter(
      (f): f is Extract<typeof f, { type: 'existing' }> =>
        f?.type === 'existing' && !f.markedForDeletion
    );

    for (const existingFile of existingFiles) {
      // 기존 파일 메타데이터 유지 (간소화된 형태)
      processedFiles.push({
        url: existingFile.url,
        originalName: existingFile.originalName,
        size: 0,
        mimeType: '',
        uploadedAt: new Date().toISOString(),
      });
    }

    // 2. 새 파일 업로드
    const newFiles = fileList.filter(
      (f): f is Extract<typeof f, { type: 'new' }> => f?.type === 'new'
    );

    if (newFiles.length > 0) {
      // Presigned URL 발급 준비
      const uploadRequests = newFiles.map(({ file }) => {
        const fileName = generateUniqueFileName(file.name);
        const filePath = `${folder}/${fileName}`;
        return {
          filePath,
          originalName: file.name,
          file,
        };
      });

      // Presigned URL 발급 (Server Action)
      const presignedResult = await createMultiplePresignedUploadUrls(
        uploadRequests.map(({ filePath, originalName }) => ({ filePath, originalName }))
      );

      if (!presignedResult.success) {
        throw new Error(presignedResult.error || '파일 업로드 URL 발급 실패');
      }

      // 클라이언트에서 직접 업로드
      await uploadMultipleFilesWithPresignedUrl(
        presignedResult.data.map((urlData, index) => ({
          file: uploadRequests[index].file,
          uploadUrl: urlData.uploadUrl,
        })),
        onProgress
      );

      // 메타데이터 생성
      presignedResult.data.forEach((urlData, index) => {
        const file = uploadRequests[index].file;
        processedFiles.push({
          url: urlData.publicUrl,
          originalName: file.name,
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
        });
      });
    }

    if (processedFiles.length > 0) {
      result[category] = processedFiles;
    }
  }

  return result;
}
