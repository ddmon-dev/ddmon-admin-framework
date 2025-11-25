import { auth } from '../handler';
import { AuthorizationError } from './errors';

/**
 * 슈퍼 관리자 권한을 확인합니다.
 * 권한이 없는 경우 AuthorizationError를 throw합니다.
 * Server Action에서 사용하기 위한 함수입니다.
 *
 * @throws {AuthorizationError} 권한이 없는 경우
 *
 * @example
 * export async function createItem() {
 *   try {
 *     await assertSuperAdmin();
 *     // ... 생성 로직
 *   } catch (error) {
 *     if (error instanceof AuthorizationError) {
 *       return { success: false, error: error.message };
 *     }
 *     throw error;
 *   }
 * }
 */
export async function assertSuperAdmin(): Promise<void> {
  const session = await auth();

  if (!session?.user) {
    throw new AuthorizationError('인증이 필요합니다.');
  }

  if (!session.user.superAdmin) {
    throw new AuthorizationError('최고 관리자만 접근할 수 있습니다.');
  }
}
