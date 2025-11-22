'use server';

import { type ActionResult } from '@/shared/types/server-actions';
import { createServerClient } from './server';
import { BUCKET_NAME, extractFilePathFromUrl } from './storage-helpers';

type ResultData = {
  uploadUrl: string;
  publicUrl: string;
  filePath: string;
};

type PresignedUploadUrlResult = ActionResult<ResultData>;

/**
 * 클라이언트가 직접 업로드할 수 있는 Presigned URL을 발급합니다.
 *
 * @param filePath - 저장 경로 (예: 'notices/uuid/filename.pdf')
 * @returns Presigned Upload URL, 공개 URL, 파일 경로
 *
 * @example
 * const result = await createPresignedUploadUrl('notices/abc-123/file.pdf');
 * // 클라이언트에서: fetch(result.data.uploadUrl, { method: 'PUT', body: file })
 */

export async function createPresignedUploadUrl(
  filePath: string
): Promise<PresignedUploadUrlResult> {
  try {
    const supabase = createServerClient();

    // Presigned URL 발급 (1시간 유효)
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(filePath);

    if (error) {
      throw new Error(error.message);
    }

    // 공개 URL 생성
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

    return {
      success: true,
      data: {
        uploadUrl: data.signedUrl,
        publicUrl,
        filePath: data.path,
      },
    };
  } catch (error) {
    console.error('Presigned URL 발급 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Presigned URL 발급에 실패했습니다.',
    };
  }
}

type MultiPresignedUploadUrlResult = ActionResult<(ResultData & { originalName: string })[]>;

/**
 * 여러 파일에 대한 Presigned URL을 일괄 발급합니다.
 *
 * @param files - 파일 경로와 원본 파일명 배열
 * @returns Presigned URL 배열
 */
export async function createMultiplePresignedUploadUrls(
  files: Array<{ filePath: string; originalName: string }>
): Promise<MultiPresignedUploadUrlResult> {
  try {
    const results = await Promise.all(
      files.map(async ({ filePath, originalName }) => {
        const result = await createPresignedUploadUrl(filePath);
        if (!result.success) {
          throw new Error(result.error || 'Presigned URL 발급 실패');
        }
        return {
          ...result.data,
          originalName,
        };
      })
    );

    return {
      success: true,
      data: results,
    };
  } catch (error) {
    console.error('다중 Presigned URL 발급 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Presigned URL 발급에 실패했습니다.',
    };
  }
}

type FileDeleteResult = ActionResult<void>;

/**
 * Supabase Storage에서 여러 파일을 일괄 삭제합니다.
 *
 * @param urls - 삭제할 파일들의 공개 URL 배열
 * @returns 삭제 결과
 */
export async function deleteFilesFromStorage(urls: string[]): Promise<FileDeleteResult> {
  if (urls.length === 0) {
    return { success: true, data: undefined };
  }

  try {
    const supabase = createServerClient();

    // URL에서 파일 경로 추출
    const filePaths = urls.map(url => extractFilePathFromUrl(url)).filter(Boolean);

    if (filePaths.length === 0) {
      return { success: true, data: undefined };
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove(filePaths);

    if (error) {
      throw new Error(error.message);
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('파일 일괄 삭제 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 삭제에 실패했습니다.',
    };
  }
}

/**
 * Supabase Storage에서 폴더를 재귀적으로 삭제합니다.
 *
 * @param folderPath - 삭제할 폴더 경로 (예: 'notices/uuid')
 * @returns 삭제 결과
 */
export async function deleteFolderFromStorage(folderPath: string): Promise<FileDeleteResult> {
  try {
    const supabase = createServerClient();

    // 폴더 내 모든 파일 목록 조회
    const { data: fileList, error: listError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folderPath);

    if (listError) {
      throw new Error(listError.message);
    }

    // 파일이 없으면 종료
    if (!fileList || fileList.length === 0) {
      return { success: true, data: undefined };
    }

    // 모든 파일 경로 생성
    const filePaths = fileList.map(file => `${folderPath}/${file.name}`);

    // 모든 파일 삭제
    const { error: removeError } = await supabase.storage.from(BUCKET_NAME).remove(filePaths);

    if (removeError) {
      throw new Error(removeError.message);
    }

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    console.error('폴더 삭제 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '폴더 삭제에 실패했습니다.',
    };
  }
}
