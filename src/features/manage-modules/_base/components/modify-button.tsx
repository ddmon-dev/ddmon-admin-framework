'use client';

import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

interface ModifyButtonProps {
  itemId: string;
  children?: React.ReactNode;
}

export function ModifyButton({ itemId, children }: ModifyButtonProps) {
  const { openManageSheet } = useManageSheet();

  return (
    <Button
      size='sm'
      variant='secondary'
      onClick={() => openManageSheet({ id: itemId, mode: 'modify' })}
    >
      {children ?? '수정'}
    </Button>
  );
}
