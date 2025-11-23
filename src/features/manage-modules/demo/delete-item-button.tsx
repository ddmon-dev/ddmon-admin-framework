'use client';

import { usePathname } from 'next/navigation';
import { SoftDeleteButton, HardDeleteButton } from '../_base/components';
import { softDeleteItem } from './actions/soft-delete-item';
import { hardDeleteItem } from './actions/hard-delete-item';

interface DeleteItemButtonProps {
  id: string;
  children?: React.ReactNode;
}

export function SoftDeleteItemButton({ id, children }: DeleteItemButtonProps) {
  const pathname = usePathname();

  const handleDelete = async () => {
    const { success, error } = await softDeleteItem({ id, path: pathname });

    if (!success) {
      throw new Error(error || '삭제 실패');
    }
  };

  return <SoftDeleteButton onDelete={handleDelete}>{children}</SoftDeleteButton>;
}

export function HardDeleteItemButton({ id, children }: DeleteItemButtonProps) {
  const pathname = usePathname();

  const handleDelete = async () => {
    const { success, error } = await hardDeleteItem({ id, path: pathname });

    if (!success) {
      throw new Error(error || '삭제 실패');
    }
  };

  return <HardDeleteButton onDelete={handleDelete}>{children}</HardDeleteButton>;
}
