import type { Editor } from '@ckeditor/ckeditor5-core';
import type { FileLoader } from '@ckeditor/ckeditor5-upload';

import { createPresignedUploadUrl } from '@/shared/lib/supabase/storage';
import { generateUniqueFileName } from '@/shared/lib/file-system/utils';
import { mbToBytes } from '@/shared/utils/format';
import { DEFAULT_IMAGE_CONFIG } from './config';
import { GENERAL_ERRORS, FILE_ERRORS } from '@/shared/constants/error-messages';

/**
 * CKEditor 커스텀 업로드 어댑터 설정
 */
interface CustomUploadAdapterConfig {
  /** 업로드 폴더 경로 */
  folder: string;
  /** 최대 파일 크기 (MB 단위) */
  maxSizeMB?: number;
  /** 허용되는 이미지 형식 */
  acceptedFormats?: string[];
}

/**
 * CKEditor 커스텀 업로드 어댑터
 */
class CustomUploadAdapter {
  private loader: FileLoader;
  private config: CustomUploadAdapterConfig;
  private xhr: XMLHttpRequest | null = null;

  constructor(loader: FileLoader, config: CustomUploadAdapterConfig) {
    this.loader = loader;
    this.config = config;
  }

  /**
   * 이미지 업로드 메인 로직
   */
  async upload(): Promise<{ default: string }> {
    const file = await this.loader.file;

    if (!file) {
      throw new Error('파일을 찾을 수 없습니다.');
    }

    // 1. 파일 검증
    this.validateFile(file);

    // 2. 파일명 생성
    const fileName = generateUniqueFileName(file.name);
    const filePath = `${this.config.folder}/${fileName}`;

    // 3. Presigned URL 발급
    const result = await createPresignedUploadUrl(filePath);

    if (!result.success) {
      throw new Error(result.error || FILE_ERRORS.PRESIGNED_URL_FAILED);
    }

    // 4. Storage에 업로드
    await this.uploadToStorage(file, result.data.uploadUrl);

    // 5. 공개 URL 반환
    return {
      default: result.data.publicUrl,
    };
  }

  /**
   * 업로드 취소
   */
  abort(): void {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  /**
   * 파일 검증 (크기, 타입)
   */
  private validateFile(file: File): void {
    const maxSizeMB = this.config.maxSizeMB ?? DEFAULT_IMAGE_CONFIG.maxSizeMB;
    const acceptedFormats = this.config.acceptedFormats ?? DEFAULT_IMAGE_CONFIG.acceptedFormats;

    // 파일 크기 검증
    const maxSizeBytes = mbToBytes(maxSizeMB);
    if (file.size > maxSizeBytes) {
      throw new Error(`이미지 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
    }

    // 파일 타입 검증
    if (!acceptedFormats.includes(file.type)) {
      throw new Error(
        `지원하지 않는 이미지 형식입니다. (지원 형식: ${acceptedFormats.join(', ')})`
      );
    }
  }

  /**
   * Presigned URL로 Storage에 업로드
   */
  private uploadToStorage(file: File, uploadUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.xhr = xhr;

      // 완료 처리
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`업로드 실패: ${xhr.status} ${xhr.statusText}`));
        }
      });

      // 에러 처리
      xhr.addEventListener('error', () => {
        reject(new Error(GENERAL_ERRORS.NETWORK));
      });

      // 타임아웃 처리
      xhr.addEventListener('timeout', () => {
        reject(new Error(FILE_ERRORS.UPLOAD_TIMEOUT));
      });

      // 업로드 시작
      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.timeout = 30000; // 30초
      xhr.send(file);
    });
  }
}

/**
 * CKEditor 플러그인: 커스텀 업로드 어댑터 등록
 *
 * @param config - 업로드 어댑터 설정
 * @returns CKEditor extraPlugins에 전달할 플러그인 함수
 */
export function CustomUploadAdapterPlugin(config: CustomUploadAdapterConfig) {
  return (editor: Editor): void => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
      return new CustomUploadAdapter(loader, config);
    };
  };
}
