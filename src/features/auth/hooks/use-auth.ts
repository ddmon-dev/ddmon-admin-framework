'use client';

import { useSession as useNextAuthSession, UpdateSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { useEffect } from 'react';
import { AUTH_PATHS } from '../constants';

/**
 * 인증 상태 타입
 */
export type AuthState =
  | {
      user: User;
      status: 'authenticated';
      isLoading: false;
      isSuperAdmin: boolean;
      updateSession: UpdateSession;
    }
  | {
      user: undefined;
      status: 'loading' | 'unauthenticated';
      isLoading: boolean;
      isSuperAdmin: false;
      updateSession: UpdateSession;
    };

/**
 * 인증 상태와 사용자 정보를 반환합니다.
 *
 * @returns 인증 상태 객체
 * - user: 사용자 정보 (미인증/로딩 시 undefined)
 * - status: 'authenticated' | 'loading' | 'unauthenticated'
 * - isLoading: 로딩 여부
 * - isSuperAdmin: 슈퍼 관리자 여부
 *
 * @example
 * export function Dashboard() {
 *   const { user, isLoading, isSuperAdmin } = useAuth();
 *
 *   if (isLoading) {
 *     return <div>로딩 중...</div>;
 *   }
 *
 *   if (!user) {
 *     return <div>로그인이 필요합니다</div>;
 *   }
 *
 *   return (
 *     <>
 *       <div>대시보드: {user.name}</div>
 *       {isSuperAdmin && <AdminPanel />}
 *     </>
 *   );
 * }
 */
export function useAuth(): AuthState {
  const { data: session, status, update: updateSession } = useNextAuthSession();

  if (status === 'authenticated') {
    return {
      user: session.user,
      status: 'authenticated',
      isLoading: false,
      isSuperAdmin: session.user.superAdmin ?? false,
      updateSession,
    };
  }

  return {
    user: undefined,
    status,
    isLoading: status === 'loading',
    isSuperAdmin: false,
    updateSession,
  };
}

interface UseRequireAuthOptions {
  requireSuper?: boolean;
}

/**
 * 인증된 사용자가 필요한 컴포넌트에서 사용합니다.
 * 미인증 시 로그인 페이지로 리디렉션합니다.
 * useAuth를 기반으로 동작하며, 자동 리디렉션 기능이 추가되었습니다.
 *
 * @param options - 옵션 객체
 * @param options.requireSuper - true일 경우 슈퍼 관리자만 접근 가능 (기본값: false)
 * @returns AuthState - 인증 상태 객체 (useAuth와 동일)
 *
 * @example
 * // 일반 보호된 페이지
 * export function ProtectedPage() {
 *   const { user, isLoading } = useRequireAuth();
 *
 *   if (isLoading || !user) {
 *     return null; // 로딩 중이거나 리디렉션 중
 *   }
 *
 *   return <div>환영합니다, {user.name}님</div>;
 * }
 *
 * @example
 * // 슈퍼 관리자 전용 페이지
 * export function SuperAdminPage() {
 *   const { user, isLoading, isSuperAdmin } = useRequireAuth({ requireSuper: true });
 *
 *   if (isLoading || !user) {
 *     return null;
 *   }
 *
 *   return <div>슈퍼 관리자 페이지</div>;
 * }
 */
export function useRequireAuth(options?: UseRequireAuthOptions): AuthState {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.status === 'unauthenticated') {
      router.push(AUTH_PATHS.SIGN_IN);
    }
    if (options?.requireSuper && auth.status === 'authenticated' && !auth.isSuperAdmin) {
      router.push(AUTH_PATHS.FORBIDDEN);
    }
  }, [auth.status, auth.isSuperAdmin, options, router]);

  return auth;
}
