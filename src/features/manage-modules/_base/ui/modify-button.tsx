'use client';

import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

interface ModifyButtonProps {
  id: string;
  children?: React.ReactNode;
}

export function ModifyButton({ id, children }: ModifyButtonProps) {
  const { openManageSheet } = useManageSheet();

  return (
    <Button
      size='sm'
      variant='secondary'
      onClick={() => openManageSheet({ id: id, mode: 'modify' })}
    >
      {children ?? '수정'}
    </Button>
  );
}
