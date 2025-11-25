'use client';

import { useAuth } from '../use-auth';
import { Spinner } from '@/shared/ui/spinner';

interface RequireAuthProps {
  children: React.ReactNode;
  requireSuper?: boolean;
  fallback?: React.ReactNode;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
}

/**
 * 인증 상태에 따라 조건부로 컴포넌트를 렌더링합니다.
 * 리디렉션은 수행하지 않으며, 순수하게 조건부 렌더링만 담당합니다.
 *
 * @param children - 인증 성공 시 렌더링할 컴포넌트
 * @param requireSuper - true일 경우 슈퍼 관리자만 접근 가능 (기본값: false)
 * @param fallback - 인증 실패 시 렌더링할 컴포넌트 (기본값: null)
 * @param showLoading - 로딩 UI 표시 여부 (기본값: true)
 * @param loadingComponent - 커스텀 로딩 컴포넌트 (기본값: Spinner)
 *
 * @example
 * // 기본 사용 (인증 안 되면 안 보임)
 * <RequireAuth>
 *   <UserProfile />
 * </RequireAuth>
 *
 * @example
 * // 로그인 유도 메시지
 * <RequireAuth fallback={<div>로그인이 필요합니다</div>}>
 *   <ProtectedContent />
 * </RequireAuth>
 *
 * @example
 * // 슈퍼 관리자 전용
 * <RequireAuth requireSuper fallback={<div>권한이 없습니다</div>}>
 *   <AdminPanel />
 * </RequireAuth>
 *
 * @example
 * // 로딩 숨김
 * <RequireAuth showLoading={false}>
 *   <Content />
 * </RequireAuth>
 *
 * @example
 * // 커스텀 로딩
 * <RequireAuth loadingComponent={<PageSkeleton />}>
 *   <Content />
 * </RequireAuth>
 */
export function RequireAuth({
  children,
  requireSuper,
  fallback = null,
  showLoading = true,
  loadingComponent,
}: RequireAuthProps) {
  const { user, isLoading, isSuperAdmin } = useAuth();

  if (isLoading) {
    if (!showLoading) return null;
    return (
      loadingComponent ?? (
        <div className='flex items-center justify-center min-h-[200px]'>
          <Spinner className='size-8' />
        </div>
      )
    );
  }

  if (!user || (requireSuper && !isSuperAdmin)) {
    return fallback;
  }

  return <>{children}</>;
}
