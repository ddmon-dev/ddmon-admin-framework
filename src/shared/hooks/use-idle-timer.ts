'use client';

import { useEffect, useRef } from 'react';
import { signOut } from '@/features/auth';

interface UseIdleTimerOptions {
  timeout: number; // 밀리초
  warningTime?: number; // 경고 시간 (기본: 5분 전)
  onWarning?: () => void;
  onIdle?: () => void;
}

export function useIdleTimer({
  timeout,
  warningTime = 5 * 60 * 1000,
  onWarning,
  onIdle,
}: UseIdleTimerOptions) {
  const warningTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const logoutTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
        alert('잠시 후 자동 로그아웃됩니다. 활동을 계속하려면 클릭하세요.');
      }
    }, timeout - warningTime);

    // 로그아웃 타이머 (timeout 후)
    logoutTimerRef.current = setTimeout(() => {
      if (onIdle) {
        onIdle();
      } else {
        alert('일정 시간 동안 활동이 없어 로그아웃됩니다.');
        signOut();
      }
    }, timeout);
  };

  useEffect(() => {
    // 감지할 이벤트들
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ] as const;

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
}
