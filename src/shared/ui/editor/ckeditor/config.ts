import { APP_CONFIG } from '@/app.config';

/**
 * 에디터 이미지 업로드 설정 타입
 */
export interface UploadConfig {
  /** 업로드 폴더 */
  uploadFolder: string;
  /** 최대 파일 크기 (MB 단위) */
  imageMaxSizeMb: number;
  /** 허용되는 이미지 형식 (MIME 타입) */
  acceptedFormats: string[];
  /** 업로드 타임아웃 (ms) */
  uploadTimeoutMS: number;
}

/**
 * 기본 이미지 업로드 설정
 */
export const UPLOAD_CONFIG: UploadConfig = {
  uploadFolder: APP_CONFIG.EDITOR.UPLOAD_ROOT,
  imageMaxSizeMb: APP_CONFIG.EDITOR.IMAGE_MAX_SIZE_MB,
  acceptedFormats: [...APP_CONFIG.EDITOR.IMAGE_ACCEPTED_FORMATS],
  uploadTimeoutMS: APP_CONFIG.FILE.UPLOAD_TIMEOUT_MS,
};
