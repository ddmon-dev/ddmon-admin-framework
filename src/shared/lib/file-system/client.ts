/**
 * 클라이언트에서 Presigned URL을 사용한 파일 업로드 유틸리티
 */

/**
 * 여러 파일을 병렬로 업로드
 *
 * @param uploads - 업로드할 파일과 URL 배열
 * @param onProgress - 전체 진행 상태 콜백 (0-100)
 * @returns Promise<void>
 */
export async function uploadFilesWithPresignedUrl(
  uploads: Array<{ file: File; uploadUrl: string }>,
  onProgress?: (progress: number) => void
): Promise<void> {
  const progressMap = new Map<number, number>();
  const totalFiles = uploads.length;

  const updateOverallProgress = () => {
    if (onProgress) {
      const totalProgress =
        Array.from(progressMap.values()).reduce((sum, p) => sum + p, 0) / totalFiles;
      onProgress(Math.round(totalProgress));
    }
  };

  await Promise.all(
    uploads.map((upload, index) =>
      uploadSingleFileWithPresignedUrl(upload.file, upload.uploadUrl, progress => {
        progressMap.set(index, progress);
        updateOverallProgress();
      })
    )
  );
}

/**
 * 단일 파일을 Presigned URL로 업로드
 *
 * @param file - 업로드할 파일
 * @param uploadUrl - Presigned Upload URL
 * @param onProgress - 업로드 진행 상태 콜백 (0-100)
 * @returns Promise<void>
 */
async function uploadSingleFileWithPresignedUrl(
  file: File,
  uploadUrl: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // 진행 상태 추적
    if (onProgress) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          onProgress(progress);
        }
      });
    }

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
      reject(new Error('네트워크 오류가 발생했습니다.'));
    });

    // 타임아웃 처리 (30초)
    xhr.addEventListener('timeout', () => {
      reject(new Error('업로드 시간이 초과되었습니다.'));
    });

    // 업로드 시작
    xhr.open('PUT', uploadUrl);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.timeout = 30000; // 30초
    xhr.send(file);
  });
}
