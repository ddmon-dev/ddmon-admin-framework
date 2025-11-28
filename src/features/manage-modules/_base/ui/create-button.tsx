'use client';

import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

interface CreateButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function CreateButton({ children, className }: CreateButtonProps) {
  const manageSheet = useManageSheet();

  return (
    <Button
      onClick={() => manageSheet.open({ mode: 'create' })}
      className={className}
    >
      {children ?? '생성'}
    </Button>
  );
}
