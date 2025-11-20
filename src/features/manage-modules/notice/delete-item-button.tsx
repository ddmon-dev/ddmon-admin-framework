'use client';

import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { deleteItem } from './actions/delete-item';

interface DeleteItemButtonProps {
  itemId: string;
  children?: React.ReactNode;
}

export function DeleteItemButton({ itemId, children }: DeleteItemButtonProps) {
  const pathname = usePathname();

  const handleClick = async () => {
    const { success, error } = await deleteItem({ id: itemId, path: pathname });

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
