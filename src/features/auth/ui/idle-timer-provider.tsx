'use client';

import { useIdleTimer } from '@/shared/hooks/use-idle-timer';

interface IdleTimerProviderProps {
  children: React.ReactNode;
  timeout?: number; // 기본: 1시간
}

export function IdleTimerProvider({
  children,
  timeout = 60 * 60 * 1000, // 1시간
}: IdleTimerProviderProps) {
  useIdleTimer({
    timeout,
    warningTime: 5 * 60 * 1000, // 5분 전 경고
  });

  return <>{children}</>;
}
