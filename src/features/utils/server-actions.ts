import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { type User } from 'next-auth';
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
   * 비즈니스 로직 핸들러
   * 예상 가능한 에러는 ActionResult.error()로 직접 반환
   * 예상치 못한 에러는 throw (자동으로 catch됨)
   */
  handler: (params: T, { user }: { user: User | null }) => Promise<TActionResult<R>>;
}

/**
 * Server Action 생성 팩토리 함수
 *
 * 자동으로 처리하는 것들:
 * 1. 인증 확인 (auth 옵션)
 * 2. 예상치 못한 에러 catch 및 로깅
 *
 * @example
 * ```typescript
 * export const deleteUser = createServerAction({
 *   name: 'deleteUser',
 *   auth: { requireSuper: true },
 *   handler: async ({ id }) => {
 *     if (!id) {
 *       return Result.error('ID값이 없습니다.');
 *     }
 *
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
 *       return Result.error(error.message);
 *     }
 *
 *     return Result.success(data);
 *   },
 * });
 * ```
 */
export function createServerAction<T, R>(options: ServerActionOptions<T, R>) {
  return async (params: T): Promise<TActionResult<R>> => {
    const { name, auth, handler } = options;

    try {
      // 1. 인증 확인
      let user = null;
      if (auth) {
        user = await requireAuth(typeof auth === 'object' ? auth : {});
      }

      // 2. 핸들러 실행
      const ctx = { user };
      return await handler(params, ctx);
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
