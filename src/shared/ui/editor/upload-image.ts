/**
 * 이미지 파일을 base64로 변환합니다.
 * 추후 Supabase Storage로 업로드하도록 확장 가능합니다.
 */
export async function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * 이미지 URL의 유효성을 검사합니다.
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:', 'data:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * 이미지 파일 크기를 MB 단위로 반환합니다.
 */
export function getImageSizeInMB(file: File): number {
  return file.size / (1024 * 1024);
}

/**
 * 허용된 이미지 형식인지 확인합니다.
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
}
