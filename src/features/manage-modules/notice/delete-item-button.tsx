'use client';

import { usePathname } from 'next/navigation';
import { SoftDeleteButton } from '../_base/components/soft-delete-button';
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

  return <SoftDeleteButton onDelete={handleDelete}>{children}</SoftDeleteButton>;
}
