/**
 * 파일 시스템 타입 정의
 * Storage Provider 독립적인 도메인 타입
 */

/**
 * DB의 files 필드에 저장되는 파일 메타데이터
 */
export type FileMetadata = {
  url: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
};

/**
 * 폼에서 받은 파일 업로드 값 타입
 */
export type FileUploadValue =
  | {
      type: 'existing';
      url: string;
      originalName: string;
      size: number;
      mimeType: string;
      uploadedAt: string;
      markedForDeletion?: boolean;
    }
  | { type: 'new'; file: File }
  | null;

/**
 * 테이블 이름 (완전히 동적, 제약 없음)
 *
 * 새 도메인 추가 시 코드 수정 불필요
 * DB에서도 제약 없이 동적으로 관리
 *
 * @example
 * 'notices', 'products', 'posts', 'users', 'events', ...
 */
export type TableName = string;

/**
 * Presigned URL 업로드 정보
 */
export type PresignedUploadInfo = {
  uploadUrl: string;
  publicUrl: string;
  filePath: string;
  originalName: string;
  category: string;
};
