'use client';

import { createBrowserClient } from '../supabase/client';
import { toast } from 'sonner';
import { FILE_ERRORS } from '@/shared/constants/error-messages';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { BUCKET_NAME } from '@/shared/lib/supabase/constants';
import { extractFilePathFromUrl } from './utils';
import { Result } from '@/shared/utils/results';
import { type ActionResult } from '@/shared/types/results';

/**
 * Supabase Storage에서 파일을 다운로드합니다.
 * @param url - 파일의 공개 URL
 * @param fileName - 다운로드할 파일명
 * @returns 다운로드 성공 여부
 */
export async function downloadFileFromStorage(
  url: string,
  fileName: string
): Promise<ActionResult<void>> {
  try {
    const supabase = createBrowserClient();
    const filePath = extractFilePathFromUrl(url);

    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(filePath);

    if (error || !data) {
      console.error('다운로드 실패:', error);
      toast.error(FILE_ERRORS.DOWNLOAD_FAILED);
      return Result.error(FILE_ERRORS.DOWNLOAD_FAILED);
    }

    // Blob URL 생성 및 다운로드
    const blobUrl = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    toast.success(SUCCESS_MESSAGES.DOWNLOAD_SUCCESS('파일'));
    return Result.ok();
  } catch (error) {
    console.error('다운로드 에러:', error);
    toast.error(FILE_ERRORS.DOWNLOAD_FAILED);
    return Result.error(FILE_ERRORS.DOWNLOAD_FAILED);
  }
}
