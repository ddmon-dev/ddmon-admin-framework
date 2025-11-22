/**
 * 기존 파일 (서버에 저장된 파일)
 */
export type ExistingFile = {
  type: 'existing';
  url: string;
  originalName: string;
  markedForDeletion?: boolean;
};

/**
 * 새로 업로드할 파일
 */
export type NewFile = {
  type: 'new';
  file: File;
};

/**
 * 파일 업로드 값 타입
 */
export type FormFileValue = ExistingFile | NewFile | null;

/**
 * 파일 확장자 프리셋
 */
export const fileAcceptPresets = {
  images: 'image/*',
  documents: 'pdf,doc,docx,txt,xls,xlsx,ppt,pptx,hwp',
  zips: 'zip,rar,7z,tar,gz',
  videos: 'video/*',
  audios: 'audio/*',
} as const;

export type FileAcceptPreset = keyof typeof fileAcceptPresets;

/**
 * accept 문자열을 정규화 (확장자에 . 자동 추가)
 * 예: 'pdf,doc' → '.pdf,.doc'
 * 예: '.pdf,doc' → '.pdf,.doc'
 * 예: 'image/*' → 'image/*' (그대로 유지)
 */
export function normalizeAccept(accept: string): string {
  return accept
    .split(',')
    .map(t => t.trim())
    .map(t => {
      // MIME 타입이거나 이미 .으로 시작하면 그대로
      if (t.includes('/') || t.startsWith('.')) {
        return t;
      }
      // 확장자만 있으면 . 추가
      return `.${t}`;
    })
    .join(',');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function truncateFileName(fileName: string, maxLength: number = 40): string {
  if (fileName.length <= maxLength) return fileName;

  const lastDotIndex = fileName.lastIndexOf('.');
  const hasExtension = lastDotIndex > 0;

  if (!hasExtension) {
    const halfLength = Math.floor((maxLength - 3) / 2);
    return fileName.slice(0, halfLength) + '...' + fileName.slice(-halfLength);
  }

  const extension = fileName.slice(lastDotIndex);
  const nameWithoutExt = fileName.slice(0, lastDotIndex);

  const availableLength = maxLength - extension.length - 3;
  if (availableLength <= 0) return fileName;

  const halfLength = Math.floor(availableLength / 2);
  return (
    nameWithoutExt.slice(0, halfLength) + '...' + nameWithoutExt.slice(-halfLength) + extension
  );
}
