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
  | {
      type: 'new';
      file: File;
    }
  | null;

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

/**
 * 파일 업로드 지원 DTO 헬퍼 타입
 *
 * 모든 DTO에 files 필드를 추가하는 제네릭 타입입니다.
 * files는 optional이므로 파일이 없는 모듈에서도 사용 가능합니다.
 *
 * @example
 * // 파일 있는 모듈
 * export type NoticeDTO = WithFiles<CamelCaseKeys<RowData>>;
 *
 * // 파일 없는 모듈 (files는 undefined 또는 {})
 * export type UserDTO = WithFiles<CamelCaseKeys<RowData>>;
 */
export type WithFiles<T> = T & {
  files?: Record<string, FileMetadata[]>;
};
