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
