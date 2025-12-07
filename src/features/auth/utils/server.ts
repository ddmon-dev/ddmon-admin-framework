'use server';

import { APP_CONFIG } from '@/app.config';
import { redirect } from 'next/navigation';
import type { User } from 'next-auth';
import { auth } from '../next-auth';

/**
 * 현재 로그인한 사용자 정보를 반환합니다.
 * 인증되지 않은 경우 null을 반환합니다.
 *
 * @returns User | null
 *
 * @example
 * const user = await getUserSession();
 * if (user) {
 *   console.log(user.name);
 * }
 */
export async function getUserSession(): Promise<User | null> {
  const session = await auth();
  return session?.user ?? null;
}

interface RequireAuthParams {
  requireSuper?: boolean;
}

/**
 * 인증된 사용자 정보를 반환합니다.
 * 인증되지 않은 경우 로그인 페이지로 리다이렉트합니다.
 *
 * @param requireSuper - 슈퍼 관리자 권한 필요 여부
 *
 * @returns User (보장됨)
 *
 * @example
 * // 일반 인증
 * export default async function ProtectedLayout() {
 *   const user = await requireAuth();
 *   return <div>Welcome {user.name}</div>;
 * }
 *
 * @example
 * // 슈퍼 관리자 전용
 * export default async function SuperAdminLayout() {
 *   const user = await requireAuth({ requireSuper: true });
 *   return <div>Admin: {user.name}</div>;
 * }
 */
export async function requireAuth({ requireSuper = false }: RequireAuthParams = {}): Promise<User> {
  const user = await getUserSession();

  if (!user) {
    redirect(APP_CONFIG.AUTH.PATHS.SIGN_IN);
  }

  if (requireSuper && !user.superAdmin) {
    redirect(APP_CONFIG.AUTH.PATHS.FORBIDDEN);
  }

  return user;
}
