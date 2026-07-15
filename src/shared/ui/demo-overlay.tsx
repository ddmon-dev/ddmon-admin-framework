'use client';

import { cn } from '@/shared/utils/classnames';

interface DemoOverlayProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 데모 모드에서 특정 영역을 backdrop-blur로 덮어 "차단됨"을 시각화하는 공용 오버레이 shell.
 *
 * `relative` 부모 안에 배치해 사용한다. 기본은 부모 전체(inset-0)를 덮으며,
 * className으로 inset 등을 덮어쓸 수 있다(예: 로그인 폼은 `-inset-8`로 폼보다 크게).
 * 표시 여부(IS_DEMO) 판단은 호출부에서 한다.
 */
export function DemoOverlay({ children, className }: DemoOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-md',
        'bg-background/40 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
