'use client';

/**
 * 파일 업로드 내부 헬퍼 함수들
 * 직접 사용하지 말고 upload.ts의 uploadFormFiles를 사용하세요
 */

import { GENERAL_ERRORS, FILE_ERRORS } from '@/shared/constants/error-messages';
import { createMultiplePresignedUploadUrls } from '../supabase/storage';
import { generateUniqueFileName } from './utils';
import { type DbFileMetadata, type FormFilesField, type DbFilesJSONB } from './types';

/**
 * 파일 업로드를 클라이언트에서 직접 처리하고 메타데이터를 반환
 *
 * @param files - 파일 카테고리별 업로드 값
 * @param folder - Storage 저장 폴더 경로 (예: 'notices/uuid')
 * @param onProgress - 전체 업로드 진행률 콜백 (0-100)
 * @returns 카테고리별 파일 메타데이터
 * @internal
 */
export async function processFileUploads({
  files,
  folder,
  onProgress,
}: {
  files?: FormFilesField;
  folder: string;
  onProgress?: (progress: number) => void;
}): Promise<DbFilesJSONB> {
  if (!files) return {};

  const result: DbFilesJSONB = {};

  // 각 카테고리 처리
  for (const [category, fileList] of Object.entries(files)) {
    if (!fileList) continue;

    const processedFiles: DbFileMetadata[] = [];

    // 1. 기존 파일 유지 (삭제 표시 안 된 것만)
    const existingFiles = fileList.filter(
      (f): f is Extract<typeof f, { type: 'existing' }> =>
        f?.type === 'existing' && !f.markedForDeletion
    );

    for (const existingFile of existingFiles) {
      // 기존 파일 메타데이터 유지
      processedFiles.push({
        url: existingFile.url,
        originalName: existingFile.originalName,
        size: existingFile.size,
        mimeType: existingFile.mimeType,
        uploadedAt: existingFile.uploadedAt,
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
      await uploadFilesWithPresignedUrl(
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

    // 빈 배열이어도 명시적으로 추가 (해당 카테고리에 파일이 없음을 표시)
    result[category] = processedFiles;
  }

  return result;
}

/**
 * 여러 파일을 Presigned URL로 병렬 업로드
 *
 * @param uploads - 업로드할 파일과 URL 배열
 * @param onProgress - 전체 진행 상태 콜백 (0-100)
 * @internal
 */
export async function uploadFilesWithPresignedUrl(
  uploads: Array<{ file: File; uploadUrl: string }>,
  onProgress?: (progress: number) => void
): Promise<void> {
  const progressMap = new Map<number, number>();
  const totalFiles = uploads.length;

  const updateOverallProgress = () => {
    if (onProgress) {
      const totalProgress =
        Array.from(progressMap.values()).reduce((sum, p) => sum + p, 0) / totalFiles;
      onProgress(Math.round(totalProgress));
    }
  };

  await Promise.all(
    uploads.map((upload, index) =>
      uploadSingleFileWithPresignedUrl(upload.file, upload.uploadUrl, progress => {
        progressMap.set(index, progress);
        updateOverallProgress();
      })
    )
  );
}

/**
 * 단일 파일을 Presigned URL로 업로드 (XHR 사용)
 *
 * @param file - 업로드할 파일
 * @param uploadUrl - Presigned Upload URL
 * @param onProgress - 업로드 진행 상태 콜백 (0-100)
 * @internal
 */
async function uploadSingleFileWithPresignedUrl(
  file: File,
  uploadUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // 진행 상태 추적
    if (onProgress) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });
    }

    // 완료 처리
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error(`업로드 실패: ${xhr.status} ${xhr.statusText}`));
      }
    });

    // 에러 처리
    xhr.addEventListener('error', () => {
      reject(new Error(GENERAL_ERRORS.NETWORK));
    });

    // 타임아웃 처리 (30초)
    xhr.addEventListener('timeout', () => {
      reject(new Error(FILE_ERRORS.UPLOAD_TIMEOUT));
    });

    // 업로드 시작
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.timeout = 30000; // 30초
    xhr.send(file);
  });
}
