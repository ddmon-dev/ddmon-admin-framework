/**
 * MB를 Bytes로 변환
 * @param mb - 메가바이트 단위 크기
 * @returns 바이트 단위 크기
 */
export const mbToBytes = (mb: number): number => mb * 1024 * 1024;

/**
 * Bytes를 MB로 변환 (에러 메시지용)
 * @param bytes - 바이트 단위 크기
 * @returns 메가바이트 단위 크기
 */
export const bytesToMB = (bytes: number): number => bytes / (1024 * 1024);
