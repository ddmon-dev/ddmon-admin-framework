'use client';

import { usePathname } from 'next/navigation';
import { type TableName } from '@/shared/lib/supabase/helpers';
import { Button } from '@/shared/ui/button';
import { deleteItem } from '../actions';

interface DeleteButtonProps {
  tableName: TableName;
  itemId: string;
  children?: React.ReactNode;
}

export function DeleteButton({ tableName, itemId, children }: DeleteButtonProps) {
  const pathname = usePathname();

  const handleClick = async () => {
    const { success, error } = await deleteItem({ tableName, id: itemId, path: pathname });

    if (!success) {
      console.error(error);
      return;
    }

    alert('삭제되었습니다.');
  };

  return (
    <Button
      size='sm'
      variant='destructive'
      onClick={handleClick}
    >
      {children ?? '삭제'}
    </Button>
  );
}
