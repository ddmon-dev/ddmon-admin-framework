'use client';

import { cn } from '@/shared/utils/classnames';

interface DemoOverlayProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 데모 모드에서 특정 영역을 backdrop-blur로 덮어 "차단됨"을 시각화하는 공용 오버레이 shell.
 *
 * `relative` 부모 안에 배치해 사용한다. 기본으로 부모보다 살짝 크게(`-inset-4`) 덮어
 * "떠 있는 프로스티드 패널" 느낌을 준다. className으로 덮어쓸 수 있다(예: 로그인 폼은 `-inset-8`).
 * 표시 여부(IS_DEMO) 판단은 호출부에서 한다.
 */
export function DemoOverlay({ children, className }: DemoOverlayProps) {
  return (
    <div
      className={cn(
        'absolute -inset-4 z-10 flex flex-col items-center justify-center gap-3 rounded-md',
        'bg-background/40 backdrop-blur-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
