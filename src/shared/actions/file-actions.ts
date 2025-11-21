'use server';

import { createServerClient } from '@/shared/lib/supabase/server';
import {
  deleteFilesByUrls,
  getPresignedUploadUrls as getPresignedUrls,
  saveUploadedFilesMetadata as saveMetadata,
  type PresignedUploadInfo,
} from '@/shared/lib/file-system';
import { type ActionResult } from '@/shared/types/server-actions';

/**
 * 파일 업로드를 위한 Presigned URL 발급
 *
 * @param entityType - 엔티티 타입 (예: 'notices', 'products')
 * @param entityId - 엔티티 ID
 * @param fileInfos - 파일 정보 배열
 * @returns Presigned URL 정보
 *
 * @example
 * const { data } = await prepareFileUpload('notices', noticeId, [
 *   { originalName: 'file.pdf', category: 'attachments' }
 * ]);
 */
export async function prepareFileUpload(
  entityType: string,
  entityId: string,
  fileInfos: Array<{ originalName: string; category: string }>
): Promise<ActionResult<PresignedUploadInfo[]>> {
  try {
    const urls = await getPresignedUrls(entityType, entityId, fileInfos);
    return { success: true, data: urls };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Presigned URL 발급 실패',
    };
  }
}

/**
 * 업로드 완료 후 파일 메타데이터 저장
 *
 * @param entityType - 엔티티 타입 (예: 'notices', 'products')
 * @param entityId - 엔티티 ID
 * @param uploadedFiles - 업로드된 파일 정보
 * @returns 성공 여부
 *
 * @example
 * await saveFileMetadata('notices', noticeId, [
 *   { publicUrl: '...', originalName: 'file.pdf', size: 1024, mimeType: 'application/pdf', category: 'attachments' }
 * ]);
 */
export async function saveFileMetadata(
  entityType: string,
  entityId: string,
  uploadedFiles: Array<{
    publicUrl: string;
    originalName: string;
    size: number;
    mimeType: string;
    category: string;
  }>
): Promise<ActionResult<void>> {
  try {
    await saveMetadata(entityType, entityId, uploadedFiles);
    return { success: true, data: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 메타데이터 저장 실패',
    };
  }
}

/**
 * 엔티티의 특정 파일들을 Hard Delete (영구 삭제)
 * 게시글 수정 시 사용자가 명시적으로 삭제한 파일은 복구 불가
 *
 * @param entityType - 엔티티 타입 (예: 'notices', 'products')
 * @param entityId - 엔티티 ID
 * @param fileUrls - 삭제할 파일 URL 배열
 * @returns 성공 여부
 *
 * @example
 * await deleteEntityFiles('notices', noticeId, ['https://...', 'https://...']);
 */
export async function deleteEntityFiles(
  entityType: string,
  entityId: string,
  fileUrls: string[]
): Promise<ActionResult<void>> {
  try {
    if (fileUrls.length === 0) {
      return { success: true, data: undefined };
    }

    const supabase = createServerClient();

    // 1. Storage에서 삭제
    await deleteFilesByUrls(fileUrls);

    // 2. DB에서 실제 삭제 (DELETE)
    await supabase
      .from('files')
      .delete()
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .in('url', fileUrls);

    return { success: true, data: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 삭제 실패',
    };
  }
}
