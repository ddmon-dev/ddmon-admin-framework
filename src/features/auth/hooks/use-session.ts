'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { useEffect } from 'react';
import { AUTH_PATHS } from '../constants';

/**
 * 인증 상태 타입
 */
export type AuthState =
  | { user: User; status: 'authenticated'; isLoading: false }
  | { user: undefined; status: 'loading' | 'unauthenticated'; isLoading: boolean };

/**
 * 현재 로그인한 사용자 정보를 반환합니다.
 * 인증되지 않았거나 로딩 중일 경우 undefined를 반환합니다.
 *
 * @returns User | undefined
 *
 * @example
 * export function UserGreeting() {
 *   const user = useCurrentUser();
 *
 *   if (!user) {
 *     return <div>로그인하세요</div>;
 *   }
 *
 *   return <div>환영합니다, {user.name}님</div>;
 * }
 */
export function useCurrentUser(): User | undefined {
  const { data: session, status } = useNextAuthSession();

  if (status === 'loading' || status === 'unauthenticated') {
    return undefined;
  }

  return session?.user;
}

/**
 * 인증 상태와 사용자 정보를 반환합니다.
 *
 * @returns 인증 상태 객체
 * - user: 사용자 정보 (미인증/로딩 시 undefined)
 * - status: 'authenticated' | 'loading' | 'unauthenticated'
 * - isLoading: 로딩 여부
 *
 * @example
 * export function Dashboard() {
 *   const { user, isLoading } = useAuth();
 *
 *   if (isLoading) {
 *     return <div>로딩 중...</div>;
 *   }
 *
 *   if (!user) {
 *     return <div>로그인이 필요합니다</div>;
 *   }
 *
 *   return <div>대시보드: {user.name}</div>;
 * }
 */
export function useAuth(): AuthState {
  const { data: session, status } = useNextAuthSession();

  if (status === 'authenticated') {
    return {
      user: session.user,
      status: 'authenticated',
      isLoading: false,
    };
  }

  return {
    user: undefined,
    status,
    isLoading: status === 'loading',
  };
}

/**
 * 현재 사용자가 슈퍼 관리자인지 확인합니다.
 *
 * @returns boolean - 슈퍼 관리자 여부 (미인증 시 false)
 *
 * @example
 * export function AdminPanel() {
 *   const isSuperAdmin = useIsSuperAdmin();
 *
 *   return (
 *     <>
 *       {isSuperAdmin && <div>슈퍼 관리자 전용 패널</div>}
 *     </>
 *   );
 * }
 */
export function useIsSuperAdmin(): boolean {
  const user = useCurrentUser();
  return user?.superAdmin ?? false;
}

/**
 * 인증된 사용자가 필요한 컴포넌트에서 사용합니다.
 * 미인증 시 로그인 페이지로 리디렉션합니다.
 *
 * @returns User - 인증된 사용자 (보장됨)
 *
 * @example
 * export function ProtectedPage() {
 *   const user = useRequireAuth();
 *
 *   return <div>환영합니다, {user.name}님</div>;
 * }
 */
export function useRequireAuth(): User | undefined {
  const { data: session, status } = useNextAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(AUTH_PATHS.SIGN_IN);
    }
  }, [status, router]);

  if (status === 'loading') {
    return undefined;
  }

  return session?.user;
}
