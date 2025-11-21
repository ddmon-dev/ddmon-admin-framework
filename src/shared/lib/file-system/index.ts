/**
 * 파일 시스템 모듈
 * Storage Provider 독립적인 파일 관리 시스템
 */

// Types
export type {
  FileMetadata,
  FileUploadValue,
  TableName,
  PresignedUploadInfo,
} from './types';

// Operations
export {
  getEntityFiles,
  deleteEntityFiles,
  hardDeleteEntityFiles,
  deleteSpecificFiles,
  getPresignedUploadUrls,
  saveUploadedFilesMetadata,
  deleteFilesByUrls,
} from './operations';

// Utils
export {
  generateUniqueFileName,
  createFileMetadata,
} from './utils';

// Client (브라우저 전용)
export {
  uploadFileWithPresignedUrl,
  uploadMultipleFilesWithPresignedUrl,
} from './client';

// Schemas (Zod 검증)
export {
  fileUploadValueSchema,
  createFilesSchema,
} from './schemas';

// Upload Helper (클라이언트 전용)
export { processFileUploads } from './upload-helper';
