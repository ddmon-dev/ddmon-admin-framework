'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useDialog } from '@/shared/ui/app-dialog';
import { toast } from 'sonner';
import { LoadingButton } from '@/shared/ui/loading-button';
import type { TableName } from '@/shared/lib/supabase/db-helpers';
import type { ActionResult } from '@/shared/types/results';
import { GENERAL_ERRORS } from '@/shared/constants/error-messages';
import { softDelete, hardDelete } from '../actions';

// --- confirmDelete 유틸함수 ---

interface ConfirmDeleteOptions {
  deleteFn: () => Promise<ActionResult<any>>;
  hardDelete?: boolean;
}

export async function confirmDelete(
  dialog: ReturnType<typeof useDialog>,
  options: ConfirmDeleteOptions
): Promise<void> {
  const { deleteFn, hardDelete: isHardDelete } = options;

  await dialog.confirm({
    title: '데이터 삭제하기',
    description: (
      <>
        데이터를 정말 삭제하시겠습니까?
        <br />
        삭제된 데이터는 복구할 수 없습니다.
      </>
    ),
    variant: 'destructive',
    confirmText: '삭제',
    onConfirm: async () => {
      try {
        const result = await deleteFn();

        if (!result.success) {
          toast.error(result.error);
          return false;
        }

        const action = isHardDelete ? '영구 삭제' : '삭제';
        toast.success(`데이터가 ${action}되었습니다.`);
        return true;
      } catch (error) {
        console.error(error);
        toast.error(GENERAL_ERRORS.UNEXPECTED);
        return false;
      }
    },
  });
}

// --- Delete 버튼 컴포넌트 ---

interface DeleteButtonProps {
  tableName: TableName;
  id: string;
  deleteFn?: () => Promise<ActionResult<any>>;
  children?: React.ReactNode;
  disabled?: boolean;
  onDisabled?: () => void;
}

export function SoftDeleteButton({
  tableName,
  id,
  deleteFn,
  children,
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

    await confirmDelete(dialog, {
      deleteFn: deleteFn ?? (() => softDelete({ tableName, id, pathname })),
    });

    setIsLoading(false);
  };

  return (
    <LoadingButton
      size="icon-sm"
      variant="destructive-light"
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
          confirmText: '확인',
          layout: 'vertical',
        });
      }

      setIsLoading(false);
      return;
    }

    await confirmDelete(dialog, {
      deleteFn: deleteFn ?? (() => hardDelete({ tableName, id, pathname })),
      hardDelete: true,
    });

    setIsLoading(false);
  };

  return (
    <LoadingButton
      size="icon-sm"
      variant="destructive"
      onClick={handleClick}
      isLoading={isLoading}
    >
      {children ?? <Trash2 />}
    </LoadingButton>
  );
}
