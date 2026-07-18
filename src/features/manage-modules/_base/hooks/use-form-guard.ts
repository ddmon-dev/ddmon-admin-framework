'use client';

import { useEffect, useRef } from 'react';
import type { FieldValues, UseFormReturn } from 'react-hook-form';
import { useManageSheet } from '../ui/manage-sheet';

// dirtyFields는 중첩 구조라 되돌린 필드의 빈 객체가 남을 수 있음 — true 리프가 있어야 실제 변경
function hasDirtyField(node: unknown): boolean {
  if (node === true) return true;
  if (Array.isArray(node)) return node.some(hasDirtyField);
  if (node && typeof node === 'object') return Object.values(node).some(hasDirtyField);
  return false;
}

export function useFormGuard<T extends FieldValues>(form: UseFormReturn<T>, enabled = true) {
  const sheet = useManageSheet();

  // RHF Proxy 구독 활성화: 렌더링 중 dirtyFields에 접근하여 내부 추적을 등록
  // isDirty(전체 deepEqual)는 defaultValues와 등록 필드의 키 구조 차이만으로 오판하므로
  // 실제 변경 이벤트 기반인 dirtyFields로 판정
  const isDirty = hasDirtyField(form.formState.dirtyFields);
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
