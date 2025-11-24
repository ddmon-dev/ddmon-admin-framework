'use client';

import { usePathname } from 'next/navigation';
import { SoftDeleteButton, HardDeleteButton } from '../_base/ui';
import { softDeleteItem } from './actions/soft-delete-item';
import { hardDeleteItem } from './actions/hard-delete-item';

interface DeleteItemButtonProps {
  itemId: string;
  children?: React.ReactNode;
}

export function SoftDeleteItemButton({ itemId, children }: DeleteItemButtonProps) {
  const pathname = usePathname();

  const handleDelete = async () => {
    const { success, error } = await softDeleteItem({ id: itemId, path: pathname });

    if (!success) {
      throw new Error(error || '삭제 실패');
    }
  };

  return <SoftDeleteButton onDelete={handleDelete}>{children}</SoftDeleteButton>;
}

export function HardDeleteItemButton({ itemId, children }: DeleteItemButtonProps) {
  const pathname = usePathname();

  const handleDelete = async () => {
    const { success, error } = await hardDeleteItem({ id: itemId, path: pathname });

    if (!success) {
      throw new Error(error || '삭제 실패');
    }
  };

  return <HardDeleteButton onDelete={handleDelete}>{children}</HardDeleteButton>;
}
