'use client';

import { useEffect, useRef } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { useManageSheet } from '../ui/manage-sheet';

export function useFormGuard<T extends FieldValues>(form: UseFormReturn<T>, enabled = true) {
  const sheet = useManageSheet();

  // RHF Proxy 구독 활성화: 렌더링 중 isDirty에 접근하여 내부 추적을 등록
  const isDirty = form.formState.isDirty;
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  useEffect(() => {
    if (!enabled) return;

    sheet.setCloseGuard(() => isDirtyRef.current);
    return () => {
      sheet.setCloseGuard(null);
    };
    // sheet는 context 안정 API, 최신값은 isDirtyRef로 참조 — enabled 변경 시에만 재등록
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // 브라우저 탭 닫기/새로고침 시 경고
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled]);
}
