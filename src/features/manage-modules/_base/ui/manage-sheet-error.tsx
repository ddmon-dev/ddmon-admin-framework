'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

interface ManageSheetErrorProps {
  error?: string;
  onRetry?: () => void;
}

export function ManageSheetError({ error, onRetry }: ManageSheetErrorProps) {
  const manageSheet = useManageSheet();

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-12'>
      <AlertCircle className='h-12 w-12 text-red-600' />

      <div className='text-center'>
        <h3 className='text-lg font-semibold'>데이터 로드 실패</h3>
        <p className='mt-2 text-sm text-muted-foreground'>
          {error || '데이터를 불러오는 중 오류가 발생했습니다.'}
        </p>
      </div>

      <div className='flex gap-2'>
        {onRetry && (
          <Button onClick={onRetry}>
            다시 시도
          </Button>
        )}
        <Button
          variant='outline'
          onClick={() => manageSheet.close()}
        >
          닫기
        </Button>
      </div>
    </div>
  );
}
