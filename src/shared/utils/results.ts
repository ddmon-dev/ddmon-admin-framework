import { type ActionResult } from '@/shared/types/results';

/**
 * Result 헬퍼 객체
 * 서버/클라이언트 모두에서 일관된 결과 반환을 위한 유틸리티
 *
 * @example
 * ```typescript
 * // 성공 (데이터 포함)
 * return Result.success({ id: 1, name: 'test' });
 *
 * // 성공 (데이터 없음)
 * return Result.ok();
 *
 * // 실패
 * return Result.error('에러 메시지');
 * ```
 */
export const Result = {
  /**
   * 성공 결과 (데이터 포함)
   */
  success: <T>(data: T): ActionResult<T> => ({
    success: true,
    data,
  }),

  /**
   * 성공 결과 (데이터 없음)
   * void 반환 시 사용
   */
  ok: (): ActionResult<void> => ({
    success: true,
    data: undefined,
  }),

  /**
   * 실패 결과
   */
  error: <T = void>(error: string): ActionResult<T> => ({
    success: false,
    error,
  }),
};
