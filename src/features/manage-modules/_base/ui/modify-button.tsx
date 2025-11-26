'use client';

import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

interface ModifyButtonProps {
  id: string;
  children?: React.ReactNode;
}

export function ModifyButton({ id, children }: ModifyButtonProps) {
  const manageSheet = useManageSheet();

  return (
    <Button
      size='sm'
      variant='secondary'
      onClick={() => manageSheet.open({ id: id, mode: 'modify' })}
    >
      {children ?? '수정'}
    </Button>
  );
}
