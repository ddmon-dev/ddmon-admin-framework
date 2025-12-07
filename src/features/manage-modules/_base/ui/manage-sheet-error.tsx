'use client';

import { Button } from '@/shared/ui/button';
import { ErrorStatus } from '@/shared/ui/status-pages';
import { useManageSheet } from './manage-sheet';

interface ManageSheetErrorProps {
  onRetry?: () => void;
}

export function ManageSheetError({ onRetry }: ManageSheetErrorProps) {
  const manageSheet = useManageSheet();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      manageSheet.close();
    }
  };

  return (
    <ErrorStatus
      actions={<Button onClick={handleRetry}>닫기</Button>}
      size='md'
    />
  );
}
