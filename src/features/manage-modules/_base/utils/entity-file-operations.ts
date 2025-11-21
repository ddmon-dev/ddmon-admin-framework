'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import {
  uploadFileToStorage,
  deleteFileFromStorage,
  createPresignedUploadUrl,
} from '@/shared/lib/supabase/storage';
import {
  createFileMetadata,
  generateUniqueFileName,
  type FileMetadata,
} from '@/shared/lib/supabase/file-helpers';
import type { FileUploadValue, FilesInput } from '@/shared/lib/supabase/file-processing';

/**
 * 엔티티 타입 (새 모듈 추가 시 여기에 추가)
 * 실제 DB 테이블명과 일치시킵니다
 */
export type EntityType = 'notices' | 'products' | 'posts' | 'users';

/**
 * Presigned URL 업로드 정보
 */
export type PresignedUploadInfo = {
  uploadUrl: string;
  publicUrl: string;
  filePath: string;
  originalName: string;
  category: string;
};

/**
 * 엔티티의 파일 목록 조회
 *
 * @param entityType - 엔티티 타입 (예: 'notice')
 * @param entityId - 엔티티 ID
 * @returns 카테고리별로 그룹화된 파일 메타데이터
 *
 * @example
 * const files = await getEntityFiles('notice', noticeId);
 * // 결과: { thumbnail: [FileMetadata], attachments: [FileMetadata, ...] }
 */
export async function getEntityFiles(
  entityType: EntityType,
  entityId: string
): Promise<Record<string, FileMetadata[]>> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .eq('deleted', false);

  if (error) {
    console.error('Failed to fetch entity files:', error);
    return {};
  }

  // 카테고리별로 그룹화
  return data.reduce(
    (acc: Record<string, FileMetadata[]>, file: any) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push({
        url: file.url,
        originalName: file.original_name,
        size: file.size,
        mimeType: file.mime_type,
        uploadedAt: file.uploaded_at,
      });
      return acc;
    },
    {} as Record<string, FileMetadata[]>
  );
}

/**
 * 엔티티에 파일 생성 (업로드 + DB 저장)
 *
 * @param entityType - 엔티티 타입
 * @param entityId - 엔티티 ID
 * @param filesInput - 폼의 files 객체
 * @returns void
 *
 * @example
 * await createEntityFiles('notice', noticeId, {
 *   thumbnail: [{ type: 'new', file: File }],
 *   attachments: [{ type: 'new', file: File }, ...],
 * });
 */
export async function createEntityFiles(
  entityType: EntityType,
  entityId: string,
  filesInput?: FilesInput
): Promise<void> {
  if (!filesInput) return;

  const supabase = createServerClient();
  const folder = `${entityType}/${entityId}`;
  const uploadedUrls: string[] = [];

  try {
    const records: Array<{
      entity_type: string;
      entity_id: string;
      category: string;
      url: string;
      original_name: string;
      size: number;
      mime_type: string;
    }> = [];

    // 각 카테고리별로 처리
    for (const [category, files] of Object.entries(filesInput)) {
      if (!files || files.length === 0) continue;

      // 새 파일만 추출
      const newFiles = files.filter(
        (f): f is Extract<FileUploadValue, { type: 'new' }> => f?.type === 'new'
      );

      // 새 파일 업로드
      for (const fileItem of newFiles) {
        const file = fileItem.file;
        const fileName = generateUniqueFileName(file.name);
        const filePath = `${folder}/${fileName}`;

        // Storage 업로드
        const uploadResult = await uploadFileToStorage(file, filePath);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || '파일 업로드 실패');
        }

        uploadedUrls.push(uploadResult.data.url);

        // DB 레코드 준비
        const metadata = createFileMetadata(file, uploadResult.data.url);
        records.push({
          entity_type: entityType,
          entity_id: entityId,
          category,
          url: metadata.url,
          original_name: metadata.originalName,
          size: metadata.size,
          mime_type: metadata.mimeType,
        });
      }
    }

    // DB에 일괄 삽입
    if (records.length > 0) {
      const { error } = await supabase.from('files').insert(records);

      if (error) {
        throw new Error(error.message);
      }
    }
  } catch (error) {
    // 롤백: 업로드된 파일 삭제
    if (uploadedUrls.length > 0) {
      await Promise.allSettled(uploadedUrls.map(url => deleteFileFromStorage(url)));
    }
    throw error;
  }
}

/**
 * 엔티티 파일 업데이트
 *
 * @param entityType - 엔티티 타입
 * @param entityId - 엔티티 ID
 * @param filesInput - 폼의 files 객체
 * @returns void
 *
 * @example
 * await updateEntityFiles('notice', noticeId, {
 *   thumbnail: [{ type: 'existing', url: '...', originalName: '...', markedForDeletion: true }],
 *   attachments: [{ type: 'new', file: File }],
 * });
 */
export async function updateEntityFiles(
  entityType: EntityType,
  entityId: string,
  filesInput?: FilesInput
): Promise<void> {
  if (!filesInput) return;

  const supabase = createServerClient();

  // 1. 삭제 표시된 파일 URL 추출
  const deletedUrls: string[] = [];
  for (const files of Object.values(filesInput)) {
    if (files) {
      const markedFiles = files.filter(
        (f): f is Extract<FileUploadValue, { type: 'existing' }> =>
          f?.type === 'existing' && f.markedForDeletion === true
      );
      deletedUrls.push(...markedFiles.map(f => f.url));
    }
  }

  // 2. 새 파일 추가
  await createEntityFiles(entityType, entityId, filesInput);

  // 3. 삭제 표시된 파일 처리
  if (deletedUrls.length > 0) {
    // DB에서 soft delete
    await supabase
      .from('files')
      .update({ deleted: true })
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .in('url', deletedUrls);

    // Storage에서 삭제
    await Promise.allSettled(deletedUrls.map(url => deleteFileFromStorage(url)));
  }
}

/**
 * 엔티티의 모든 파일 Soft Delete (복구 가능)
 *
 * @param entityType - 엔티티 타입
 * @param entityId - 엔티티 ID
 * @returns void
 *
 * @example
 * await deleteEntityFiles('notices', noticeId);
 */
export async function deleteEntityFiles(
  entityType: EntityType,
  entityId: string
): Promise<void> {
  const supabase = createServerClient();

  // DB에서 soft delete (Storage 파일은 유지)
  await supabase
    .from('files')
    .update({ deleted: true })
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .eq('deleted', false);
}

/**
 * 엔티티의 모든 파일 Hard Delete (영구 삭제, 복구 불가)
 *
 * @param entityType - 엔티티 타입
 * @param entityId - 엔티티 ID
 * @returns void
 *
 * @example
 * await hardDeleteEntityFiles('notices', noticeId);
 */
export async function hardDeleteEntityFiles(
  entityType: EntityType,
  entityId: string
): Promise<void> {
  const supabase = createServerClient();

  // 1. 파일 목록 조회 (deleted = true인 파일 포함)
  const { data: files } = await supabase
    .from('files')
    .select('url')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId);

  if (files && files.length > 0) {
    // 2. Storage에서 삭제
    const urls = files.map((f: any) => f.url);
    await Promise.allSettled(urls.map((url: string) => deleteFileFromStorage(url)));
  }

  // 3. DB에서 실제 삭제 (DELETE)
  await supabase
    .from('files')
    .delete()
    .eq('entity_type', entityType)
    .eq('entity_id', entityId);
}

/**
 * 클라이언트 업로드를 위한 Presigned URL 발급 (여러 파일)
 *
 * @param entityType - 엔티티 타입
 * @param entityId - 엔티티 ID
 * @param fileInfos - 파일 정보 배열 (originalName, category)
 * @returns Presigned URL 배열
 *
 * @example
 * const urls = await getPresignedUploadUrls('notice', noticeId, [
 *   { originalName: '파일1.pdf', category: 'attachments' },
 *   { originalName: '썸네일.jpg', category: 'thumbnail' },
 * ]);
 * // 클라이언트에서 urls를 사용해 파일 업로드
 */
export async function getPresignedUploadUrls(
  entityType: EntityType,
  entityId: string,
  fileInfos: Array<{ originalName: string; category: string }>
): Promise<PresignedUploadInfo[]> {
  const folder = `${entityType}/${entityId}`;
  const results: PresignedUploadInfo[] = [];

  for (const fileInfo of fileInfos) {
    const uniqueFileName = generateUniqueFileName(fileInfo.originalName);
    const filePath = `${folder}/${uniqueFileName}`;

    const result = await createPresignedUploadUrl(filePath);

    if (!result.success) {
      throw new Error(result.error || 'Presigned URL 발급 실패');
    }

    results.push({
      uploadUrl: result.data.uploadUrl,
      publicUrl: result.data.publicUrl,
      filePath: result.data.filePath,
      originalName: fileInfo.originalName,
      category: fileInfo.category,
    });
  }

  return results;
}

/**
 * 클라이언트 업로드 완료 후 메타데이터를 DB에 저장
 *
 * @param entityType - 엔티티 타입
 * @param entityId - 엔티티 ID
 * @param uploadedFiles - 업로드된 파일 정보 (publicUrl, originalName, size, mimeType, category)
 * @returns void
 *
 * @example
 * // 클라이언트에서 파일 업로드 완료 후 호출
 * await saveUploadedFilesMetadata('notice', noticeId, [
 *   { publicUrl: '...', originalName: '파일1.pdf', size: 1024, mimeType: 'application/pdf', category: 'attachments' },
 * ]);
 */
export async function saveUploadedFilesMetadata(
  entityType: EntityType,
  entityId: string,
  uploadedFiles: Array<{
    publicUrl: string;
    originalName: string;
    size: number;
    mimeType: string;
    category: string;
  }>
): Promise<void> {
  const supabase = createServerClient();

  const records = uploadedFiles.map(file => ({
    entity_type: entityType,
    entity_id: entityId,
    category: file.category,
    url: file.publicUrl,
    original_name: file.originalName,
    size: file.size,
    mime_type: file.mimeType,
  }));

  const { error } = await supabase.from('files').insert(records);

  if (error) {
    throw new Error(error.message);
  }
}
