'use server';

import { createServerClient } from './server';
import { type ActionResult } from '@/shared/types/server-actions';

const BUCKET_NAME = 'my-bucket';

export type FileUploadResult = ActionResult<{ url: string }>;
export type FileDeleteResult = ActionResult<void>;

/**
 * Supabase Storage에 파일을 업로드합니다.
 *
 * @param file - 업로드할 파일
 * @param path - 저장 경로 (예: 'notices/uuid/filename.pdf')
 * @returns 업로드 결과와 공개 URL
 */
export async function uploadFileToStorage(
  file: File,
  path: string
): Promise<FileUploadResult> {
  try {
    const supabase = createServerClient();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, buffer, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      success: true,
      data: { url: publicUrl },
    };
  } catch (error) {
    console.error('파일 업로드 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 업로드에 실패했습니다.',
    };
  }
}

/**
 * Supabase Storage에서 파일을 삭제합니다.
 *
 * @param url - 삭제할 파일의 공개 URL
 * @returns 삭제 결과
 */
export async function deleteFileFromStorage(url: string): Promise<FileDeleteResult> {
  try {
    const supabase = createServerClient();

    const filePath = extractFilePathFromUrl(url);

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('파일 삭제 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 삭제에 실패했습니다.',
    };
  }
}

/**
 * 공개 URL에서 파일 경로를 추출합니다.
 *
 * @param url - Supabase Storage 공개 URL
 * @returns 파일 경로
 */
function extractFilePathFromUrl(url: string): string {
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
