/**
 * 파일 시스템 모듈
 * Storage Provider 독립적인 파일 관리 시스템
 */

// Types
export type {
  FileMetadata,
  FileUploadValue,
  EntityType,
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

// Helpers
export {
  generateUniqueFileName,
  createFileMetadata,
} from './helpers';

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

// Upload Helpers (클라이언트 전용)
export {
  processFileUploads,
  type UploadFilesOptions,
} from './upload-helpers';
