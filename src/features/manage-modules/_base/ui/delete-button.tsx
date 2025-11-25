'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDialog } from '@/shared/providers';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';
import type { TableName } from '@/shared/lib/supabase/db-helpers';
import { softDelete, hardDelete } from '../actions';
import type { DeleteResult } from '../config';

interface DeleteButtonProps {
  tableName: TableName;
  id: string;
  deleteFn?: () => Promise<DeleteResult<any>>;
  children?: React.ReactNode;
  dataLabel?: string;
}

export function SoftDeleteButton({
  tableName,
  id,
  deleteFn,
  children,
  dataLabel,
}: DeleteButtonProps) {
  const dialog = useDialog();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    const dataLabelText = dataLabel ? `"${dataLabel}"` : '';

    await dialog.confirm({
      title: '데이터 삭제하기',
      description: (
        <>
          {dataLabelText} 데이터를 정말 삭제하시겠습니까?
          <br />
          삭제된 데이터는 복구할 수 없습니다.
        </>
      ),
      variant: 'destructive',
      confirmText: '삭제',
      onConfirm: async () => {
        try {
          const result = deleteFn
            ? await deleteFn()
            : await softDelete({ tableName, id, pathname });

          if (!result.success) {
            toast.error('Error: 데이터 삭제 중 오류가 발생했습니다.', {
              description: result.error,
            });
            return false;
          }

          toast.success(`${dataLabelText} 데이터가 삭제되었습니다.`);
          return true;
        } catch (error) {
          console.error(error);
          toast.error('Error: 예상치 못한 오류가 발생했습니다.', {
            description: '잠시 후 다시 시도해주세요.',
          });
          return false;
        }
      },
    });

    setIsLoading(false);
  };

  return (
    <Button
      size='sm'
      variant='destructive'
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? <Spinner /> : children ?? '삭제'}
    </Button>
  );
}

export function HardDeleteButton({
  tableName,
  id,
  deleteFn,
  children,
  dataLabel,
}: DeleteButtonProps) {
  const dialog = useDialog();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    const dataLabelText = dataLabel ? `"${dataLabel}"` : '';

    await dialog.confirm({
      title: '데이터 삭제하기',
      description: (
        <>
          {dataLabelText} 데이터를 정말 삭제하시겠습니까?
          <br />
          삭제된 데이터는 복구할 수 없습니다.
        </>
      ),
      variant: 'destructive',
      confirmText: '삭제',
      onConfirm: async () => {
        try {
          // Server Action 호출
          const result = deleteFn
            ? await deleteFn()
            : await hardDelete({ tableName, id, pathname });

          // success 체크
          if (!result.success) {
            toast.error(`${dataLabelText} ${result.error}`);
            return false; // 실패 - 다이얼로그 유지
          }

          // 성공
          toast.success(`${dataLabelText} 데이터가 영구 삭제되었습니다.`);
          return true; // 성공 - 다이얼로그 닫기
        } catch (error) {
          // 예상치 못한 에러 (네트워크 등)
          console.error(error);
          toast.error('예상치 못한 오류가 발생했습니다.');
          return false;
        }
      },
    });

    setIsLoading(false);
  };

  return (
    <Button
      size='sm'
      variant='destructive'
      onClick={handleClick}
      disabled={isLoading}
    >
      {children ?? '영구 삭제'}
    </Button>
  );
}
