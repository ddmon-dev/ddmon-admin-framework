import { useState, useEffect, useRef } from 'react';
import { UX_CONFIG } from '@/app.config';

/**
 * 상태에 최소 지속 시간을 적용하는 Hook
 *
 * 상태 깜빡임을 방지하고 일관된 UX를 제공하기 위해,
 * 상태가 true가 되면 최소 시간 동안 유지합니다.
 *
 * @param value - 실제 상태값
 * @param minDuration - 최소 지속 시간 (ms), 기본값: UX_CONFIG.MIN_LOADING_TIME
 * @returns 최소 시간이 적용된 상태값
 *
 * @example
 * ```typescript
 * // 로딩 상태에 최소 지속 시간 적용
 * const isLoading = useQuery(...).isLoading;
 * const showLoading = useMinimumDuration(isLoading);
 *
 * return showLoading ? <Skeleton /> : <Content />;
 * ```
 *
 * @example
 * ```typescript
 * // 커스텀 최소 시간
 * const showToast = useMinimumDuration(isToastOpen, 2000);
 * ```
 */
export function useMinimumDuration(
  value: boolean,
  minDuration: number = UX_CONFIG.MIN_LOADING_TIME
): boolean {
  const [showValue, setShowValue] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (value && !showValue) {
      // 즉시 표시 및 시작 시간 기록
      setShowValue(true);
      startTimeRef.current = Date.now();
    }

    if (!value && showValue) {
      // 최소 시간을 충족하기 위한 남은 시간 계산
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const remaining = Math.max(0, minDuration - elapsed);

      const timer = setTimeout(() => {
        setShowValue(false);
        startTimeRef.current = null;
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [value, showValue, minDuration]);

  return showValue;
}
