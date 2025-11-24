'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { softDelete, hardDelete } from '../actions';
import type { TableName } from '@/shared/lib/supabase/db-helpers';

interface DeleteButtonProps {
  tableName: TableName;
  id: string;
  deleteFn?: () => Promise<void>;
  children?: React.ReactNode;
}

export function SoftDeleteButton({ tableName, id, deleteFn, children }: DeleteButtonProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      deleteFn ? await deleteFn() : await softDelete({ tableName, id, pathname });
      alert('삭제되었습니다.');
    } catch (error) {
      console.error(error);
      alert('삭제 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size='sm'
      variant='destructive'
      onClick={handleClick}
      disabled={isLoading}
    >
      {children ?? '삭제'}
    </Button>
  );
}

export function HardDeleteButton({ tableName, id, deleteFn, children }: DeleteButtonProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      deleteFn ? await deleteFn() : await hardDelete({ tableName, id, pathname });
      alert('영구 삭제되었습니다.');
    } catch (error) {
      console.error(error);
      alert('삭제 실패');
    } finally {
      setIsLoading(false);
    }
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
