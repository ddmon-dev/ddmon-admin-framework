'use client';

import { useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/shared/ui/empty';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Empty className='min-h-screen border-0'>
      <EmptyHeader>
        <EmptyMedia className='mb-4'>
          <span className='text-8xl font-secondary font-medium tracking-tighter text-muted-foreground/50'>
            ERROR
          </span>
        </EmptyMedia>
        <EmptyTitle className='text-2xl'>문제가 발생했습니다</EmptyTitle>
        <EmptyDescription>
          예기치 않은 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </EmptyDescription>
      </EmptyHeader>

      <div className='flex gap-2'>
        <Button
          size='lg'
          onClick={reset}
          className='w-32'
          variant='default'
        >
          다시 시도
        </Button>
        <Button
          variant='black'
          size='lg'
          onClick={() => (window.location.href = '/')}
          className='w-32'
        >
          홈으로
        </Button>
      </div>
    </Empty>
  );
}
