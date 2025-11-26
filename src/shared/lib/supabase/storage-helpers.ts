import { createBrowserClient } from './client';
import { toast } from 'sonner';
import { FILE_ERRORS } from '@/shared/constants/error-messages';
import { SUCCESS_MESSAGES } from '@/shared/constants/success-messages';

export const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET_NAME ?? '';

/**
 * 공개 URL에서 파일 경로를 추출합니다.
 *
 * @param url - Supabase Storage 공개 URL
 * @returns 파일 경로
 */
export function extractFilePathFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    const bucketIndex = pathSegments.findIndex(segment => segment === BUCKET_NAME);

    if (bucketIndex === -1) {
      throw new Error('유효하지 않은 Storage URL입니다.');
    }

    return pathSegments.slice(bucketIndex + 1).join('/');
  } catch (error) {
    throw new Error('URL 파싱에 실패했습니다: ' + url);
  }
}

/**
 * Supabase Storage에서 파일을 다운로드합니다.
 * @param url - 파일의 공개 URL
 * @param fileName - 다운로드할 파일명
 * @returns 다운로드 성공 여부
 */
export async function downloadFileFromStorage(
  url: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createBrowserClient();
    const filePath = extractFilePathFromUrl(url);

    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(filePath);

    if (error || !data) {
      console.error('다운로드 실패:', error);
      toast.error(FILE_ERRORS.DOWNLOAD_FAILED);
      return { success: false, error: FILE_ERRORS.DOWNLOAD_FAILED };
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
    return { success: true };
  } catch (error) {
    console.error('다운로드 에러:', error);
    toast.error(FILE_ERRORS.DOWNLOAD_FAILED);
    return {
      success: false,
      error: FILE_ERRORS.DOWNLOAD_FAILED,
    };
  }
}
