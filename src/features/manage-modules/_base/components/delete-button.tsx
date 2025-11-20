'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';

interface DeleteButtonProps {
  onDelete: () => Promise<void>;
  children?: React.ReactNode;
}

export function DeleteButton({ onDelete, children }: DeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onDelete();
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
