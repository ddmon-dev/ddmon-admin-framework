'use client';

import { APP_CONFIG } from '@/app.config';
import { useSession as useNextAuthSession, UpdateSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { User } from 'next-auth';
import { useEffect, useRef } from 'react';

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
  const prevUserRef = useRef<User | undefined>(undefined);

  // authenticated일 때 user 저장
  if (status === 'authenticated') {
    prevUserRef.current = session.user;
    return {
      user: session.user,
      status: 'authenticated',
      isLoading: false,
      isSuperAdmin: session.user.superAdmin ?? false,
      updateSession,
    };
  }

  // unauthenticated일 때 이전 user 초기화 (로그아웃 후 다른 계정 로그인 시 필요)
  if (status === 'unauthenticated') {
    prevUserRef.current = undefined;
  }

  // loading이지만 이전 user가 있으면 유지 (refetch 중)
  if (status === 'loading' && prevUserRef.current) {
    return {
      user: prevUserRef.current,
      status: 'authenticated',
      isLoading: false,
      isSuperAdmin: prevUserRef.current.superAdmin ?? false,
      updateSession,
    };
  }

  // 진짜 초기 로딩 또는 unauthenticated
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
      router.push(APP_CONFIG.AUTH.PATHS.SIGN_IN);
    }
    if (options?.requireSuper && auth.status === 'authenticated' && !auth.isSuperAdmin) {
      router.push(APP_CONFIG.AUTH.PATHS.FORBIDDEN);
    }
  }, [auth.status, auth.isSuperAdmin, options, router]);

  return auth;
}
