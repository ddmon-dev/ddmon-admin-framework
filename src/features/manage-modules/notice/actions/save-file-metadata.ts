'use server';

import { saveUploadedFilesMetadata } from '../../_base/utils/entity-file-operations';
import { type ActionResult } from '@/shared/types/server-actions';

interface Params {
  entityId: string;
  uploadedFiles: Array<{
    publicUrl: string;
    originalName: string;
    size: number;
    mimeType: string;
    category: string;
  }>;
}

/**
 * 업로드 완료 후 파일 메타데이터 저장
 */
export async function saveFileMetadata({
  entityId,
  uploadedFiles
}: Params): Promise<ActionResult<void>> {
  try {
    await saveUploadedFilesMetadata('notices', entityId, uploadedFiles);
    return { success: true, data: undefined };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 메타데이터 저장 실패'
    };
  }
}
