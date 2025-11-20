import type { Editor } from '@tiptap/react';
import { toast } from 'sonner';

import { createPresignedUploadUrl } from '@/shared/lib/supabase/storage';
import { generateUniqueFileName } from '@/shared/lib/file-system/utils';
import { mbToBytes } from '@/shared/utils/formats';
import { GENERAL_ERRORS, FILE_ERRORS } from '@/shared/constants/error-messages';
import { UPLOAD_CONFIG } from './config';
import { releaseNodeSelection } from './extensions';

/**
 * 에디터 이미지 업로드 설정
 */
export interface EditorUploadConfig {
  /** 업로드 폴더 경로 */
  folder: string;
  /** 최대 파일 크기 (MB 단위) */
  maxSizeMB?: number;
  /** 허용되는 이미지 형식 */
  acceptedFormats?: string[];
}

/**
 * 파일 검증 (크기, 타입)
 */
function validateFile(file: File, config: EditorUploadConfig): void {
  const maxSizeMB = config.maxSizeMB ?? UPLOAD_CONFIG.imageMaxSizeMb;
  const acceptedFormats = config.acceptedFormats ?? UPLOAD_CONFIG.acceptedFormats;

  const maxSizeBytes = mbToBytes(maxSizeMB);
  if (file.size > maxSizeBytes) {
    throw new Error(`이미지 크기는 ${maxSizeMB}MB를 초과할 수 없습니다.`);
  }

  if (!acceptedFormats.includes(file.type)) {
    throw new Error(`지원하지 않는 이미지 형식입니다. (지원 형식: ${acceptedFormats.join(', ')})`);
  }
}

/**
 * Presigned URL로 Storage에 업로드
 */
async function uploadToStorage(file: File, uploadUrl: string): Promise<void> {
  let response: Response;
  try {
    response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
      signal: AbortSignal.timeout(UPLOAD_CONFIG.uploadTimeoutMS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new Error(FILE_ERRORS.UPLOAD_TIMEOUT);
    }
    throw new Error(GENERAL_ERRORS.NETWORK);
  }

  if (!response.ok) {
    throw new Error(`업로드 실패: ${response.status} ${response.statusText}`);
  }
}

/**
 * 이미지 파일 하나를 검증 → presigned URL 발급 → Storage 업로드 후 공개 URL 반환
 */
export async function uploadEditorImage(file: File, config: EditorUploadConfig): Promise<string> {
  validateFile(file, config);

  const fileName = generateUniqueFileName(file.name);
  const filePath = `${config.folder}/${fileName}`;

  const result = await createPresignedUploadUrl(filePath);
  if (!result.success) {
    throw new Error(result.error || FILE_ERRORS.PRESIGNED_URL_FAILED);
  }

  await uploadToStorage(file, result.data.uploadUrl);

  return result.data.publicUrl;
}

/**
 * 이미지 파일들을 업로드하고 에디터에 삽입 (툴바 버튼·붙여넣기·드롭 공용)
 */
export async function insertImages(
  editor: Editor,
  files: File[],
  config: EditorUploadConfig
): Promise<void> {
  releaseNodeSelection(editor);

  for (const file of files) {
    try {
      const url = await uploadEditorImage(file, config);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
    }
  }
}
