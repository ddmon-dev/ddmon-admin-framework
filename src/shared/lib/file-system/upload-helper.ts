/**
 * 클라이언트 사이드 파일 업로드 헬퍼 함수
 */

import { uploadFileWithPresignedUrl } from './client';
import {
  getPresignedUploadUrls,
  saveUploadedFilesMetadata,
  deleteSpecificFiles,
} from './operations';
import { type EntityType, type FileUploadValue } from './types';

/**
 * 파일 업로드 옵션
 */
export type UploadFilesOptions = {
  /**
   * 기존 파일 중 삭제 표시된 파일 처리 여부
   * update 시에만 true로 설정
   */
  handleDeletion?: boolean;
};

/**
 * 파일 업로드 통합 처리 함수 (클라이언트 전용)
 *
 * 새 파일 업로드, 메타데이터 저장, 삭제 표시된 파일 처리를 한번에 처리합니다.
 *
 * @param entityType - 엔티티 타입 (예: 'notices')
 * @param entityId - 엔티티 ID
 * @param filesInput - 폼에서 전달된 파일 데이터 (카테고리별)
 * @param options - 업로드 옵션
 * @returns Promise<void>
 *
 * @example
 * // Create 시
 * await processFileUploads('notices', noticeId, values.files);
 *
 * @example
 * // Update 시 (삭제 처리 포함)
 * await processFileUploads('notices', noticeId, values.files, { handleDeletion: true });
 */
export async function processFileUploads(
  entityType: EntityType,
  entityId: string,
  filesInput?: Record<string, any>,
  options: UploadFilesOptions = {}
): Promise<void> {
  if (!filesInput) return;

  const { handleDeletion = false } = options;

  // 1. 새 파일 추출 및 파일 정보 준비
  const newFileInfos: Array<{ file: File; category: string; originalName: string }> = [];

  for (const [category, fileList] of Object.entries(filesInput)) {
    if (!fileList) continue;

    for (const fileValue of fileList) {
      if (!fileValue) continue;
      if (fileValue?.type === 'existing') continue;

      newFileInfos.push({
        file: fileValue.file,
        category,
        originalName: fileValue.file.name,
      });
    }
  }

  // 2. 새 파일 업로드 (Presigned URL 방식)
  if (newFileInfos.length > 0) {
    // Presigned URL 발급
    const presignedInfos = await getPresignedUploadUrls(
      entityType,
      entityId,
      newFileInfos.map(info => ({
        originalName: info.originalName,
        category: info.category,
      }))
    );

    // 파일 업로드 (병렬)
    await Promise.all(
      presignedInfos.map((info, idx) =>
        uploadFileWithPresignedUrl(newFileInfos[idx].file, info.uploadUrl)
      )
    );

    // 메타데이터 저장
    await saveUploadedFilesMetadata(
      entityType,
      entityId,
      presignedInfos.map((info, idx) => ({
        publicUrl: info.publicUrl,
        originalName: info.originalName,
        size: newFileInfos[idx].file.size,
        mimeType: newFileInfos[idx].file.type,
        category: info.category,
      }))
    );
  }

  // 3. 삭제 표시된 파일 처리 (update 시에만)
  if (handleDeletion) {
    const deletedUrls: string[] = [];

    for (const fileList of Object.values(filesInput)) {
      if (!fileList) continue;
      for (const fileValue of fileList) {
        if (fileValue?.type === 'existing' && fileValue.markedForDeletion) {
          deletedUrls.push(fileValue.url);
        }
      }
    }

    if (deletedUrls.length > 0) {
      await deleteSpecificFiles(entityType, entityId, deletedUrls);
    }
  }
}
