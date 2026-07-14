'use client';

import { toast } from 'sonner';
import { FILE_ERRORS } from '@/shared/constants/error-messages';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';
import { Result } from '@/shared/utils/results';
import { type ActionResult } from '@/shared/types/results';

/**
 * Storage의 공개 파일을 다운로드합니다.
 * 버킷이 public이므로 공개 URL을 fetch하여 blob으로 받습니다.
 * (Supabase SDK/anon key 불필요 — 클라이언트는 Storage에 직접 접근하지 않음)
 * @param url - 파일의 공개 URL
 * @param fileName - 다운로드할 파일명
 * @returns 다운로드 성공 여부
 */
export async function downloadFileFromStorage(
  url: string,
  fileName: string
): Promise<ActionResult<void>> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('다운로드 실패:', response.status, response.statusText);
      toast.error(FILE_ERRORS.DOWNLOAD_FAILED);
      return Result.error(FILE_ERRORS.DOWNLOAD_FAILED);
    }

    const data = await response.blob();

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
