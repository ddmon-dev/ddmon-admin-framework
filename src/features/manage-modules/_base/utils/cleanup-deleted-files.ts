'use server';

import type { SupabaseClient } from '@supabase/supabase-js';
import { extractAllFileUrls, deleteFilesFromStorage } from '@/shared/lib/file-system';

/**
 * DB에서 기존 파일 데이터를 조회
 *
 * 파일 업로드가 없는 경우 null 반환
 *
 * @param supabase - Supabase 클라이언트
 * @param tableName - 테이블명
 * @param id - 아이템 ID
 * @param values - 폼에서 제출된 values (파일 업로드 여부 확인용)
 *
 * @example
 * ```typescript
 * const oldFiles = await getOldFiles({
 *   supabase,
 *   tableName: CONFIG.tableName,
 *   id,
 *   values,
 * });
 * ```
 */
export async function getOldFiles(params: {
  supabase: SupabaseClient;
  tableName: string;
  id: string;
  values: any;
}): Promise<any | null> {
  const { supabase, tableName, id, values } = params;

  // 파일 업로드가 없으면 조기 반환
  if (!('files' in values) || !values.files) {
    return null;
  }

  const { data } = await supabase.from(tableName).select('files').eq('id', id).single();

  return data?.files ?? null;
}

/**
 * oldFiles와 newFiles를 비교해서 삭제된 파일을 Storage에서 제거
 *
 * DB 업데이트 후에 호출하여 고아 파일 방지
 *
 * @param oldFiles - DB 업데이트 전에 조회한 기존 파일 데이터
 * @param newFiles - 새로운 파일 데이터 (values.files)
 *
 * @example
 * ```typescript
 * // update-item.ts handler 안에서
 * const oldFiles = await getOldFiles({ supabase, tableName, id, values });
 *
 * // DB 업데이트
 * const { data, error } = await supabase.from(tableName).update(...);
 *
 * // 스토리지 정리
 * await cleanupDeletedFiles({ oldFiles, newFiles: values.files });
 * ```
 */
export async function cleanupDeletedFiles(params: {
  oldFiles?: any;
  newFiles?: any;
}): Promise<{ success: boolean; error?: string }> {
  const { oldFiles, newFiles } = params;

  // 파일이 없으면 조기 반환
  if (!oldFiles || !newFiles) {
    return { success: true };
  }

  try {
    // 삭제된 파일 찾기
    const oldUrls = extractAllFileUrls(oldFiles);
    const newUrls = extractAllFileUrls(newFiles);
    const deletedUrls = oldUrls.filter(url => !newUrls.includes(url));

    // Storage에서 제거
    if (deletedUrls.length > 0) {
      await deleteFilesFromStorage(deletedUrls);
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to cleanup deleted files:', error);
    return {
      success: false,
      error: '파일 삭제 중 오류가 발생했습니다.',
    };
  }
}
