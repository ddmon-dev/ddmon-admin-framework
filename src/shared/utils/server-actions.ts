import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { type ActionResult as TActionResult } from '@/shared/types/results';
import { requireAuth } from '@/features/auth';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';
import { Result } from '@/shared/utils/results';

/**
 * Server Action 생성 옵션
 */
interface ServerActionOptions<T, R> {
  /** 액션 이름 (로깅용) */
  name: string;

  /** 인증 요구사항 */
  auth?: boolean | { requireSuper?: boolean };

  /**
   * 검증 함수 (예상 가능한 에러 체크)
   * null 반환 시 검증 통과, TActionResult 반환 시 즉시 반환
   */
  validate?: (params: T) => TActionResult<R> | null;
  /**
   * 비즈니스 로직 핸들러
   * 예상 가능한 에러는 ActionResult.error()로 직접 반환
   * 예상치 못한 에러는 throw (자동으로 catch됨)
   */
  handler: (params: T) => Promise<TActionResult<R>>;
}

/**
 * Server Action 생성 팩토리 함수
 *
 * 자동으로 처리하는 것들:
 * 1. 인증 확인 (auth 옵션)
 * 2. 검증 로직 실행 (validate 옵션)
 * 3. 예상치 못한 에러 catch 및 로깅
 *
 * @example
 * ```typescript
 * export const deleteUser = createServerAction({
 *   name: 'deleteUser',
 *   auth: { requireSuper: true },
 *   validate: (params: { id: string }) => {
 *     if (!params.id) return ActionResult.error('ID값이 없습니다.');
 *     return null;
 *   },
 *   handler: async ({ id }) => {
 *     const supabase = createServerClient();
 *     const { data, error } = await supabase
 *       .from('users')
 *       .delete()
 *       .eq('id', id)
 *       .select()
 *       .single();
 *
 *     if (error) {
 *       console.error('Supabase error:', error);
 *       return ActionResult.error(error.message);
 *     }
 *
 *     return ActionResult.success(data);
 *   },
 * });
 * ```
 */
export function createServerAction<T, R>(options: ServerActionOptions<T, R>) {
  return async (params: T): Promise<TActionResult<R>> => {
    const { name, auth, validate, handler } = options;

    try {
      // 1. 인증 확인
      if (auth) {
        await requireAuth(typeof auth === 'object' ? auth : {});
      }

      // 2. 검증 로직 실행
      if (validate) {
        const validationResult = validate(params);
        if (validationResult) {
          return validationResult; // 검증 실패 시 즉시 반환
        }
      }

      // 3. 핸들러 실행
      return await handler(params);
    } catch (error) {
      // Next.js redirect는 재throw (리디렉션이 정상 동작하도록)
      if (isRedirectError(error)) {
        throw error;
      }

      // 예상치 못한 에러만 여기서 처리 (네트워크, JSON 파싱 등)
      console.error(`[${name}] Unexpected error:`, error);

      return Result.error(GENERAL_ERRORS.UNEXPECTED);
    }
  };
}
