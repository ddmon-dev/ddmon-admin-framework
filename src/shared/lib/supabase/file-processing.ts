'use server';

import { deleteFileFromStorage } from './storage';

/**
 * 폼에서 받은 파일 업로드 값 타입
 */
export type FileUploadValue =
  | { type: 'existing'; url: string; originalName: string; markedForDeletion?: boolean }
  | { type: 'new'; file: File }
  | null;

/**
 * URL 배열을 Storage에서 삭제
 *
 * @param urls - 삭제할 파일 URL 배열
 */
export async function deleteFilesByUrls(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  await Promise.allSettled(urls.map(url => deleteFileFromStorage(url)));
}
