'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useDialog } from '@/shared/ui/app-dialog';
import { toast } from 'sonner';
import { LoadingButton } from '@/shared/ui/loading-button';
import type { TableName } from '@/shared/lib/supabase/db-helpers';
import type { ActionResult } from '@/shared/types/results';
import { GENERAL_ERRORS, CRUD_ERRORS } from '@/shared/constants/error-messages';
import { softDelete, hardDelete } from '../actions';

interface DeleteButtonProps {
  tableName: TableName;
  id: string;
  deleteFn?: () => Promise<ActionResult<any>>;
  children?: React.ReactNode;
  dataLabel?: string;
  disabled?: boolean;
  onDisabled?: () => void;
}

export function SoftDeleteButton({
  tableName,
  id,
  deleteFn,
  children,
  dataLabel,
  disabled,
  onDisabled,
}: DeleteButtonProps) {
  const dialog = useDialog();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    if (disabled) {
      if (onDisabled) {
        onDisabled();
      } else {
        dialog.alert({
          title: 'Error!',
          description: '삭제할 수 없는 데이터입니다.',
          variant: 'error',
          layout: 'vertical',
          size: 'sm',
        });
      }

      setIsLoading(false);
      return;
    }

    const dataLabelText = dataLabel ? <b>[{dataLabel}]</b> : '';

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
            toast.error(CRUD_ERRORS.DELETE_FAILED(), {
              description: result.error,
            });
            return false;
          }

          toast.success(
            <>
              <b>[{dataLabel}]</b> 데이터가 삭제되었습니다.
            </>
          );
          return true;
        } catch (error) {
          console.error(error);
          toast.error(GENERAL_ERRORS.UNEXPECTED, {
            description: GENERAL_ERRORS.PLEASE_TRY_AGAIN,
          });
          return false;
        }
      },
    });

    setIsLoading(false);
  };

  return (
    <LoadingButton
      size='icon-sm'
      variant='destructive-light'
      onClick={handleClick}
      isLoading={isLoading}
    >
      {children ?? <Trash2 />}
    </LoadingButton>
  );
}

export function HardDeleteButton({
  tableName,
  id,
  deleteFn,
  children,
  dataLabel,
  disabled,
  onDisabled,
}: DeleteButtonProps) {
  const dialog = useDialog();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    if (disabled) {
      if (onDisabled) {
        onDisabled();
      } else {
        dialog.alert({
          title: '삭제할 수 없는 데이터입니다.',
          description: '삭제할 수 없는 데이터입니다.',
          variant: 'error',
          confirmText: '확인',
          layout: 'vertical',
        });
      }

      setIsLoading(false);
      return;
    }

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
          toast.error(GENERAL_ERRORS.UNEXPECTED, {
            description: GENERAL_ERRORS.PLEASE_TRY_AGAIN,
          });
          return false;
        }
      },
    });

    setIsLoading(false);
  };

  return (
    <LoadingButton
      size='icon-sm'
      variant='destructive'
      onClick={handleClick}
      isLoading={isLoading}
    >
      {children ?? <Trash2 />}
    </LoadingButton>
  );
}
