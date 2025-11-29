import { APP_CONFIG } from '@/app.config';

/**
 * 에디터 이미지 업로드 설정 타입
 */
export interface ImageUploadConfig {
  /** 최대 파일 크기 (MB 단위) */
  maxSizeMB: number;
  /** 허용되는 이미지 형식 (MIME 타입) */
  acceptedFormats: string[];
  /** 기본 업로드 폴더 */
  defaultFolder: string;
}

/**
 * 기본 이미지 업로드 설정
 */
export const DEFAULT_IMAGE_CONFIG: ImageUploadConfig = {
  maxSizeMB: APP_CONFIG.FILE.EDITOR_IMAGE_MAX_SIZE_MB,
  acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  defaultFolder: 'editor',
};
