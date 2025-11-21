'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import {
  deleteFileFromStorage,
  createPresignedUploadUrl,
} from '@/shared/lib/supabase/storage';
import { generateUniqueFileName } from './utils';
import { type FileMetadata, type TableName, type PresignedUploadInfo } from './types';

/**
 * URL 배열을 Storage에서 삭제
 *
 * @param urls - 삭제할 파일 URL 배열
 */
export async function deleteFilesByUrls(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  await Promise.allSettled(urls.map(url => deleteFileFromStorage(url)));
}

/**
 * 레코드의 특정 파일들을 Hard Delete (영구 삭제)
 * 게시글 수정 시 사용자가 명시적으로 삭제한 파일에 사용
 *
 * @param tableName - 테이블 이름
 * @param parentId - 부모 레코드 ID
 * @param fileUrls - 삭제할 파일 URL 배열
 * @returns void
 *
 * @example
 * await deleteSpecificFiles('notices', noticeId, ['https://...', 'https://...']);
 */
export async function deleteSpecificFiles(
  tableName: TableName,
  parentId: string,
  fileUrls: string[]
): Promise<void> {
  if (fileUrls.length === 0) return;

  const supabase = createServerClient();

  // 1. Storage에서 삭제
  await deleteFilesByUrls(fileUrls);

  // 2. DB에서 실제 삭제 (DELETE)
  await supabase
    .from('files')
    .delete()
    .eq('table_name', tableName)
    .eq('parent_id', parentId)
    .in('url', fileUrls);
}

/**
 * 레코드의 파일 목록 조회
 *
 * @param tableName - 테이블 이름 (예: 'notice')
 * @param parentId - 부모 레코드 ID
 * @returns 카테고리별로 그룹화된 파일 메타데이터
 *
 * @example
 * const files = await getEntityFiles('notice', noticeId);
 * // 결과: { thumbnail: [FileMetadata], attachments: [FileMetadata, ...] }
 */
export async function getEntityFiles(
  tableName: TableName,
  parentId: string
): Promise<Record<string, FileMetadata[]>> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('table_name', tableName)
    .eq('parent_id', parentId)
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
 * 레코드의 모든 파일 Soft Delete (복구 가능)
 *
 * @param tableName - 테이블 이름
 * @param parentId - 부모 레코드 ID
 * @returns void
 *
 * @example
 * await deleteEntityFiles('notices', noticeId);
 */
export async function deleteEntityFiles(
  tableName: TableName,
  parentId: string
): Promise<void> {
  const supabase = createServerClient();

  // DB에서 soft delete (Storage 파일은 유지)
  await supabase
    .from('files')
    .update({ deleted: true })
    .eq('table_name', tableName)
    .eq('parent_id', parentId)
    .eq('deleted', false);
}

/**
 * 레코드의 모든 파일 Hard Delete (영구 삭제, 복구 불가)
 *
 * @param tableName - 테이블 이름
 * @param parentId - 부모 레코드 ID
 * @returns void
 *
 * @example
 * await hardDeleteEntityFiles('notices', noticeId);
 */
export async function hardDeleteEntityFiles(
  tableName: TableName,
  parentId: string
): Promise<void> {
  const supabase = createServerClient();

  // 1. 파일 목록 조회 (deleted = true인 파일 포함)
  const { data: files } = await supabase
    .from('files')
    .select('url')
    .eq('table_name', tableName)
    .eq('parent_id', parentId);

  if (files && files.length > 0) {
    // 2. Storage에서 삭제
    const urls = files.map((f: any) => f.url);
    await Promise.allSettled(urls.map((url: string) => deleteFileFromStorage(url)));
  }

  // 3. DB에서 실제 삭제 (DELETE)
  await supabase
    .from('files')
    .delete()
    .eq('table_name', tableName)
    .eq('parent_id', parentId);
}

/**
 * 클라이언트 업로드를 위한 Presigned URL 발급 (여러 파일)
 *
 * @param tableName - 테이블 이름
 * @param parentId - 부모 레코드 ID
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
  tableName: TableName,
  parentId: string,
  fileInfos: Array<{ originalName: string; category: string }>
): Promise<PresignedUploadInfo[]> {
  const folder = `${tableName}/${parentId}`;
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
 * @param tableName - 테이블 이름
 * @param parentId - 부모 레코드 ID
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
  tableName: TableName,
  parentId: string,
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
    table_name: tableName,
    parent_id: parentId,
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
