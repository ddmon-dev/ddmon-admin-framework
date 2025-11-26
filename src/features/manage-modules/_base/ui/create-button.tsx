'use client';

import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

export function CreateButton({ children }: { children: React.ReactNode }) {
  const manageSheet = useManageSheet();

  return <Button onClick={() => manageSheet.open({ mode: 'create' })}>{children ?? '생성'}</Button>;
}
