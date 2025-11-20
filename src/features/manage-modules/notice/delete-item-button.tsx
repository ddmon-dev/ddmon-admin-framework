'use client';

import { usePathname } from 'next/navigation';
import { DeleteButton } from '../_base/components/delete-button';
import { deleteItem } from './actions/delete-item';

interface DeleteItemButtonProps {
  itemId: string;
  children?: React.ReactNode;
}

export function DeleteItemButton({ itemId, children }: DeleteItemButtonProps) {
  const pathname = usePathname();

  const handleDelete = async () => {
    const { success, error } = await deleteItem({ id: itemId, path: pathname });

    if (!success) {
      throw new Error(error || '삭제 실패');
    }
  };

  return <DeleteButton onDelete={handleDelete}>{children}</DeleteButton>;
}
