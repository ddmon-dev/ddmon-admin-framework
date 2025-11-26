'use client';

import { useEffect, useRef } from 'react';
import { signOut } from './actions/sign-out';
import { toast } from 'sonner';
import { useDialog } from '@/shared/providers';

interface IdleLogoutProviderProps {
  children: React.ReactNode;
  timeout?: number; // 기본: 1시간
  warningTime?: number; // 5분 전 경고
  onWarning?: () => void;
  onIdle?: () => void;
}

export function IdleLogoutProvider({
  children,
  timeout = 60 * 60 * 1000, // 1시간
  warningTime = 5 * 60 * 1000, // 5분 전 경고
  onWarning,
  onIdle,
}: IdleLogoutProviderProps) {
  const dialog = useDialog();
  const warningTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const logoutTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
            title: '일정 시간 활동이 없어 로그아웃됩니다.',
            variant: 'warning',
            onConfirm: () => {
              signOut();
            },
          });
        }
      }, timeout);
    };

    // 감지할 이벤트들
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'] as const;

    // 이벤트 핸들러
    const handleActivity = () => {
      resetTimers();
    };

    // 이벤트 리스너 등록
    events.forEach(event => {
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
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [timeout, warningTime, onWarning, onIdle]);

  return <>{children}</>;
}
