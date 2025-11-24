'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';

interface HardDeleteButtonProps {
  onDelete: () => Promise<void>;
  children?: React.ReactNode;
}

export function HardDeleteButton({ onDelete, children }: HardDeleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onDelete();
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
