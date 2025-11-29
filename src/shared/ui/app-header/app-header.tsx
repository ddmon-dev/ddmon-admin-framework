'use client';

import { cn } from '@/shared/utils/classnames';
import { Container } from '@/shared/ui/container';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { useAppHeaderConfig } from './context';
import type { AppHeaderConfig } from './types';

interface AppHeaderProps extends AppHeaderConfig {
  /** Context 대신 props를 우선 사용할지 여부 */
  useProps?: boolean;
}

/**
 * AppHeader 컴포넌트
 *
 * 두 가지 사용 방식 지원:
 * 1. Context 기반 (layout에 배치, 페이지에서 useAppHeader로 설정)
 * 2. Props 기반 (직접 페이지에 배치, props로 설정)
 */
export function AppHeader({
  title: propTitle,
  topLeft: propTopLeft,
  topRight: propTopRight,
  bottom: propBottom,
  bottomLeft: propBottomLeft,
  bottomRight: propBottomRight,
  className: propClassName,
  useProps = false,
}: AppHeaderProps) {
  const config = useAppHeaderConfig();

  // useProps가 true이거나 Context에 config가 없으면 props 사용
  const shouldUseProps = useProps || !config;

  const title = shouldUseProps ? propTitle : config?.title;
  const topLeft = shouldUseProps ? propTopLeft : config?.topLeft;
  const topRight = shouldUseProps ? propTopRight : config?.topRight;
  const bottom = shouldUseProps ? propBottom : config?.bottom;
  const bottomLeft = shouldUseProps ? propBottomLeft : config?.bottomLeft;
  const bottomRight = shouldUseProps ? propBottomRight : config?.bottomRight;
  const className = shouldUseProps ? propClassName : config?.className;

  const hasBottom = bottom || bottomLeft || bottomRight;

  return (
    <header
      className={cn(
        'border-b sticky top-0 z-10 bg-background rounded-t-xl py-4',
        className
      )}
    >
      <Container className={cn('grid gap-2')}>
        {/* 상단 줄 */}
        <div className='flex items-center gap-2'>
          <SidebarTrigger />

          <Separator
            orientation='vertical'
            className='data-[orientation=vertical]:h-4 mx-2'
          />

          {title && <h1 className='text-xl font-semibold'>{title}</h1>}

          {topLeft}

          {topRight && <div className='ml-auto flex items-center gap-2'>{topRight}</div>}
        </div>

        {/* 하단 줄 (선택적) */}
        {hasBottom && (
          <div className='flex items-center gap-2'>
            {bottom || (
              <>
                {bottomLeft}
                {bottomRight && <div className='ml-auto'>{bottomRight}</div>}
              </>
            )}
          </div>
        )}
      </Container>
    </header>
  );
}
