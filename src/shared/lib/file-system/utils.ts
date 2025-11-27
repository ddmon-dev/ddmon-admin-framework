import { type DbFileMetadata, type FormFileValue } from './types';
import { BUCKET_NAME } from '@/shared/lib/supabase/constants';

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
 * 파일명 생성: UUID + 확장자만 (한글 완벽 지원)
 * 원본 파일명은 메타데이터에 별도 저장
 *
 * @param originalFileName - 원본 파일명
 * @returns UUID 기반 파일명 (예: "1234567890-abc123.pdf")
 */
export function generateUniqueFileName(originalFileName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);

  const lastDotIndex = originalFileName.lastIndexOf('.');
  const extension = lastDotIndex !== -1 ? originalFileName.substring(lastDotIndex) : '';

  return `${timestamp}-${randomStr}${extension}`;
}

/**
 * 파일 메타데이터 생성
 *
 * @param file - File 객체
 * @param url - Storage 공개 URL
 * @returns
 *  url: string;
 *  originalName: string;
 *  size: number;
 *  mimeType: string;
 *  uploadedAt: string;
 */
export function createDbFileMetadata(file: File, url: string): DbFileMetadata {
  return {
    url,
    originalName: file.name,
    size: file.size,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * JSONB files 객체에서 모든 파일 URL을 추출합니다.
 *
 * @param files - JSONB files 객체 (예: { thumbnail: [...], attachments: [...] })
 * @returns 모든 파일 URL 배열
 *
 * @example
 * const urls = extractAllFileUrls({ thumbnail: [{ url: '...' }], attachments: [{ url: '...' }] });
 * // 결과: ['url1', 'url2', 'url3']
 */
export function extractAllFileUrls(files?: Record<string, DbFileMetadata[]>): string[] {
  if (!files) return [];

  const urls: string[] = [];

  for (const fileList of Object.values(files)) {
    if (Array.isArray(fileList)) {
      urls.push(...fileList.map(file => file.url));
    }
  }

  return urls;
}

/**
 * DB files 객체를 폼 업로드 형태로 변환
 * DbFileMetadata[] → FormFileValue[] (type: 'existing')
 *
 * @param files - DB에서 조회한 files 객체
 * @returns 폼에서 사용할 수 있는 형태로 변환된 files 객체
 *
 * @example
 * // DB에서 조회한 데이터
 * const item = { files: { thumbnail: [{ url: '...', originalName: '...' }] } };
 *
 * // 폼 초기값으로 변환
 * const formValues = {
 *   ...item,
 *   files: transformFilesToUploadValues(item.files)
 * };
 */
export function transformFilesToUploadValues(
  files?: Record<string, DbFileMetadata[]>
): Record<string, FormFileValue[]> | undefined {
  if (!files) return undefined;

  return Object.fromEntries(
    Object.entries(files).map(([category, fileList]) => [
      category,
      fileList.map(file => ({
        type: 'existing' as const,
        ...file,
      })),
    ])
  );
}
