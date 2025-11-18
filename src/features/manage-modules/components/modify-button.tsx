'use client';

import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

interface ModifyButtonProps {
  itemId: string;
}

export function ModifyButton({ itemId }: ModifyButtonProps) {
  const { openManageSheet } = useManageSheet();

  return (
    <Button
      size='sm'
      variant='secondary'
      onClick={() => openManageSheet({ id: itemId, mode: 'modify' })}
    >
      수정
    </Button>
  );
}
