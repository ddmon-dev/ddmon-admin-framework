'use client';

import { useEffect, useLayoutEffect } from 'react';
import { useSetAppHeader } from './context';
import type { AppHeaderConfig } from './types';

// SSR에서는 useEffect 사용, 클라이언트에서는 useLayoutEffect 사용
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * 페이지에서 AppHeader의 내용을 설정하는 훅
 *
 * @example
 * ```tsx
 * function DashboardPage() {
 *   useAppHeader({ title: '대시보드' });
 *   return <div>...</div>;
 * }
 * ```
 */
export function useAppHeader(config: AppHeaderConfig) {
  const setConfig = useSetAppHeader();

  // 매 렌더링마다 config 업데이트 (setConfig는 안정적인 참조)
  useIsomorphicLayoutEffect(() => {
    setConfig(config);
  });

  // 언마운트 시 정리
  useEffect(() => {
    return () => setConfig(null);
  }, [setConfig]);
}
