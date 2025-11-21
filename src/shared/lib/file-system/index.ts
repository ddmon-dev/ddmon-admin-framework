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
  getPresignedUploadUrls,
  saveUploadedFilesMetadata,
  deleteFilesByUrls,
} from './operations';

// Helpers
export {
  generateUniqueFileName,
  createFileMetadata,
} from './helpers';
