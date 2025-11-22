/**
 * 파일 시스템 모듈
 * JSONB 기반 파일 관리 시스템
 */

// Types
export type { FileMetadata, FileUploadValue, TableName, PresignedUploadInfo } from './types';

// Upload (Server Actions)
export { processFileUploads } from './upload';

// Storage (Server Actions)
export { deleteFilesFromStorage, deleteFolderFromStorage } from '../supabase/storage';

// Utils
export { generateUniqueFileName, createFileMetadata, extractAllFileUrls } from './utils';

// Client (브라우저 전용)
export { uploadFileWithPresignedUrl, uploadMultipleFilesWithPresignedUrl } from './client';

// Schemas (Zod 검증)
export { createFilesSchema } from './schemas';
