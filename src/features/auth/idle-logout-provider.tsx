'use client';

import { APP_CONFIG } from '@/app.config';
import { useEffect, useRef } from 'react';
import { signOut, useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { useDialog } from '@/shared/ui/app-dialog';

interface IdleLogoutProviderProps {
  children: React.ReactNode;
  /** 자동 로그아웃 시간 (분) */
  timeoutMinutes?: number;
  /** 로그아웃 경고 표시 시간 (분) */
  warningMinutes?: number;
  onWarning?: () => void;
  onIdle?: () => void;
}

const MINUTE_MS = 60 * 1000;

export function IdleLogoutProvider({
  children,
  timeoutMinutes = APP_CONFIG.AUTH.IDLE_TIMEOUT_MINUTES,
  warningMinutes = APP_CONFIG.AUTH.IDLE_WARNING_MINUTES,
  onWarning,
  onIdle,
}: IdleLogoutProviderProps) {
  const dialog = useDialog();
  const { updateSession } = useAuth();
  const warningTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const logoutTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastUpdateRef = useRef<number>(Date.now());

  // 분 → ms 변환
  const timeout = timeoutMinutes * MINUTE_MS;
  const warningTime = warningMinutes * MINUTE_MS;

  useEffect(() => {
    const resetTimers = () => {
      // 기존 타이머 정리
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }

      // 경고 타이머 (timeout - warningTime 후)
      warningTimerRef.current = setTimeout(() => {
        if (onWarning) {
          onWarning();
        } else {
          toast.warning('일정 시간 활동이 없어 잠시 후 자동 로그아웃됩니다.');
        }
      }, timeout - warningTime);

      // 로그아웃 타이머 (timeout 후)
      logoutTimerRef.current = setTimeout(() => {
        if (onIdle) {
          onIdle();
        } else {
          dialog.alert({
            title: 'Session Expired',
            description: '일정 시간 활동이 없어 로그아웃 되었습니다.',
            variant: 'default',
            size: 'sm',
            layout: 'vertical',
          });

          signOut();
        }
      }, timeout);
    };

    // 감지할 이벤트들
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'] as const;

    // 이벤트 핸들러
    const handleActivity = () => {
      resetTimers();

      // 5분(warningTime)마다 세션 갱신 (서버 토큰 만료 방지)
      const now = Date.now();
      if (now - lastUpdateRef.current > warningTime) {
        lastUpdateRef.current = now;
        updateSession();
      }
    };

    // 이벤트 리스너 등록
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    // 초기 타이머 시작
    resetTimers();

    // 클린업
    return () => {
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (logoutTimerRef.current) {
        clearTimeout(logoutTimerRef.current);
      }
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
    };
    // dialog는 context 안정 API, idle 시점에만 사용 — 타이머 재설정 방지 위해 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeout, warningTime, onWarning, onIdle, updateSession]);

  return <>{children}</>;
}
