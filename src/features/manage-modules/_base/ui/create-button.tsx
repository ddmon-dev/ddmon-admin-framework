'use client';

import { Plus } from 'lucide-react';
import { useIsMobile } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

interface CreateButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function CreateButton({ children, className }: CreateButtonProps) {
  const manageSheet = useManageSheet();
  const isMobile = useIsMobile();

  return (
    <Button
      onClick={() => manageSheet.open({ mode: 'create' })}
      className={className}
      size={isMobile ? 'icon-sm' : 'default'}
    >
      {isMobile ? <Plus /> : children ?? '생성'}
    </Button>
  );
}
