'use client';

import { Button } from '@/shared/ui/button';
import { useManageSheet } from './manage-sheet';

export function CreateButton({ children }: { children: React.ReactNode }) {
  const { openManageSheet } = useManageSheet();

  return <Button onClick={() => openManageSheet({ mode: 'create' })}>{children ?? '생성'}</Button>;
}
