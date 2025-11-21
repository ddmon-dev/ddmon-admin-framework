import { type FileMetadata } from './types';

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
export function createFileMetadata(file: File, url: string): FileMetadata {
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
export function extractAllFileUrls(files?: Record<string, FileMetadata[]>): string[] {
  if (!files) return [];

  const urls: string[] = [];

  for (const fileList of Object.values(files)) {
    if (Array.isArray(fileList)) {
      urls.push(...fileList.map(file => file.url));
    }
  }

  return urls;
}
