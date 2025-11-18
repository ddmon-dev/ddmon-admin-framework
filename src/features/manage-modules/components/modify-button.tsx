'use client';

import { Button } from '@/shared/ui/button';
import { useItemSheet } from './item-sheet';

interface ModifyButtonProps {
  itemId: string | number;
}

export function ModifyButton({ itemId }: ModifyButtonProps) {
  const { openItemSheet } = useItemSheet();

  return (
    <Button
      size='sm'
      variant='secondary'
      onClick={() => openItemSheet({ id: itemId, mode: 'modify' })}
    >
      수정
    </Button>
  );
}
