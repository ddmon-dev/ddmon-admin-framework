import { redirect } from 'next/navigation';
import type { User } from 'next-auth';
import { auth } from '../handler';
import { AUTH_PATHS } from '../constants';

/**
 * 현재 로그인한 사용자 정보를 반환합니다.
 * 인증되지 않은 경우 null을 반환합니다.
 *
 * @returns User | null
 *
 * @example
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log(user.name);
 * }
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * 인증된 사용자 정보를 반환합니다.
 * 인증되지 않은 경우 로그인 페이지로 리다이렉트합니다.
 *
 * @returns User (보장됨)
 *
 * @example
 * export default async function ProtectedLayout() {
 *   const user = await requireAuth();
 *   return <div>Welcome {user.name}</div>;
 * }
 */
export async function requireAuth(): Promise<User> {
  const session = await auth();

  if (!session?.user) {
    redirect(AUTH_PATHS.SIGN_IN);
  }

  return session.user;
}

/**
 * 슈퍼 관리자 권한을 확인합니다.
 * 권한이 없거나 인증되지 않은 경우 홈으로 리다이렉트합니다.
 *
 * @returns User (superAdmin: true 보장)
 *
 * @example
 * export default async function SuperAdminLayout() {
 *   const user = await requireSuperAdmin();
 *   return <div>Admin: {user.name}</div>;
 * }
 */
export async function requireSuperAdmin(): Promise<User> {
  const session = await auth();

  if (!session?.user) {
    redirect(AUTH_PATHS.SIGN_IN);
  }

  if (!session.user.superAdmin) {
    redirect('/');
  }

  return session.user;
}
