'use client';

import { cn } from '@/shared/utils/classnames';
import { Container } from '@/shared/ui/container';
import { Separator } from '@/shared/ui/separator';
import { SidebarTrigger } from '@/shared/ui/sidebar';

interface AppHeaderProps {
  /** 헤더 타이틀 */
  title?: string;
  /** 타이틀 옆 영역 (모바일 필터 버튼 등) */
  topLeft?: React.ReactNode;
  /** 상단 우측 영역 (액션 버튼 등) */
  topRight?: React.ReactNode;
  /** 하단 전체 영역 (bottomLeft/bottomRight 대신 사용) */
  bottom?: React.ReactNode;
  /** 하단 좌측 영역 (필터 등) */
  bottomLeft?: React.ReactNode;
  /** 하단 우측 영역 (검색바 등) */
  bottomRight?: React.ReactNode;
  className?: string;
}

export function AppHeader({
  title,
  topLeft,
  topRight,
  bottom,
  bottomLeft,
  bottomRight,
  className,
}: AppHeaderProps) {
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
