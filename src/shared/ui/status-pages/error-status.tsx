'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { StatusLayout } from './status-layout';

interface ErrorStatusProps {
  reset: () => void;
  fullScreen?: boolean;
}

export function ErrorStatus({ reset, fullScreen }: ErrorStatusProps) {
  return (
    <StatusLayout
      code='ERROR'
      title='문제가 발생했습니다'
      description={
        <>
          예기치 않은 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </>
      }
      actions={
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
            asChild
            variant='black'
            size='lg'
          >
            <Link href='/'>홈으로</Link>
          </Button>
        </div>
      }
      fullScreen={fullScreen}
    />
  );
}
