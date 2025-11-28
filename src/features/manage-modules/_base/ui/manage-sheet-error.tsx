'use client';

import { X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/shared/ui/empty';
import { useManageSheet } from './manage-sheet';

interface ManageSheetErrorProps {
  onRetry?: () => void;
}

export function ManageSheetError({ onRetry }: ManageSheetErrorProps) {
  const manageSheet = useManageSheet();

  return (
    <Empty className='flex-1 border-0'>
      <EmptyHeader>
        <EmptyMedia className='size-16 rounded-full bg-destructive-light mb-4'>
          <X
            className='size-10 text-destructive'
            strokeWidth={1}
          />
        </EmptyMedia>
        <EmptyTitle className='text-xl'>데이터를 불러올 수 없습니다</EmptyTitle>
        <EmptyDescription>
          일시적인 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </EmptyDescription>
      </EmptyHeader>

      <div className='flex gap-2'>
        {onRetry && <Button onClick={onRetry}>다시 시도</Button>}
        <Button
          variant='destructive-light'
          size='lg'
          onClick={() => manageSheet.close()}
        >
          닫기
        </Button>
      </div>
    </Empty>
  );
}
