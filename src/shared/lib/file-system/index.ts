/**
 * 파일 시스템 모듈
 * JSONB 기반 파일 관리 시스템
 */

// Types
export type {
  DbFileMetadata,
  DbFilesJSONB,
  FormFileValue,
  FormFilesField,
  WithFiles,
} from './types';

// Upload (Presigned URL 방식)
export { processFileUploads } from './upload';

// Storage (Server Actions 전용)
export { deleteFilesFromStorage, deleteFolderFromStorage } from '../supabase/storage';

// Utils
export {
  generateUniqueFileName,
  createDbFileMetadata,
  extractAllFileUrls,
  transformFilesToUploadValues,
} from './utils';

// Client (브라우저 전용)
export { uploadFilesWithPresignedUrl } from './client';

// Schemas (Zod 검증)
export { createFilesSchema } from './schemas';
