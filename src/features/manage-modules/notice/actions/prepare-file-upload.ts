'use server';

import { getPresignedUploadUrls, type PresignedUploadInfo } from '../../_base/utils/entity-file-operations';
import { type ActionResult } from '@/shared/types/server-actions';

interface Params {
  entityId: string;
  fileInfos: Array<{ originalName: string; category: string }>;
}

/**
 * 파일 업로드를 위한 Presigned URL 발급
 */
export async function prepareFileUpload({
  entityId,
  fileInfos
}: Params): Promise<ActionResult<PresignedUploadInfo[]>> {
  try {
    const urls = await getPresignedUploadUrls('notices', entityId, fileInfos);
    return { success: true, data: urls };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Presigned URL 발급 실패'
    };
  }
}
