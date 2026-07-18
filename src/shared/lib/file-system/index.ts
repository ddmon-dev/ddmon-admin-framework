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

// Upload (클라이언트 전용)
export { uploadFormFiles } from './upload';

// Download (클라이언트 전용)
export { downloadFileFromStorage } from './download';

// Cleanup (Server Actions 전용)
export { getOldFiles, cleanupDeletedFiles } from './cleanup';

// Storage (Server Actions 전용)
export { BUCKET_NAME } from '../supabase/constants';
export { deleteFilesFromStorage, deleteFolderFromStorage } from '../supabase/storage';

// Utils
export {
  extractFilePathFromUrl,
  generateUniqueFileName,
  createDbFileMetadata,
  extractAllFileUrls,
  transformFilesToUploadValues,
} from './utils';

// Schemas (Zod 검증)
export { createFilesSchema, dbFilesSchema } from './schemas';
